import { DecisionCapabilityMapping } from '@/types';

/**
 * Maps each known DecisionRequest.decisionType to the AgentCapability
 * required to service it. Previously this lived as a hardcoded switch
 * statement inside DecisionEngineService.determineRequiredCapability();
 * per AI_ENGINEERING_RULES.md Section 18 ("Everything configurable
 * belongs inside /config"), it now lives here.
 *
 * Adding a new decision type for an existing or new business domain
 * (Fraud, Wealth, Compliance, Executive Intelligence, ...) means adding
 * a row here and registering a matching IDecisionReasoner — never
 * editing DecisionEngineService.
 */
export const DECISION_CAPABILITY_MAP: DecisionCapabilityMapping[] = [
  {
    decisionType: 'LOAN_APPROVAL',
    capability: 'CreditAssessment',
    description: 'Retail or MSME lending decisions requiring creditworthiness assessment.'
  },
  {
    decisionType: 'FRAUD_CHECK',
    capability: 'FraudDetection',
    description: 'Transaction or account-level fraud flagging decisions.'
  },
  {
    decisionType: 'PORTFOLIO_OPTIMIZE',
    capability: 'PortfolioOptimisation',
    description: 'Wealth advisory decisions rebalancing or optimizing an investment portfolio.'
  },
  {
    decisionType: 'MSME_CASHFLOW',
    capability: 'CashFlowForecasting',
    description: 'MSME liquidity and working-capital forecasting decisions.'
  },
  {
    decisionType: 'RISK_ASSESSMENT',
    capability: 'RiskScoring',
    description: 'Direct risk-scoring decisions for a Customer, MSME, Loan, or Investment entity.'
  }
];

/** Fallback capability used when a decisionType has no explicit mapping entry. */
export const DEFAULT_DECISION_CAPABILITY = 'RecommendationGeneration' as const;

export function resolveRequiredCapability(decisionType: string) {
  const match = DECISION_CAPABILITY_MAP.find(m => m.decisionType === decisionType);
  return match ? match.capability : DEFAULT_DECISION_CAPABILITY;
}
