/**
 * CORTEX Decision Engine (CORTEX DE)
 * ---------------------------------------------------------------------------
 * Milestone 3 — Modular Reasoning Pipeline.
 *
 * Responsibility
 * --------------
 * Orchestrates the enterprise Decision Pipeline (ARCHITECTURE.md /
 * AI_ENGINEERING_RULES.md Section 9):
 *
 *   Request -> Context Engine -> Capability Resolution -> Agent Selection
 *   -> Reasoner Resolution -> Reasoning -> Confidence/Ranking
 *   -> Explainability -> Audit -> Memory -> Event Publish -> Response
 *
 * What changed from Sprint 1
 * ---------------------------
 * DecisionEngineService previously assembled its own context ad hoc
 * (direct memoryEngine/agentRegistry calls) and computed a mock score by
 * pattern-matching the entity ID string. It now:
 *
 *   1. Delegates context assembly entirely to ContextEngine (Milestone 2),
 *      instead of re-implementing a subset of it here.
 *   2. Resolves the required AgentCapability from
 *      config/decisionCapabilityMap.ts instead of a hardcoded switch.
 *   3. Selects the eligible agent by priority + health (Milestone 2
 *      AgentPluginMetadata fields) instead of taking eligibleAgents[0].
 *   4. Delegates all actual reasoning/scoring to a pluggable
 *      IDecisionReasoner resolved through ReasonerRegistry, instead of
 *      computing a mock score inline. See services/cortex-de/bootstrap.ts
 *      and services/cortex-de/reasoners/ for how domains plug in.
 *   5. Ranks recommendations/alternatives by confidence before returning.
 *   6. Wraps the full pipeline in error handling that publishes a
 *      DecisionFailed event on failure instead of throwing silently past
 *      observability.
 *
 * This file is deliberately domain-agnostic: it contains no Risk, Fraud,
 * Lending, or MSME-specific logic. Every future business domain is added
 * by implementing IDecisionReasoner and registering it in bootstrap.ts —
 * never by editing this file.
 */

import {
  AgentPluginMetadata,
  AlternativeRecommendation,
  AuditTrail,
  DecisionRequest,
  DecisionResult,
  Evidence,
  ReasoningTrace
} from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { memoryEngine } from '../memory/MemoryEngine';
import { explainabilityEngine } from '../explainability/ExplainabilityEngine';
import { agentRegistryService } from '../agent/AgentRegistry';
import { eventBus } from '../event-bus/EventBus';
import { contextEngine } from '../context/ContextEngine';
import { reasonerRegistryService } from './ReasonerRegistry';
import { defaultReasoner } from './reasoners/DefaultReasoner';
import { resolveRequiredCapability } from '@/config/decisionCapabilityMap';
import { bootstrapReasoners } from './bootstrap';

export class DecisionEngineService {
  private static instance: DecisionEngineService;

  private constructor() {
    // Ensure built-in reasoners (Risk today; more per future milestone)
    // are registered before the first decision is ever evaluated.
    bootstrapReasoners();
  }

  public static getInstance(): DecisionEngineService {
    if (!DecisionEngineService.instance) {
      DecisionEngineService.instance = new DecisionEngineService();
    }
    return DecisionEngineService.instance;
  }

