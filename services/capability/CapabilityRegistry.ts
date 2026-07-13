/**
 * Enterprise Capability Registry
 * ---------------------------------------------------------------------------
 * Core Engine: Capability Registry (AI_ENGINEERING_RULES.md Section 4 & 13).
 *
 * Responsibility
 * --------------
 * Dynamically registers and exposes top-level enterprise capabilities
 * (Customer Intelligence, Retail Lending, MSME Intelligence, Wealth
 * Intelligence, Fraud Intelligence, Risk Intelligence, Compliance
 * Intelligence, Decision Intelligence, Executive Intelligence, Document
 * Intelligence, Simulation Engine, Knowledge Graph, Digital Twin).
 *
 * Per AI_ENGINEERING_RULES.md Section 13, feature availability must
 * never be hardcoded — the Decision Engine, workspaces, and agents
 * resolve what the platform can currently do through this registry
 * rather than through conditional logic scattered across the codebase.
 *
 * Note on naming: this registry is distinct from CAPABILITY_REGISTRY in
 * config/capabilities.ts, which describes individual AgentCapability
 * skills (e.g. 'CreditAssessment') with their I/O schemas. This registry
 * operates one level higher, at the business-capability/module level.
 * Both are legitimate, non-duplicative concepts and are intentionally
 * kept separate.
 */

import { EnterpriseCapabilityId, EnterpriseCapabilityMetadata, EnterpriseCapabilityStatus, ICapabilityRegistry, BankingEntityType, WorkflowType } from '@/types';
import { ENTERPRISE_CAPABILITY_REGISTRY } from '@/config/enterpriseCapabilities';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';

export class CapabilityRegistryService implements ICapabilityRegistry {
  private static instance: CapabilityRegistryService;
  private capabilities: Map<EnterpriseCapabilityId, EnterpriseCapabilityMetadata> = new Map();

  private constructor() {
    // Bootstrap static config capabilities (config/enterpriseCapabilities.ts)
    ENTERPRISE_CAPABILITY_REGISTRY.forEach(capability => {
      this.capabilities.set(capability.id, capability);
    });
  }

  public static getInstance(): CapabilityRegistryService {
    if (!CapabilityRegistryService.instance) {
      CapabilityRegistryService.instance = new CapabilityRegistryService();
    }
    return CapabilityRegistryService.instance;
  }

  /**
   * Registers a new capability, or overwrites metadata for an existing
   * capability id. Publishes CapabilityRegistered to the Event Bus so
   * interested subscribers (e.g. workspace shell, agent orchestration)
   * can react without this registry calling them directly.
   */
  public register(capability: EnterpriseCapabilityMetadata): void {
    if (this.capabilities.has(capability.id)) {
      console.warn(`[CapabilityRegistry] Capability "${capability.id}" already registered. Overwriting metadata.`);
    }
    this.capabilities.set(capability.id, capability);

    observabilityService.recordExecution('capability-registry', 'register', {
      capabilityId: capability.id,
      name: capability.name
    });

    void eventBus.publish({
      id: `EVT-CAP-${Math.random().toString(36).substr(2, 9)}`,
      type: 'CapabilityRegistered',
      timestamp: new Date().toISOString(),
      source: 'capability-registry',
      payload: { capabilityId: capability.id, name: capability.name },
      correlationId: `CORR-CAP-${capability.id}`
    });
  }

  /**
   * Unregisters a capability by id.
   */
  public unregister(id: EnterpriseCapabilityId): boolean {
    const existed = this.capabilities.delete(id);

    if (existed) {
      observabilityService.recordExecution('capability-registry', 'unregister', { capabilityId: id });

      void eventBus.publish({
        id: `EVT-CAP-${Math.random().toString(36).substr(2, 9)}`,
        type: 'CapabilityUnregistered',
        timestamp: new Date().toISOString(),
        source: 'capability-registry',
        payload: { capabilityId: id },
        correlationId: `CORR-CAP-${id}`
      });
    }

    return existed;
  }

  /**
   * Discovers capabilities matching any combination of the given filters.
   * All provided filters are combined with AND semantics.
   */
  public discover(filter: {
    supportedEntity?: BankingEntityType;
    requiredService?: string;
    workflow?: WorkflowType;
    status?: EnterpriseCapabilityStatus;
  }): EnterpriseCapabilityMetadata[] {
    return this.list().filter(capability => {
      if (filter.supportedEntity && !capability.supportedEntities.includes(filter.supportedEntity)) {
        return false;
      }
      if (filter.requiredService && !capability.requiredServices.includes(filter.requiredService)) {
        return false;
      }
      if (filter.workflow && !capability.supportedWorkflows.includes(filter.workflow)) {
        return false;
      }
      if (filter.status && capability.status !== filter.status) {
        return false;
      }
      return true;
    });
  }

  /**
   * Returns every registered capability.
   */
  public list(): EnterpriseCapabilityMetadata[] {
    return Array.from(this.capabilities.values());
  }

  /**
   * Finds a capability by id.
   */
  public getById(id: EnterpriseCapabilityId): EnterpriseCapabilityMetadata | undefined {
    return this.capabilities.get(id);
  }
}

export const capabilityRegistryService = CapabilityRegistryService.getInstance();
export default capabilityRegistryService;
