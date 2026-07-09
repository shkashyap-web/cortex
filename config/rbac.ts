import { Role, Permission } from '@/types';

export const ROLE_DETAILS: Record<Role, { title: string; description: string }> = {
  'Customer': {
    title: 'Bank Customer',
    description: 'Self-service account holder with access to personal transactions, loans, and wealth portfolios.'
  },
  'Relationship Manager': {
    title: 'Relationship Manager',
    description: 'Manages a portfolio of retail or corporate HNI customer relations and maps connections.'
  },
  'Loan Officer': {
    title: 'Loan Officer',
    description: 'Initiates, reviews, and validates retail and commercial credit and loan applications.'
  },
  'Branch Manager': {
    title: 'Branch Manager',
    description: 'Coordinates branch-level operations, cash reserves, and local employee assignments.'
  },
  'Risk Analyst': {
    title: 'Risk Analyst',
    description: 'Assesses macro credit risk, configures simulation shocks, and reviews defaults.'
  },
  'Compliance Officer': {
    title: 'Compliance Officer',
    description: 'Monitors CKYC checks, AML regulations, checks document integrity, and runs audits.'
  },
  'Regional Manager': {
    title: 'Regional Manager',
    description: 'Supervises multiple branches and views regional asset/liability balances.'
  },
  'Executive': {
    title: 'Executive Board Member',
    description: 'Read-only access to complete decision engines, top strategic insights, and graph structures.'
  },
  'System Administrator': {
    title: 'System Administrator',
    description: 'Full write access, manages AI agent status, overrides workflows, and checks observability.'
  }
};

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  'Customer': [
    'read:customer',
    'read:loan'
  ],
  'Relationship Manager': [
    'read:customer',
    'write:customer',
    'read:msme',
    'read:loan',
    'read:risk',
    'evaluate:decision'
  ],
  'Loan Officer': [
    'read:customer',
    'read:msme',
    'read:loan',
    'write:loan',
    'read:risk',
    'evaluate:decision',
    'manage:workflows'
  ],
  'Branch Manager': [
    'read:customer',
    'write:customer',
    'read:msme',
    'read:loan',
    'write:loan',
    'read:risk',
    'manage:workflows'
  ],
  'Risk Analyst': [
    'read:customer',
    'read:msme',
    'read:loan',
    'read:risk',
    'trigger:simulation'
  ],
  'Compliance Officer': [
    'read:customer',
    'read:msme',
    'read:loan',
    'read:risk',
    'manage:workflows',
    'evaluate:decision'
  ],
  'Regional Manager': [
    'read:all',
    'read:customer',
    'read:msme',
    'read:loan',
    'read:risk',
    'trigger:simulation'
  ],
  'Executive': [
    'read:all',
    'read:customer',
    'read:msme',
    'read:loan',
    'read:risk',
    'evaluate:decision',
    'trigger:simulation'
  ],
  'System Administrator': [
    'read:all',
    'write:all',
    'read:customer',
    'write:customer',
    'read:msme',
    'write:msme',
    'read:loan',
    'write:loan',
    'read:risk',
    'evaluate:decision',
    'trigger:simulation',
    'manage:agents',
    'manage:workflows',
    'view:observability'
  ]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('read:all') && permission.startsWith('read:')) return true;
  if (permissions.includes('write:all') && permission.startsWith('write:')) return true;
  return permissions.includes(permission);
}
