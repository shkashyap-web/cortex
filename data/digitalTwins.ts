import { DigitalTwin } from '@/types';

export const MOCK_DIGITAL_TWINS: DigitalTwin[] = [
  {
    id: 'TWN-CUST-001',
    entityType: 'Customer',
    entityId: 'CUST-001', // Aditya Birla
    healthStatus: 'HEALTHY',
    metrics: {
      netWorth: 85000000,
      liquidityRatio: 0.42,
      investmentYield: 8.92,
      debtEquityRatio: 0.18
    },
    relationships: [
      { targetEntityId: 'MSME-002', targetEntityType: 'MSME', relationshipType: 'OWNER_OF' },
      { targetEntityId: 'LOAN-001', targetEntityType: 'Loan', relationshipType: 'DEBTOR_ON' }
    ],
    predictionPlaceholder: 'Investment yield projected to reach 9.2% next quarter based on blue-chip mutual fund inflows.',
    recommendationPlaceholder: 'Consider shifting 10% HNI equity assets into tax-free sovereign gold bonds for optimized yields.',
    lastSyncTimestamp: '2026-07-09T16:00:00Z',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-07-09T16:00:00Z'
  },
  {
    id: 'TWN-MSME-001',
    entityType: 'MSME',
    entityId: 'MSME-001', // Patel Agro Industries
    healthStatus: 'WARNING',
    metrics: {
      workingCapitalCycleDays: 68,
      debtServiceCoverageRatio: 1.15,
      cashFlowMargin: 0.08,
      revenueGrowthRate: 0.12
    },
    relationships: [
      { targetEntityId: 'CUST-003', targetEntityType: 'Customer', relationshipType: 'OWNED_BY' },
      { targetEntityId: 'LOAN-002', targetEntityType: 'Loan', relationshipType: 'LIABILITY_ACCRUED' }
    ],
    predictionPlaceholder: 'Working capital cycle projected to lengthen to 75 days next month due to agricultural season supply delays.',
    recommendationPlaceholder: 'Pre-approve working capital limit extension of INR 10 Lakhs to avoid cash flow stress under GST obligations.',
    lastSyncTimestamp: '2026-07-09T15:30:00Z',
    createdAt: '2026-01-12T10:00:00Z',
    updatedAt: '2026-07-09T15:30:00Z'
  },
  {
    id: 'TWN-BR-001',
    entityType: 'Branch',
    entityId: 'BR-AHMEDABAD-03', // CG Road branch
    healthStatus: 'HEALTHY',
    metrics: {
      loanDefaultRate: 0.021,
      depositGrowthRate: 0.145,
      averageLoanApprovalTimeHours: 42,
      liquidityReserveRatio: 0.095
    },
    relationships: [
      { targetEntityId: 'EMP-MGR-003', targetEntityType: 'Employee', relationshipType: 'MANAGED_BY' }
    ],
    predictionPlaceholder: 'Branch lending target expected to exceed quarterly goal by 8.5% due to high MSME demand in CG Road cluster.',
    recommendationPlaceholder: 'Reallocate 2 commercial loan officers from Bandra branch to accelerate processing queues during Udyam campaigns.',
    lastSyncTimestamp: '2026-07-09T14:00:00Z',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-07-09T14:00:00Z'
  }
];
export function getMockDigitalTwinForEntity(entityType: string, entityId: string): DigitalTwin | undefined {
  return MOCK_DIGITAL_TWINS.find(t => t.entityType === entityType && t.entityId === entityId);
}
