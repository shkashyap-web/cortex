/**
 * Risk Reasoner
 * ---------------------------------------------------------------------------
 * Milestone 3 reference implementation of IDecisionReasoner.
 *
 * Responsibility
 * --------------
 * Provides real, data-backed reasoning for decisions that hinge on an
 * entity's risk profile — LOAN_APPROVAL, RISK_ASSESSMENT, and
 * MSME_CASHFLOW today — by calling RiskService (backed by the
 * data/riskAlerts.ts mock dataset) instead of the ID-string heuristic
 * DecisionEngineService previously used.
 *
 * This is the ONE domain wired end-to-end for Milestone 3, per
 * instruction. It exists specifically to prove out the reasoner plugin
 * pattern: every other domain (Fraud, Wealth, Compliance, Executive
 * Intelligence, ...) can follow this exact shape once its own data
 * module and business service are ready, without any change to
 * DecisionEngineService, ReasonerRegistry, or the plugin interfaces
 * themselves.
 *
 * When no RiskAssessment exists for the entity (data module is
 * intentionally minimal), this reasoner degrades gracefully to a
 * neutral, low-confidence result with explanatory evidence — it never
 * throws for missing data, per IDecisionReasoner's contract.
 */

import {
  AgentCapability,
  DecisionResult,
  Evidence,
  IDecisionReasoner,
  ReasonerInput,
  ReasonerOutput,
  RiskAssessment
} from '@/types';
import { riskService } from '../../business/RiskService';
import { ConfidenceScoring } from '../ConfidenceScoring';

const SUPPORTED_DECISION_TYPES = new Set(['LOAN_APPROVAL', 'RISK_ASSESSMENT', 'MSME_CASHFLOW']);

export class RiskReasoner implements IDecisionReasoner {
  public readonly capability: AgentCapability = 'RiskScoring';
  public readonly name = 'Risk Reasoner';

  public supportsDecisionType(decisionType: string): boolean {
    return SUPPORTED_DECISION_TYPES.has(decisionType);
  }

  public async reason(input: ReasonerInput): Promise<ReasonerOutput> {
    const { request, context } = input;

    const assessment = await riskService.getRiskAssessmentForEntity(request.entityType, request.entityId);

    if (!assessment) {
      return this.reasonWithoutAssessment(input);
    }

    return this.reasonFromAssessment(assessment, input);
  }

  /**
   * Primary path: a real RiskAssessment exists in the dataset. Converts
   * its weighted factors into a normalized score via the shared
   * Confidence Scoring Framework, then derives status, a primary
   * recommendation, and alternatives from that score.
   */
  private reasonFromAssessment(assessment: RiskAssessment, input: ReasonerInput): ReasonerOutput {
    const { request } = input;

    const scoreResult = ConfidenceScoring.score(
      assessment.factors.map(f => ({
        name: f.factorName,
        score: f.score,
        weight: f.weight,
        influence: f.score >= 60 ? 'POSITIVE' : f.score >= 40 ? 'NEUTRAL' : 'NEGATIVE',
        description: f.description
      }))
    );

    const status = ConfidenceScoring.statusForScore(scoreResult.overallScore);

    const evidence: Evidence[] = [
      {
        sourceType: 'CALCULATION',
        sourceId: assessment.id,
        description: `RiskService assessment for ${assessment.entityType} ${assessment.entityId}, assessed by ${assessment.assessorId} on ${assessment.assessedAt}.`,
        dataSnapshot: assessment
      }
    ];

    const primaryRecommendation = this.buildRecommendation(request.decisionType, status, scoreResult.overallScore);
    const alternatives = this.buildAlternatives(status, scoreResult.overallScore, primaryRecommendation.confidenceScore);

    const traceSteps: ReasonerOutput['traceSteps'] = [
      {
        capabilityName: this.capability,
        thought: `Retrieved RiskAssessment ${assessment.id} for entity ${assessment.entityId} and computed a weighted confidence score across ${assessment.factors.length} factors.`,
        observation: `Weighted risk score: ${scoreResult.overallScore}/100 → status ${status}.`,
        action: 'RiskReasoner.reasonFromAssessment',
        timestamp: new Date().toISOString()
      }
    ];

    return {
      score: scoreResult.overallScore,
      status,
      primaryRecommendation,
      alternatives,
      evidence,
      traceSteps,
      factors: scoreResult.factors
    };
  }

