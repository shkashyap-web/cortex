/**
 * Default Reasoner
 * ---------------------------------------------------------------------------
 * Milestone 3 fallback IDecisionReasoner.
 *
 * Responsibility
 * --------------
 * Services any decisionType for which no domain-specific reasoner is
 * registered (everything outside Risk/Loan/MSME-cashflow today — Fraud,
 * Wealth, Compliance, Executive Intelligence, and any future
 * decisionType). Preserves the deterministic entity-ID-based mock
 * scoring DecisionEngineService previously had inline, so existing demo
 * flows for those decision types keep producing identical results —
 * this refactor is additive/backward-compatible, not a behavior change,
 * for anything outside the Risk domain.
 *
 * This reasoner is intentionally always registered and always matches
 * (supportsDecisionType returns true unconditionally) so
 * ReasonerRegistry / DecisionEngineService always have somewhere to
 * fall back to — it functions as the registry's "no plugin found yet"
 * safety net rather than a real business capability.
 */

import { AgentCapability, DecisionResult, Evidence, IDecisionReasoner, ReasonerInput, ReasonerOutput } from '@/types';
import { ConfidenceScoring } from '../ConfidenceScoring';

export class DefaultReasoner implements IDecisionReasoner {
  public readonly capability: AgentCapability = 'RecommendationGeneration';
  public readonly name = 'Default Reasoner (fallback)';

  public supportsDecisionType(_decisionType: string): boolean {
    return true;
  }

  public async reason(input: ReasonerInput): Promise<ReasonerOutput> {
    const { request } = input;

    // Preserves the original deterministic demo scoring from the prior
    // DecisionEngineService.calculateMockDecisionScore(), expressed as a
    // single weighted factor so it still flows through the shared
    // Confidence Scoring Framework rather than being a special case.
    const mockScore = this.calculateMockDecisionScore(request.entityId);

    const scoreResult = ConfidenceScoring.score([
      {
        name: 'Demo Heuristic Score',
        score: mockScore,
        weight: 1,
        influence: mockScore >= 60 ? 'POSITIVE' : mockScore >= 40 ? 'NEUTRAL' : 'NEGATIVE',
        description: `Deterministic placeholder score derived from entity ID ${request.entityId}, pending a registered reasoner for capability required by decisionType "${request.decisionType}".`
      }
    ]);

    const status = ConfidenceScoring.statusForScore(scoreResult.overallScore);

    const evidence: Evidence[] = [
      {
        sourceType: 'CALCULATION',
        sourceId: `DEFAULT-${request.entityId}`,
        description: `No domain-specific reasoner is registered for decisionType "${request.decisionType}" yet. Using deterministic placeholder scoring.`,
        dataSnapshot: { entityId: request.entityId, decisionType: request.decisionType }
      }
    ];

    const primaryRecommendation = this.buildRecommendation(request.decisionType, status, scoreResult.overallScore);

    return {
      score: scoreResult.overallScore,
      status,
      primaryRecommendation,
      alternatives: [],
      evidence,
      traceSteps: [
        {
          thought: `Executing fallback reasoning: no registered domain reasoner supports decisionType "${request.decisionType}" today.`,
          observation: `Placeholder score: ${scoreResult.overallScore}/100 → status ${status}.`,
          action: 'DefaultReasoner.reason',
          timestamp: new Date().toISOString()
        }
      ],
      factors: scoreResult.factors
    };
  }

  private calculateMockDecisionScore(entityId: string): number {
    if (entityId.includes('001')) return 85;
    if (entityId.includes('002')) return 92;
    if (entityId.includes('003')) return 55;
    if (entityId.includes('004')) return 22;
    return 75;
  }

  private buildRecommendation(decisionType: string, status: DecisionResult['status'], score: number) {
    const id = `REC-DEF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    if (decisionType === 'LOAN_APPROVAL') {
      if (status === 'APPROVED') {
        return {
          id,
          title: 'Disburse Working Capital',
          description: `Disburse approved loan amount under standard rate terms. Interest rate suggested: 10.25% based on risk score: ${score}/100.`,
          confidenceScore: 0.94,
          impactMetric: '+1.5% Asset Expansion'
        };
      }
      if (status === 'MANUAL_REVIEW') {
        return {
          id,
          title: 'Request Co-Signatures',
          description: `Credit score of ${score}/100 warrants secondary backing. Require personal guarantees or co-signatures.`,
          confidenceScore: 0.72,
          impactMetric: 'Risk mitigation'
        };
      }
      return {
        id,
        title: 'Reject Credit Application',
        description: `Application score of ${score}/100 is below credit policy margins. High probability of default detected.`,
        confidenceScore: 0.88,
        impactMetric: 'Loss prevention'
      };
    }

    return {
      id,
      title: 'Authorize Operational Override',
      description: `Proceed with normal transaction cycles under monitoring status (score ${score}/100).`,
      confidenceScore: 0.85
    };
  }
}

export const defaultReasoner = new DefaultReasoner();
export default defaultReasoner;
