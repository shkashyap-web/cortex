/**
 * Reasoner Registry
 * ---------------------------------------------------------------------------
 * Milestone 3 subsystem of the CORTEX Decision Engine.
 *
 * Responsibility
 * --------------
 * Runtime plugin host for IDecisionReasoner implementations. This is the
 * mechanism that lets business domains (Risk today; Fraud, Lending,
 * MSME, Wealth, Compliance, Executive Intelligence tomorrow) plug real
 * reasoning into DecisionEngineService without DecisionEngineService
 * itself ever being modified — mirroring the existing AgentRegistry /
 * CapabilityRegistry discovery pattern (AI_ENGINEERING_RULES.md Section
 * 12: "Agents are plugins... never hardcode them").
 *
 * DecisionEngineService asks this registry "who handles decisionType X
 * for capability Y?" and never holds reasoning logic itself.
 */

import { AgentCapability, IDecisionReasoner, IReasonerRegistry } from '@/types';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';

export class ReasonerRegistryService implements IReasonerRegistry {
  private static instance: ReasonerRegistryService;
  private reasoners: Map<AgentCapability, IDecisionReasoner> = new Map();

  private constructor() {}

  public static getInstance(): ReasonerRegistryService {
    if (!ReasonerRegistryService.instance) {
      ReasonerRegistryService.instance = new ReasonerRegistryService();
    }
    return ReasonerRegistryService.instance;
  }

  /**
   * Registers a reasoner for its declared capability. One reasoner per
   * capability is supported today (mirrors one-agent-per-capability
   * discovery); registering a second reasoner for an already-registered
   * capability overwrites it, consistent with AgentRegistry/CapabilityRegistry
   * overwrite semantics.
   */
  public register(reasoner: IDecisionReasoner): void {
    if (this.reasoners.has(reasoner.capability)) {
      console.warn(
        `[ReasonerRegistry] Reasoner for capability "${reasoner.capability}" already registered. Overwriting with "${reasoner.name}".`
      );
    }
    this.reasoners.set(reasoner.capability, reasoner);

    observabilityService.recordExecution('reasoner-registry', 'register', {
      capability: reasoner.capability,
      name: reasoner.name
    });

    void eventBus.publish({
      id: `EVT-RSN-${Math.random().toString(36).substr(2, 9)}`,
      type: 'ReasonerRegistered',
      timestamp: new Date().toISOString(),
      source: 'reasoner-registry',
      payload: { capability: reasoner.capability, decisionTypes: [] },
      correlationId: `CORR-RSN-${reasoner.capability}`
    });
  }

  public unregister(capability: AgentCapability): boolean {
    return this.reasoners.delete(capability);
  }

  /**
   * Resolves the reasoner for a given decision type + required capability.
   *
   * Resolution order:
   *   1. The reasoner registered under `capability`, if it accepts this
   *      decisionType (the common case — e.g. RiskScoring capability
   *      resolves straight to RiskReasoner).
   *   2. Any other registered reasoner that declares support for this
   *      decisionType, in registration order. This exists because
   *      capability resolution (config/decisionCapabilityMap.ts) picks
   *      the capability an *agent* would use to service the request,
   *      which may differ from which domain actually has reasoning
   *      implemented today (e.g. LOAN_APPROVAL resolves to
   *      'CreditAssessment' for agent selection, but RiskReasoner — the
   *      only reasoner implemented so far — can still meaningfully
   *      evaluate it via credit-risk scoring).
   *
   * Returns undefined only if no registered reasoner supports this
   * decisionType at all — callers fall back to DefaultReasoner in that
   * case rather than treating it as an error.
   */
  public getReasonerForDecisionType(decisionType: string, capability: AgentCapability): IDecisionReasoner | undefined {
    const primary = this.reasoners.get(capability);
    if (primary && primary.supportsDecisionType(decisionType)) return primary;

    return this.listReasoners().find(r => r.supportsDecisionType(decisionType));
  }

  public getReasonerByCapability(capability: AgentCapability): IDecisionReasoner | undefined {
    return this.reasoners.get(capability);
  }

  public listReasoners(): IDecisionReasoner[] {
    return Array.from(this.reasoners.values());
  }
}

export const reasonerRegistryService = ReasonerRegistryService.getInstance();
export default reasonerRegistryService;