  /**
   * Degraded path: no RiskAssessment on record for this entity. Returns
   * a neutral MANUAL_REVIEW result rather than fabricating a score, and
   * says so explicitly in the evidence and trace — this is the
   * "architecture-ready but unimplemented" behavior for entities outside
   * the minimal mock dataset.
   */
  private reasonWithoutAssessment(input: ReasonerInput): ReasonerOutput {
    const { request } = input;
    const score = 50;
    const status: DecisionResult['status'] = 'MANUAL_REVIEW';

    const evidence: Evidence[] = [
      {
        sourceType: 'CALCULATION',
        sourceId: `NO-ASSESSMENT-${request.entityId}`,
        description: `No RiskAssessment record found for ${request.entityType} ${request.entityId} in the current mock risk dataset.`,
        dataSnapshot: { entityType: request.entityType, entityId: request.entityId }
      }
    ];

    const primaryRecommendation = this.buildRecommendation(request.decisionType, status, score);
    primaryRecommendation.description += ' Insufficient risk data on record — recommend manual underwriting review.';
    primaryRecommendation.confidenceScore = 0.4;

    return {
      score,
      status,
      primaryRecommendation,
      alternatives: this.buildAlternatives(status, score, primaryRecommendation.confidenceScore),
      evidence,
      traceSteps: [
        {
          capabilityName: this.capability,
          thought: `Queried RiskService for entity ${request.entityId}; no assessment was found in the current dataset.`,
          observation: 'Defaulting to MANUAL_REVIEW with reduced confidence pending a real assessment.',
          action: 'RiskReasoner.reasonWithoutAssessment',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

  private buildRecommendation(decisionType: string, status: DecisionResult['status'], score: number) {
    const id = `REC-RISK-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    if (status === 'APPROVED') {
      return {
        id,
        title: 'Proceed — Risk Profile Acceptable',
        description: `Risk score of ${score}/100 falls within approved policy thresholds for ${decisionType}.`,
        confidenceScore: Math.min(0.98, score / 100 + 0.1),
        impactMetric: 'Risk-adjusted approval'
      };
    }

    if (status === 'MANUAL_REVIEW') {
      return {
        id,
        title: 'Escalate for Manual Underwriting',
        description: `Risk score of ${score}/100 is borderline for ${decisionType}; recommend secondary review or additional collateral/guarantees.`,
        confidenceScore: score / 100,
        impactMetric: 'Risk mitigation'
      };
    }

    return {
      id,
      title: 'Decline — Risk Profile Unacceptable',
      description: `Risk score of ${score}/100 is below policy threshold for ${decisionType}. High probability of adverse outcome.`,
      confidenceScore: Math.max(0.55, (100 - score) / 100),
      impactMetric: 'Loss prevention'
    };
  }

  private buildAlternatives(status: DecisionResult['status'], score: number, primaryConfidence: number) {
    if (status === 'APPROVED') {
      return [
        {
          recommendation: {
            id: `REC-RISK-ALT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            title: 'Approve with Reduced Exposure Cap',
            description: `Approve at ${score}/100 risk score but cap exposure at 80% of the requested amount as a conservative buffer.`,
            confidenceScore: Math.max(0, primaryConfidence - 0.12)
          },
          tradeoffs: ['Lower realized exposure and interest income', 'Further reduces default risk versus full approval']
        }
      ];
    }

    return [
      {
        recommendation: {
          id: `REC-RISK-ALT-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          title: 'Request Additional Collateral or Guarantors',
          description: `Reconsider at ${score}/100 risk score if secondary guarantees or collateral are provided to offset the identified risk factors.`,
          confidenceScore: Math.max(0, primaryConfidence - 0.1)
        },
        tradeoffs: ['Requires additional documentation and time', 'Improves recoverability if the entity later defaults']
      }
    ];
  }
}

export const riskReasoner = new RiskReasoner();
export default riskReasoner;
