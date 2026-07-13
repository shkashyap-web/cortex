import { RiskAssessment, BankingEntityType } from '@/types';

/**
 * Minimal mock Risk Assessment dataset.
 *
 * Milestone 3 deliberately creates ONLY this one data module — enough to
 * demonstrate one complete, real, end-to-end business reasoning workflow
 * (RiskService -> RiskReasoner -> DecisionEngine). Every other business
 * domain (Fraud, MSME cash flow, Portfolio, Compliance, ...) remains
 * architecture-ready but unimplemented, per instruction: "Do NOT
 * fabricate every missing data module."
 *
 * Entity IDs intentionally mirror the demo ID conventions already
 * present in DecisionEngineService's prior mock scoring
 * (CUST-00x / MSME-00x), so existing demo flows keep producing the same
 * qualitative outcomes (approve / manual review / reject) — but now
 * driven by a real service and a real dataset instead of an
 * `entityId.includes('001')` string check.
 */
export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'RISK-CUST-001',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'Customer',
    entityId: 'CUST-001',
    overallScore: 85,
    factors: [
      { factorName: 'Repayment History', weight: 0.4, score: 90, description: 'Consistent on-time repayments across all active facilities.' },
      { factorName: 'Income Stability', weight: 0.3, score: 82, description: 'Stable salaried income verified via bank statement analysis.' },
      { factorName: 'Existing Exposure', weight: 0.3, score: 82, description: 'Low outstanding exposure relative to income.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'lending-advisor'
  },
  {
    id: 'RISK-CUST-002',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'Customer',
    entityId: 'CUST-002',
    overallScore: 92,
    factors: [
      { factorName: 'Repayment History', weight: 0.4, score: 96, description: 'No delinquencies on record across a 5-year history.' },
      { factorName: 'Income Stability', weight: 0.3, score: 90, description: 'HNI segment with diversified income sources.' },
      { factorName: 'Existing Exposure', weight: 0.3, score: 88, description: 'Well within prudential exposure limits.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'lending-advisor'
  },
  {
    id: 'RISK-CUST-003',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'Customer',
    entityId: 'CUST-003',
    overallScore: 55,
    factors: [
      { factorName: 'Repayment History', weight: 0.4, score: 58, description: 'One missed installment in the last 12 months, since regularized.' },
      { factorName: 'Income Stability', weight: 0.3, score: 50, description: 'Self-employed income with moderate month-to-month variance.' },
      { factorName: 'Existing Exposure', weight: 0.3, score: 57, description: 'Exposure approaching, but not exceeding, policy threshold.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'lending-advisor'
  },
  {
    id: 'RISK-CUST-004',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'Customer',
    entityId: 'CUST-004',
    overallScore: 22,
    factors: [
      { factorName: 'Repayment History', weight: 0.4, score: 18, description: 'Multiple missed installments in the last 6 months.' },
      { factorName: 'Income Stability', weight: 0.3, score: 25, description: 'Irregular income with no verifiable secondary source.' },
      { factorName: 'Existing Exposure', weight: 0.3, score: 24, description: 'Exposure exceeds prudential policy threshold.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'lending-advisor'
  },
  {
    id: 'RISK-MSME-001',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'MSME',
    entityId: 'MSME-001',
    overallScore: 80,
    factors: [
      { factorName: 'GST Filing Consistency', weight: 0.3, score: 85, description: 'Regular monthly GST filings with growing turnover.' },
      { factorName: 'Cash Flow Volatility', weight: 0.4, score: 76, description: 'Moderate seasonal variance, within sector norms.' },
      { factorName: 'Sector Outlook', weight: 0.3, score: 80, description: 'Manufacturing sector outlook stable to positive.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'msme-analyst'
  },
  {
    id: 'RISK-MSME-003',
    createdAt: '2026-06-01T09:00:00.000Z',
    updatedAt: '2026-07-01T09:00:00.000Z',
    entityType: 'MSME',
    entityId: 'MSME-003',
    overallScore: 48,
    factors: [
      { factorName: 'GST Filing Consistency', weight: 0.3, score: 52, description: 'Two late filings in the past year.' },
      { factorName: 'Cash Flow Volatility', weight: 0.4, score: 40, description: 'High seasonal dependency with thin liquidity buffers.' },
      { factorName: 'Sector Outlook', weight: 0.3, score: 55, description: 'Retail sector facing moderate headwinds.' }
    ],
    assessedAt: '2026-07-01T09:00:00.000Z',
    assessorId: 'msme-analyst'
  }
];

/**
 * Synchronous lookup helper mirroring the existing
 * `getMockLoansForCustomer` / `getMockDigitalTwinForEntity` pattern used
 * by other `data/` modules, for use directly from UI/page components.
 *
 * `RiskService.getRiskAssessmentForEntity` (async, observability-wrapped)
 * remains the entry point for the Decision Engine / reasoner pipeline;
 * this export does not replace or duplicate that — it's a thin,
 * dependency-free accessor over the same mock dataset for consumers
 * that don't need the service layer.
 */
export function getMockRiskAssessmentsForEntity(
  entityType: BankingEntityType,
  entityId: string
): RiskAssessment | undefined {
  return MOCK_RISK_ASSESSMENTS.find(
    r => r.entityType === entityType && r.entityId === entityId
  );
}