  /**
   * Evaluates a decision request by processing it through the CORTEX Decision Pipeline lifecycle.
   */
  public async evaluateDecision(request: DecisionRequest): Promise<DecisionResult> {
    const startTime = performance.now();
    const correlationId = request.correlationId;
    const decisionId = `DEC-${request.decisionType.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    console.log(`[CORTEX-DE] Beginning Decision Pipeline evaluation for ID: ${decisionId} (Correlation: ${correlationId})`);

    return observabilityService.measure(
      'cortex-de',
      `evaluate-${request.decisionType}`,
      async () => {
        try {
          return await this.runPipeline(request, decisionId, correlationId, startTime);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          console.error(`[CORTEX-DE] Decision Pipeline FAILED for ${decisionId}: ${reason}`);

          await eventBus.publish({
            id: `EVT-DEC-${Math.random().toString(36).substr(2, 9)}`,
            type: 'DecisionFailed',
            timestamp: new Date().toISOString(),
            source: 'cortex-de',
            payload: { decisionId, requestId: request.id, entityId: request.entityId, reason },
            correlationId
          });

          throw error;
        }
      },
      { requestId: request.id, decisionType: request.decisionType }
    );
  }

  /**
   * The actual pipeline. Split out from evaluateDecision so the outer
   * method's only job is timing + error-boundary handling.
   */
  private async runPipeline(
    request: DecisionRequest,
    decisionId: string,
    correlationId: string,
    startTime: number
  ): Promise<DecisionResult> {
    const reasoningTraceSteps: ReasoningTrace['steps'] = [];

    // 1. Context Assembly — delegated entirely to ContextEngine (Milestone 2).
    reasoningTraceSteps.push({
      observation: `Request type: ${request.decisionType} for Entity: ${request.entityType} (${request.entityId})`,
      thought: 'Initializing decision context parameters and validating input structures.',
      timestamp: new Date().toISOString()
    });

    const context = await contextEngine.assembleContext({
      entityType: request.entityType,
      entityId: request.entityId,
      correlationId,
      initiatorId: request.initiatorId,
      decisionType: request.decisionType
    });

    reasoningTraceSteps.push({
      thought: 'Assembled unified DecisionContext via Context Engine (Memory, Agents, Capabilities, RBAC, Workflow, recent Events).',
      observation: `Context ${context.contextId}: ${context.memory.length} memory entries, ${context.capabilities.length} relevant capabilities, ${context.agents.length} candidate agents.`,
      timestamp: new Date().toISOString()
    });

    // 2. Capability Resolution — config-driven, not a hardcoded switch.
    const requiredCapability = resolveRequiredCapability(request.decisionType);
    reasoningTraceSteps.push({
      thought: `Resolving required operational capability for request type "${request.decisionType}" via config/decisionCapabilityMap.ts.`,
      observation: `Required capability determined: "${requiredCapability}".`,
      timestamp: new Date().toISOString()
    });

    // 3. Agent Selection — prioritized and health-aware.
    const primaryAgent = this.selectAgent(requiredCapability, context.agents);
    if (!primaryAgent) {
      throw new Error(`No active, healthy agent found in registry supporting capability: ${requiredCapability}`);
    }
    reasoningTraceSteps.push({
      agentId: primaryAgent.id,
      capabilityName: requiredCapability,
      thought: `Selected the highest-priority healthy agent supporting capability "${requiredCapability}" from ${context.agents.length} candidates.`,
      observation: `Selected Agent: "${primaryAgent.name}" (ID: ${primaryAgent.id}, Priority: ${primaryAgent.priority}, Health: ${primaryAgent.health}, Status: ${primaryAgent.status}).`,
      timestamp: new Date().toISOString()
    });

    // 4. Reasoner Resolution — pluggable, resolved through the registry.
    const reasoner =
      reasonerRegistryService.getReasonerForDecisionType(request.decisionType, requiredCapability) ?? defaultReasoner;
    reasoningTraceSteps.push({
      capabilityName: reasoner.capability,
      thought: `Resolved reasoning plugin for decisionType "${request.decisionType}".`,
      observation: `Reasoner selected: "${reasoner.name}".`,
      timestamp: new Date().toISOString()
    });

    // 5. Reasoning — fully delegated to the resolved IDecisionReasoner.
    const reasonerOutput = await reasoner.reason({ request, context });
    reasoningTraceSteps.push(...reasonerOutput.traceSteps);

    // 6. Decision Ranking — alternatives sorted by descending confidence.
    const rankedAlternatives: AlternativeRecommendation[] = [...reasonerOutput.alternatives].sort(
      (a, b) => b.recommendation.confidenceScore - a.recommendation.confidenceScore
    );

    // 7. Audit + Explainability.
    const auditTrail: AuditTrail = {
      operatorId: request.initiatorId,
      action: `DECISION_EVALUATE_${request.decisionType}`,
      timestamp: new Date().toISOString()
    };

    const evidence: Evidence[] = [
      ...reasonerOutput.evidence,
      ...context.memory.slice(0, 5).map(mem => ({
        sourceType: 'MEMORY' as const,
        sourceId: mem.id,
        description: mem.summary,
        dataSnapshot: mem.value
      }))
    ];

    const explanation = explainabilityEngine.generateExplanation(
      decisionId,
      `The decision resolved as ${reasonerOutput.status} with a confidence score of ${reasonerOutput.score}/100, evaluated by "${reasoner.name}" via the ${primaryAgent.name} agent.`,
      evidence,
      { steps: reasoningTraceSteps },
      auditTrail,
      rankedAlternatives
    );

    // 8. Recommendation Generation & Result Assembly.
    const result: DecisionResult = {
      decisionId,
      requestId: request.id,
      entityId: request.entityId,
      status: reasonerOutput.status,
      confidenceScore: reasonerOutput.score / 100,
      recommendations: [reasonerOutput.primaryRecommendation],
      explanation,
      evaluatedAt: new Date().toISOString()
    };

    // 9. Persist to Memory History.
    await memoryEngine.store(
      'DecisionHistory',
      request.entityId,
      decisionId,
      result as any,
      `Decision ${request.decisionType} completed with status ${result.status}. Confidence Score: ${(result.confidenceScore * 100).toFixed(0)}%.`,
      9,
      ['decision', request.decisionType]
    );

    // 10. Publish Completed Event.
    await eventBus.publish({
      id: `EVT-DEC-${Math.random().toString(36).substr(2, 9)}`,
      type: 'DecisionCompleted',
      timestamp: new Date().toISOString(),
      source: 'cortex-de',
      payload: { decisionId, status: result.status, entityId: request.entityId },
      correlationId
    });

    const totalDuration = performance.now() - startTime;
    console.log(`[CORTEX-DE] Decision Pipeline complete for ${decisionId} in ${totalDuration.toFixed(2)}ms.`);

    return result;
  }

  /**
   * Selects the best-suited agent for a capability from a candidate list,
   * falling back to a full registry scan if the Context Engine's
   * candidate list (which is scoped by capability/entity relevance) came
   * back empty. Prioritization: capability match required; among
   * matches, HEALTHY agents are preferred over DEGRADED, and lower
   * `priority` value wins (matches AgentPluginMetadata's documented
   * "lower value = higher priority" convention from Milestone 2).
   */
  private selectAgent(capability: string, candidates: AgentPluginMetadata[]): AgentPluginMetadata | undefined {
    const pool = candidates.length > 0 ? candidates : agentRegistryService.getAllAgents();

    const eligible = pool.filter(
      agent => agent.capabilities.includes(capability as any) && agent.status !== 'OFFLINE' && agent.health !== 'UNHEALTHY'
    );

    if (eligible.length === 0) return undefined;

    const healthRank: Record<string, number> = { HEALTHY: 0, DEGRADED: 1, UNHEALTHY: 2 };

    return [...eligible].sort((a, b) => {
      const healthDiff = healthRank[a.health] - healthRank[b.health];
      if (healthDiff !== 0) return healthDiff;
      return a.priority - b.priority;
    })[0];
  }
}

export const decisionEngineService = DecisionEngineService.getInstance();
export default decisionEngineService;
