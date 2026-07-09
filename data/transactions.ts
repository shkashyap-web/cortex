import { Transaction } from '@/types';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-0001',
    accountId: 'ACC-001-SAV',
    customerId: 'CUST-001',
    amount: 150000,
    type: 'CREDIT',
    category: 'DIVIDEND_PAYOUT',
    channel: 'NETBANKING',
    timestamp: '2026-07-09T10:00:00Z',
    status: 'ACTIVE',
    createdAt: '2026-07-09T10:00:00Z',
    updatedAt: '2026-07-09T10:00:00Z'
  },
  {
    id: 'TXN-0002',
    accountId: 'ACC-001-SAV',
    customerId: 'CUST-001',
    amount: 45000,
    type: 'DEBIT',
    category: 'RETAIL_SHOPPING',
    channel: 'UPI',
    timestamp: '2026-07-09T11:15:00Z',
    status: 'ACTIVE',
    createdAt: '2026-07-09T11:15:00Z',
    updatedAt: '2026-07-09T11:15:00Z'
  },
  {
    id: 'TXN-0003',
    accountId: 'ACC-003-CUR',
    customerId: 'CUST-003', // owned by Priya Patel
    amount: 1200000,
    type: 'DEBIT',
    category: 'VENDOR_PAYMENT',
    channel: 'NETBANKING',
    timestamp: '2026-07-09T08:30:00Z',
    status: 'ACTIVE',
    createdAt: '2026-07-09T08:30:00Z',
    updatedAt: '2026-07-09T08:30:00Z'
  },
  {
    id: 'TXN-0004',
    accountId: 'ACC-002-CUR',
    customerId: 'CUST-002',
    amount: 850000,
    type: 'CREDIT',
    category: 'GST_REFUND',
    channel: 'NETBANKING',
    timestamp: '2026-07-08T15:20:00Z',
    status: 'ACTIVE',
    createdAt: '2026-07-08T15:20:00Z',
    updatedAt: '2026-07-08T15:20:00Z'
  },
  {
    id: 'TXN-0005',
    accountId: 'ACC-001-SAV',
    customerId: 'CUST-004', // Rajesh Kumar
    amount: 500000,
    type: 'DEBIT',
    category: 'OFFSHORE_WIRE',
    channel: 'NETBANKING',
    timestamp: '2026-07-09T14:45:00Z', // Suspicious
    status: 'ACTIVE',
    createdAt: '2026-07-09T14:45:00Z',
    updatedAt: '2026-07-09T14:45:00Z'
  }
];
export function getMockTransactions(accountId?: string): Transaction[] {
  if (accountId) {
    return MOCK_TRANSACTIONS.filter(t => t.accountId === accountId);
  }
  return MOCK_TRANSACTIONS;
}
