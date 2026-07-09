import { RiskAssessment } from '@/types';

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = [
  {
    id: 'RSK-001',
    entityType: 'Customer',
    entityId: 'CUST-004', // Rajesh Kumar
    overallScore: 78,
    factors: [
      { factorName: 'KYC Expiration', weight: 0.3, score: 100, description: 'PAN/Aadhaar re-verification expired for over 90 days' },
      { factorName: 'Outward Remittance Velocity', weight: 0.5, score: 85, description: 'High frequency outward wire transfers' },
      { factorName: 'Average Monthly Balance Trend', weight: 0.2, score: 25, description: 'Slight decrease in liquid savings account balances' }
    ],
    assessedAt: '2026-07-09T15:00:00Z',
    assessorId: 'risk-analyst',
    createdAt: '2026-07-09T15:00:00Z',
    updatedAt: '2026-07-09T15:00:00Z'
  },
  {
    id: 'RSK-002',
    entityType: 'MSME',
    entityId: 'MSME-003', // Nutan Apparels
    overallScore: 64,
    factors: [
      { factorName: 'Debt-Service Coverage Ratio', weight: 0.4, score: 75, description: 'Operating income margins near threshold value of 1.1x' },
      { factorName: 'Industry Slowdown Risk', weight: 0.3, score: 60, description: 'General consumer retail clothing demand slowdown' },
      { factorName: 'Tax Filing Consistency', weight: 0.3, score: 50, description: 'Recent GSTR-3B filed with 5-day delay' }
    ],
    assessedAt: '2026-07-08T18:00:00Z',
    assessorId: 'msme-analyst',
    createdAt: '2026-07-08T18:00:00Z',
    updatedAt: '2026-07-08T18:00:00Z'
  }
];
export function getMockRiskAssessment(id: string): RiskAssessment | undefined {
  return MOCK_RISK_ASSESSMENTS.find(r => r.id === id);
}
export function getMockRiskAssessmentsForEntity(entityType: string, entityId: string): RiskAssessment | undefined {
  return MOCK_RISK_ASSESSMENTS.find(r => r.entityType === entityType && r.entityId === entityId);
}
