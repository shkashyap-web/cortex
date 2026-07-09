'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_LOANS } from '@/data/loans';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_MSMES } from '@/data/msmes';
import { Briefcase } from 'lucide-react';

export default function LendingIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/lending');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const statusBadge: Record<string, string> = {
    ACTIVE: 'text-emerald-400 border-emerald-900 bg-emerald-950/20',
    APPLIED: 'text-amber-400 border-amber-900 bg-amber-950/20',
    APPROVED: 'text-sky-400 border-sky-900 bg-sky-950/20',
    DISBURSED: 'text-indigo-400 border-indigo-900 bg-indigo-950/20',
    REJECTED: 'text-red-400 border-red-900 bg-red-950/20',
    CLOSED: 'text-zinc-500 border-zinc-800 bg-zinc-900/20',
  };

  const getBorrowerName = (loan: typeof MOCK_LOANS[0]) => {
    if (loan.customerId) return MOCK_CUSTOMERS.find(c => c.id === loan.customerId)?.name || loan.customerId;
    if (loan.msmeId) return MOCK_MSMES.find(m => m.id === loan.msmeId)?.companyName || loan.msmeId;
    return 'Unknown';
  };

  const formatCrore = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 font-mono">
        <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Total Loans</p>
          <p className="text-2xl font-bold text-zinc-200 mt-1">{MOCK_LOANS.length}</p>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Active</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{MOCK_LOANS.filter(l => l.status === 'ACTIVE').length}</p>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Under Review</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{MOCK_LOANS.filter(l => l.status === 'APPLIED').length}</p>
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-4 rounded">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Portfolio Value</p>
          <p className="text-xl font-bold text-zinc-200 mt-1">{formatCrore(MOCK_LOANS.reduce((s, l) => s + l.amount, 0))}</p>
        </div>
      </div>

      {/* Loan Table */}
      <div className="border border-zinc-800 bg-zinc-950 rounded overflow-hidden font-mono">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={12} />Loan Portfolio Registry
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Loan ID</th>
                <th className="px-5 py-3 text-left">Borrower</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Rate</th>
                <th className="px-5 py-3 text-right">Term</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Collateral</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LOANS.map(loan => (
                <tr key={loan.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="px-5 py-3 text-zinc-500 font-mono text-[10px]">{loan.id}</td>
                  <td className="px-5 py-3">
                    <div className="font-semibold text-zinc-300">{getBorrowerName(loan)}</div>
                    <div className="text-[9px] text-zinc-600">{loan.customerId || loan.msmeId}</div>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">{loan.type.replace(/_/g, ' ')}</td>
                  <td className="px-5 py-3 text-right font-bold text-zinc-200">{formatCrore(loan.amount)}</td>
                  <td className="px-5 py-3 text-right text-zinc-400">{loan.interestRate}%</td>
                  <td className="px-5 py-3 text-right text-zinc-400">{loan.termMonths}M</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${statusBadge[loan.status] || 'text-zinc-400 border-zinc-800'}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[10px] text-zinc-500 max-w-[200px] truncate" title={loan.collateralDetails}>
                    {loan.collateralDetails || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
