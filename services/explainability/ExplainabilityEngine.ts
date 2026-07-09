import { DecisionExplanation, Evidence, ReasoningTrace, AuditTrail, AlternativeRecommendation, Recommendation } from '@/types';

export class ExplainabilityEngine {
  private static instance: ExplainabilityEngine;

  private constructor() {}

  public static getInstance(): ExplainabilityEngine {
    if (!ExplainabilityEngine.instance) {
      ExplainabilityEngine.instance = new ExplainabilityEngine();
    }
    return ExplainabilityEngine.instance;
  }

  /**
   * Compiles decision factor inputs into an explainability report.
   */
  public generateExplanation(
    decisionId: string,
    primaryRationale: string,
    evidence: Evidence[],
    trace: ReasoningTrace,
    auditTrail: AuditTrail,
    alternatives: AlternativeRecommendation[]
  ): DecisionExplanation {
    return {
      decisionId,
      primaryRationale,
      evidence,
      reasoningTrace: trace,
      auditTrail,
      alternatives
    };
  }

  /**
   * Helper to compile a standard reasoning trace from agents.
   */
  public createReasoningTrace(steps: { agentId?: string; capabilityName?: string; thought: string; observation: string }[]): ReasoningTrace {
    return {
      steps: steps.map(step => ({
        ...step,
        timestamp: new Date().toISOString()
      }))
    };
  }

  /**
   * Pre-compiles standard mock alternative recommendations for decisions.
   */
  public compileMockAlternatives(primaryRec: Recommendation): AlternativeRecommendation[] {
    return [
      {
        recommendation: {
          id: `REC-ALT-01-${Math.random().toString(36).substr(2, 5)}`,
          title: `Reduce Exposure Level`,
          description: `Structure the transaction with 20% lower funding cap and request additional guarantor signatures.`,
          confidenceScore: primaryRec.confidenceScore - 0.15
        },
        tradeoffs: [
          'Decreases immediate defaults risk profile',
          'Slightly reduces net interest income margins'
        ]
      },
      {
        recommendation: {
          id: `REC-ALT-02-${Math.random().toString(36).substr(2, 5)}`,
          title: `Defer Decision Loop`,
          description: `Defer approval cycle until secondary audit verification fields are loaded from the Account Aggregator service.`,
          confidenceScore: primaryRec.confidenceScore - 0.25
        },
        tradeoffs: [
          'Provides complete transaction data resolution',
          'Increases decision latency pipeline by 72 hours'
        ]
      }
    ];
  }
}

export const explainabilityEngine = ExplainabilityEngine.getInstance();
export default explainabilityEngine;
