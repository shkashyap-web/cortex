/**
 * Confidence Scoring Framework
 * ---------------------------------------------------------------------------
 * Milestone 3 subsystem of the CORTEX Decision Engine.
 *
 * Responsibility
 * --------------
 * Turns a set of weighted, domain-supplied factors into a single
 * normalized 0-100 score and a 0.0-1.0 confidence value, plus the
 * DecisionFactors shape the Explainability Engine needs. This logic
 * previously lived nowhere — DecisionEngine picked a mock score directly
 * off the entity ID string. Every IDecisionReasoner now uses this shared,
 * reusable scorer instead of inventing its own weighting math, so
 * scoring behaves consistently across Risk, Fraud, Lending, MSME, and
 * every future domain.
 *
 * This module performs pure computation only — no I/O, no service
 * dependencies — so it is trivially unit-testable in isolation.
 */

import { ConfidenceWeightInput, DecisionFactors } from '@/types';

export interface ConfidenceScoreResult {
  /** Weighted-average score, normalized to 0-100. */
  overallScore: number;
  /** overallScore expressed as a 0.0-1.0 confidence value. */
  confidence: number;
  factors: DecisionFactors;
}

export class ConfidenceScoring {
  /**
   * Computes a normalized weighted score from a set of factor inputs.
   * Weights need not sum to 1 — they are normalized internally, so
   * callers can supply arbitrary relative weights (e.g. straight from a
   * RiskAssessment.factors array).
   */
  public static score(inputs: ConfidenceWeightInput[]): ConfidenceScoreResult {
    if (inputs.length === 0) {
      return {
        overallScore: 0,
        confidence: 0,
        factors: { factors: [] }
      };
    }

    const totalWeight = inputs.reduce((sum, i) => sum + Math.max(i.weight, 0), 0) || 1;

    const overallScoreRaw = inputs.reduce((sum, i) => {
      const normalizedWeight = Math.max(i.weight, 0) / totalWeight;
      return sum + i.score * normalizedWeight;
    }, 0);

    const overallScore = Math.min(100, Math.max(0, Math.round(overallScoreRaw * 100) / 100));

    return {
      overallScore,
      confidence: Math.round((overallScore / 100) * 1000) / 1000,
      factors: {
        factors: inputs.map(i => ({
          name: i.name,
          value: i.score,
          influence: i.influence,
          impactWeight: Math.round((Math.max(i.weight, 0) / totalWeight) * 1000) / 1000,
          description: i.description
        }))
      }
    };
  }

  /**
   * Maps a normalized 0-100 score to a decision status using the
   * platform-standard thresholds. Centralized here so every reasoner
   * (and DecisionEngine's fallback path) applies the same policy line.
   */
  public static statusForScore(score: number): 'APPROVED' | 'MANUAL_REVIEW' | 'REJECTED' {
    if (score >= 70) return 'APPROVED';
    if (score >= 40) return 'MANUAL_REVIEW';
    return 'REJECTED';
  }
}
