import { Investment } from '@/types';

export const MOCK_INVESTMENTS: Investment[] = [
  {
    id: 'INV-001',
    customerId: 'CUST-001', // Aditya Birla
    assetType: 'EQUITY',
    assetName: 'Reliance Industries Ltd',
    units: 1200,
    purchasePrice: 2200,
    currentPrice: 2450,
    value: 2940000, // 29.4 Lakhs
    allocationPercentage: 35,
    lastValuationDate: '2026-07-09T16:00:00Z',
    createdAt: '2023-01-10T10:00:00Z',
    updatedAt: '2026-07-09T16:00:00Z'
  },
  {
    id: 'INV-002',
    customerId: 'CUST-001',
    assetType: 'MUTUAL_FUND',
    assetName: 'SBI Bluechip Fund Regular Growth',
    units: 15000,
    purchasePrice: 180,
    currentPrice: 210,
    value: 3150000, // 31.5 Lakhs
    allocationPercentage: 40,
    lastValuationDate: '2026-07-09T16:00:00Z',
    createdAt: '2023-03-15T11:00:00Z',
    updatedAt: '2026-07-09T16:00:00Z'
  },
  {
    id: 'INV-003',
    customerId: 'CUST-001',
    assetType: 'GOLD',
    assetName: 'Sovereign Gold Bonds 2023 Series III',
    units: 300,
    purchasePrice: 5800,
    currentPrice: 6500,
    value: 1950000, // 19.5 Lakhs
    allocationPercentage: 25,
    lastValuationDate: '2026-07-09T16:00:00Z',
    createdAt: '2023-09-20T10:00:00Z',
    updatedAt: '2026-07-09T16:00:00Z'
  }
];
export function getMockInvestmentsForCustomer(customerId: string): Investment[] {
  return MOCK_INVESTMENTS.filter(i => i.customerId === customerId);
}
