import { Customer } from '@/types';

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Aditya Birla',
    email: 'aditya.birla@retail.in',
    phone: '+91 98765 43210',
    segment: 'HNI',
    riskProfile: 'MEDIUM',
    kycStatus: 'VERIFIED',
    pan: 'ABCDE1234F',
    ckycId: 'CKYC-998877665544',
    branchId: 'BR-MUMBAI-01',
    rmId: 'EMP-RM-001',
    createdAt: '2022-04-10T10:00:00Z',
    updatedAt: '2026-06-15T14:30:00Z'
  },
  {
    id: 'CUST-002',
    name: 'Rohan Sharma',
    email: 'rohan.sharma@gmail.com',
    phone: '+91 91234 56789',
    segment: 'RETAIL',
    riskProfile: 'LOW',
    kycStatus: 'VERIFIED',
    pan: 'FGHIJ5678K',
    ckycId: 'CKYC-112233445566',
    branchId: 'BR-DELHI-02',
    rmId: 'EMP-RM-002',
    createdAt: '2023-08-12T09:15:00Z',
    updatedAt: '2026-05-10T11:20:00Z'
  },
  {
    id: 'CUST-003',
    name: 'Priya Patel',
    email: 'priya.patel@patelindustries.co.in',
    phone: '+91 98888 77777',
    segment: 'CORPORATE',
    riskProfile: 'HIGH',
    kycStatus: 'VERIFIED',
    pan: 'LMNOP9012Q',
    ckycId: 'CKYC-554433221100',
    branchId: 'BR-AHMEDABAD-03',
    rmId: 'EMP-RM-003',
    createdAt: '2020-01-15T08:00:00Z',
    updatedAt: '2026-07-01T09:00:00Z'
  },
  {
    id: 'CUST-004',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@outlook.com',
    phone: '+91 90000 12345',
    segment: 'RETAIL',
    riskProfile: 'HIGH',
    kycStatus: 'EXPIRED',
    pan: 'RSTUV3456W',
    ckycId: 'CKYC-334455667788',
    branchId: 'BR-MUMBAI-01',
    rmId: 'EMP-RM-001',
    createdAt: '2024-02-18T11:45:00Z',
    updatedAt: '2026-02-18T11:45:00Z'
  }
];
export function getMockCustomer(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find(c => c.id === id);
}
