/**
 * Enterprise Context Engine
 * ---------------------------------------------------------------------------
 * Foundational enterprise subsystem (Milestone 2, item 4).
 *
 * Responsibility
 * --------------
 * Before every decision reaches the CORTEX Decision Engine, assemble a
 * single unified DecisionContext from Memory, the Agent Registry, the
 * Capability Registry, RBAC, the active Workflow, and recent Event Bus
 * activity.
 *
 * This engine performs NO reasoning, scoring, or recommendation
 * generation. It is a pure assembly/read layer; all reasoning remains
 * the exclusive responsibility of the CORTEX Decision Engine
 * (services/cortex-de/DecisionEngine.ts), which is explicitly out of
 * scope for this milestone and is not modified here.
 *
 * Placeholders (explicitly acknowledged, per instructions):
 * - Knowledge Graph and Digital Twin engines are not implemented yet
 *   (deferred to a later milestone). This engine assembles lightweight
 *   KnowledgeGraphReference / DigitalTwinReference placeholders sourced
 *   from the Domain Registry rather than full graph/twin objects, so
 *   DecisionContext's shape will not need to change once those engines
 *   exist — only these two fields will gain real data.
 *
 * Integration approach
 * ---------------------
 * Read-oriented aggregation (Memory, Agents, Capabilities, RBAC,
 * Workflow, recent Events) is performed via direct calls to the
 * respective engines' public interfaces, mirroring the precedent already
 * established in services/cortex-de/DecisionEngine.ts (which directly
 * calls memoryEngine, agentRegistryService, and workflowEngine). Per
 * ARCHITECTURE.md, the Decision Engine (and, as its context-assembly
 * counterpart, this engine) sits architecturally above these engines and
 * is expected to read from them directly; the Event Bus governs
 * *notification* of state changes between peer business services
 * (AI_ENGINEERING_RULES.md Section 8's CustomerService/FraudService
 * example), not upward aggregation reads by an orchestration-tier engine.
 * Every assembly still publishes a ContextAssembled notification to the
 * Event Bus on completion, so downstream subscribers can react without
 * this engine calling them directly.
 */

import {
  AccessControlContext,
  ContextAssemblyRequest,
  DecisionContext,
  DigitalTwinReference,
  IContextEngine,
  KnowledgeGraphReference
} from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';
import { memoryEngine } from '../memory/MemoryEngine';
import { agentRegistryService } from '../agent/AgentRegistry';
import { capabilityRegistryService } from '../capability/CapabilityRegistry';
import { domainRegistryService } from '../domain/DomainRegistry';
import { workflowEngine } from '../workflow/WorkflowEngine';
import { rbacService } from '../rbac/RBACService';
import { customerService } from '../business/CustomerService';
import { msmeAnalysisService } from '../business/MSMEAnalysisService';

export class ContextEngine implements IContextEngine {
  private static instance: ContextEngine;

  private constructor() {}

  public static getInstance(): ContextEngine {
    if (!ContextEngine.instance) {
      ContextEngine.instance = new ContextEngine();
    }
    return ContextEngine.instance;
  }

  /**
   * Assembles a unified DecisionContext for the given entity. Performs no
   * reasoning — only gathers existing state from other engines.
   */
  public async assembleContext(request: ContextAssemblyRequest): Promise<DecisionContext> {
    return observabilityService.measure(
      'context-engine',
      'assembleContext',
      async () => {
        const contextId = `CTX-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // 1. Resolve entity snapshot (Customer or MSME today; other entity
        //    types are memory/registry-only until their business services exist).
        const entitySnapshot =
          request.entityType === 'Customer'
            ? await customerService.getCustomerById(request.entityId)
            : request.entityType === 'MSME'
              ? await msmeAnalysisService.getMSMEById(request.entityId)
              : undefined;

        // 2. Memory context — general entity memory plus decision/recommendation history.
        const memoryType = request.entityType === 'MSME' ? 'MSMEMemory' : 'CustomerMemory';
        const [memory, decisionHistory, recommendationHistory] = await Promise.all([
          memoryEngine.recall(memoryType, request.entityId),
          memoryEngine.recall('DecisionHistory', request.entityId),
          memoryEngine.recall('RecommendationsHistory', request.entityId)
        ]);

        // 3. Knowledge Graph / Digital Twin placeholder references.
        //    Real graph/twin engines are out of scope for this milestone;
        //    we only confirm the entity is known to the Domain Registry.
        const knownEntityType = domainRegistryService.discoverEntity(request.entityId);
        const knowledgeGraphRefs: KnowledgeGraphReference[] = knownEntityType
          ? [
              {
                nodeId: request.entityId,
                entityType: knownEntityType,
                relation: 'SELF',
                note: 'Placeholder reference — Knowledge Graph Service not yet implemented (deferred milestone).'
              }
            ]
          : [];

        const digitalTwinRefs: DigitalTwinReference[] =
          knownEntityType === 'Customer' || knownEntityType === 'MSME'
            ? [
                {
                  entityType: knownEntityType,
                  entityId: request.entityId,
                  note: 'Placeholder reference — Digital Twin Engine not yet implemented (deferred milestone).'
                }
              ]
            : [];

        // 4. Capability metadata relevant to this entity type.
        const capabilities = capabilityRegistryService.discover({
          supportedEntity: request.entityType
        });

        // 5. Agent metadata — agents that support any of the resolved
        //    capabilities' required services, deduplicated. Falls back to
        //    entity-supporting agents when no capability-linked match exists.
        const relevantServiceNames = new Set(capabilities.flatMap(c => c.requiredServices));
        const agentsByService = agentRegistryService
          .getAllAgents()
          .filter(agent => agent.requiredServices.some(svc => relevantServiceNames.has(svc)));
        const agents =
          agentsByService.length > 0
            ? agentsByService
            : agentRegistryService.getAllAgents().filter(agent => agent.supportedEntities.includes(request.entityType));

        // 6. Current workflow instance touching this entity, if any.
        const currentWorkflow = workflowEngine
          .listAllInstances()
          .find(instance => instance.context?.entityId === request.entityId && instance.status === 'IN_PROGRESS');

        // 7. Caller's current RBAC context.
        const accessControl: AccessControlContext = rbacService.getContext();

        // 8. Recent Event Bus activity touching this entity (best-effort
        //    payload inspection, since payload shapes vary by EventType).
        const recentEvents = eventBus
          .getRecentEvents(undefined, 100)
          .filter(event => (event.payload as any)?.entityId === request.entityId)
          .slice(0, 20);

        const context: DecisionContext = {
          contextId,
          correlationId: request.correlationId,
          entityType: request.entityType,
          entityId: request.entityId,
          entitySnapshot,
          memory,
          knowledgeGraphRefs,
          digitalTwinRefs,
          capabilities,
          agents,
          currentWorkflow,
          accessControl,
          recentEvents,
          decisionHistory,
          recommendationHistory,
          assembledAt: new Date().toISOString()
        };

        await eventBus.publish({
          id: `EVT-CTX-${Math.random().toString(36).substr(2, 9)}`,
          type: 'ContextAssembled',
          timestamp: new Date().toISOString(),
          source: 'context-engine',
          payload: {
            contextId,
            entityType: request.entityType,
            entityId: request.entityId,
            correlationId: request.correlationId
          },
          correlationId: request.correlationId
        });

        return context;
      },
      { entityType: request.entityType, entityId: request.entityId }
    );
  }
}

export const contextEngine = ContextEngine.getInstance();
export default contextEngine;
