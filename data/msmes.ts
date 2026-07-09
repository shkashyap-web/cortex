import { MSME } from '@/types';

export const MOCK_MSMES: MSME[] = [
  {
    id: 'MSME-001',
    companyName: 'Patel Agro Industries Ltd',
    registrationNumber: 'UDYAM-GJ-01-0012345',
    industry: 'AGRICULTURE',
    annualRevenue: 45000000, // INR 4.5 Cr
    employeeCount: 28,
    gstNumber: '24AAAAP1234F1Z0',
    financialHealthScore: 82,
    riskRating: 'AA',
    ownerCustomerId: 'CUST-003',
    branchId: 'BR-AHMEDABAD-03',
    createdAt: '2020-01-20T10:00:00Z',
    updatedAt: '2026-06-30T15:00:00Z'
  },
  {
    id: 'MSME-002',
    companyName: 'TechVeda Solutions Private Limited',
    registrationNumber: 'UDYAM-MH-12-0098765',
    industry: 'TECHNOLOGY',
    annualRevenue: 120000000, // INR 12 Cr
    employeeCount: 65,
    gstNumber: '27ABCDE9012Q2Z1',
    financialHealthScore: 94,
    riskRating: 'AAA',
    ownerCustomerId: 'CUST-001',
    branchId: 'BR-MUMBAI-01',
    createdAt: '2022-05-01T09:00:00Z',
    updatedAt: '2026-07-05T12:00:00Z'
  },
  {
    id: 'MSME-003',
    companyName: 'Nutan Apparels',
    registrationNumber: 'UDYAM-DL-03-0024680',
    industry: 'MANUFACTURING',
    annualRevenue: 15000000, // INR 1.5 Cr
    employeeCount: 14,
    gstNumber: '07FGHIJ5678K1Z3',
    financialHealthScore: 56,
    riskRating: 'BB',
    ownerCustomerId: 'CUST-002',
    branchId: 'BR-DELHI-02',
    createdAt: '2023-09-01T11:00:00Z',
    updatedAt: '2026-04-12T10:30:00Z'
  }
];
export function getMockMSME(id: string): MSME | undefined {
  return MOCK_MSMES.find(m => m.id === id);
}
