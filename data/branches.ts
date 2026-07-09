import { Branch } from '@/types';

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 'BR-MUMBAI-01',
    name: 'Mumbai Corporate Headquarters',
    code: 'IDBI000MUM1',
    location: 'Bandra Kurla Complex, Mumbai, Maharashtra',
    managerId: 'EMP-MGR-001',
    cashReserve: 5400000000, // 540 Cr
    depositsTotal: 42000000000, // 4200 Cr
    loansTotal: 31000000000, // 3100 Cr
    createdAt: '2010-01-01T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'BR-DELHI-02',
    name: 'Connaught Place Main Branch',
    code: 'IDBI000DEL2',
    location: 'Connaught Place, New Delhi',
    managerId: 'EMP-MGR-002',
    cashReserve: 1200000000, // 120 Cr
    depositsTotal: 15000000000, // 1500 Cr
    loansTotal: 9800000000, // 980 Cr
    createdAt: '2012-06-15T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  },
  {
    id: 'BR-AHMEDABAD-03',
    name: 'CG Road MSME Hub',
    code: 'IDBI000AHM3',
    location: 'CG Road, Ahmedabad, Gujarat',
    managerId: 'EMP-MGR-003',
    cashReserve: 800000000, // 80 Cr
    depositsTotal: 9200000000, // 920 Cr
    loansTotal: 8400000000, // 840 Cr
    createdAt: '2015-09-20T00:00:00Z',
    updatedAt: '2026-07-01T00:00:00Z'
  }
];
export function getMockBranch(id: string): Branch | undefined {
  return MOCK_BRANCHES.find(b => b.id === id);
}
