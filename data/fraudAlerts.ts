import { FraudCase } from '@/types';

export const MOCK_FRAUD_CASES: FraudCase[] = [
  {
    id: 'FRD-001',
    transactionId: 'TXN-0005', // Rajesh Kumar offshore wire
    customerId: 'CUST-004',
    score: 87,
    status: 'FLAGGED',
    riskLevel: 'HIGH',
    detectedAt: '2026-07-09T14:50:00Z',
    notes: 'Out-of-pattern foreign outward remittance initiated from newly added beneficiary. Velocity limit triggered.',
    createdAt: '2026-07-09T14:50:00Z',
    updatedAt: '2026-07-09T14:50:00Z'
  },
  {
    id: 'FRD-002',
    transactionId: 'TXN-0002', // Rohan Sharma UPI
    customerId: 'CUST-002',
    score: 12,
    status: 'RESOLVED_LEGITIMATE',
    riskLevel: 'LOW',
    detectedAt: '2026-07-09T11:20:00Z',
    resolvedAt: '2026-07-09T12:00:00Z',
    notes: 'Customer confirmed transaction via secure mobile app confirmation.',
    createdAt: '2026-07-09T11:20:00Z',
    updatedAt: '2026-07-09T12:00:00Z'
  }
];
export function getMockFraudCases(): FraudCase[] {
  return MOCK_FRAUD_CASES;
}
export function getMockFraudCase(id: string): FraudCase | undefined {
  return MOCK_FRAUD_CASES.find(f => f.id === id);
}
