import { Employee } from '@/types';

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-RM-001',
    name: 'Suresh Raina',
    email: 'suresh.raina@cortexbank.com',
    role: 'Relationship Manager',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2020-05-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-RM-002',
    name: 'Anjali Sharma',
    email: 'anjali.sharma@cortexbank.com',
    role: 'Relationship Manager',
    branchId: 'BR-DELHI-02',
    status: 'ACTIVE',
    createdAt: '2021-08-15T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-RM-003',
    name: 'Ketan Mehta',
    email: 'ketan.mehta@cortexbank.com',
    role: 'Relationship Manager',
    branchId: 'BR-AHMEDABAD-03',
    status: 'ACTIVE',
    createdAt: '2022-03-01T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-LNO-001',
    name: 'Vikram Singh',
    email: 'vikram.singh@cortexbank.com',
    role: 'Loan Officer',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2019-11-20T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-MGR-001',
    name: 'Neelam Gupta',
    email: 'neelam.gupta@cortexbank.com',
    role: 'Branch Manager',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2015-04-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-MGR-002',
    name: 'Harpreet Singh',
    email: 'harpreet.singh@cortexbank.com',
    role: 'Branch Manager',
    branchId: 'BR-DELHI-02',
    status: 'ACTIVE',
    createdAt: '2016-09-01T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-MGR-003',
    name: 'Gautam Adani',
    email: 'gautam.adani@cortexbank.com',
    role: 'Branch Manager',
    branchId: 'BR-AHMEDABAD-03',
    status: 'ACTIVE',
    createdAt: '2018-07-20T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-RSK-001',
    name: 'Raghuram Rajan',
    email: 'raghuram.rajan@cortexbank.com',
    role: 'Risk Analyst',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2012-08-10T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-CMP-001',
    name: 'Urjit Patel',
    email: 'urjit.patel@cortexbank.com',
    role: 'Compliance Officer',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2014-09-12T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-EXC-001',
    name: 'Shaktikanta Das',
    email: 'shaktikanta.das@cortexbank.com',
    role: 'Executive',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2018-12-12T09:00:00Z',
    updatedAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'EMP-ADM-001',
    name: 'CORTEX Administrator',
    email: 'admin@cortexbank.com',
    role: 'System Administrator',
    branchId: 'BR-MUMBAI-01',
    status: 'ACTIVE',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z'
  }
];
export function getMockEmployee(id: string): Employee | undefined {
  return MOCK_EMPLOYEES.find(e => e.id === id);
}
export function getMockEmployeesByBranch(branchId: string): Employee[] {
  return MOCK_EMPLOYEES.filter(e => e.branchId === branchId);
}
