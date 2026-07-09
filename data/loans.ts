import { Loan } from '@/types';

export const MOCK_LOANS: Loan[] = [
  {
    id: 'LOAN-001',
    customerId: 'CUST-001',
    accountId: 'ACC-001-SAV',
    type: 'MORTGAGE',
    amount: 15000000, // 1.5 Cr
    interestRate: 8.75,
    termMonths: 240,
    status: 'ACTIVE',
    startDate: '2022-05-15T00:00:00Z',
    maturityDate: '2042-05-15T00:00:00Z',
    collateralDetails: 'Residential Property in Bandra, Mumbai, valued at 2.5 Cr',
    createdAt: '2022-04-20T11:00:00Z',
    updatedAt: '2026-06-15T00:00:00Z'
  },
  {
    id: 'LOAN-002',
    msmeId: 'MSME-001',
    accountId: 'ACC-003-CUR',
    type: 'WORKING_CAPITAL',
    amount: 5000000, // 50 Lakhs
    interestRate: 11.25,
    termMonths: 36,
    status: 'ACTIVE',
    startDate: '2024-03-01T00:00:00Z',
    maturityDate: '2027-03-01T00:00:00Z',
    collateralDetails: 'Hypothecation of agricultural processing equipment and crop receivables',
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'LOAN-003',
    msmeId: 'MSME-003',
    accountId: 'ACC-002-CUR',
    type: 'EQUIPMENT_FINANCE',
    amount: 2500000, // 25 Lakhs
    interestRate: 12.5,
    termMonths: 48,
    status: 'APPLIED',
    createdAt: '2026-07-02T10:00:00Z',
    updatedAt: '2026-07-02T10:00:00Z'
  }
];
export function getMockLoan(id: string): Loan | undefined {
  return MOCK_LOANS.find(l => l.id === id);
}
export function getMockLoansForCustomer(customerId: string): Loan[] {
  return MOCK_LOANS.filter(l => l.customerId === customerId);
}
export function getMockLoansForMSME(msmeId: string): Loan[] {
  return MOCK_LOANS.filter(l => l.msmeId === msmeId);
}
