'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_FRAUD_CASES } from '@/data/fraudAlerts';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export default function FraudIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/fraud');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const riskColors: Record<string, string> = {
    LOW: 'text-emerald-400 border-emerald-900 bg-emerald-950/20',
    MEDIUM: 'text-amber-400 border-amber-900 bg-amber-950/20',
    HIGH: 'text-orange-400 border-orange-900 bg-orange-950/20',
    CRITICAL: 'text-red-400 border-red-900 bg-red-950/20',
  };

  const statusColors: Record<string, string> = {
    FLAGGED: 'text-orange-400',
    UNDER_INVESTIGATION: 'text-amber-400',
    RESOLVED_FRAUD: 'text-red-400',
    RESOLVED_LEGITIMATE: 'text-emerald-400',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Total Cases', value: MOCK_FRAUD_CASES.length, color: 'text-zinc-200', icon: <ShieldAlert size={14} /> },
          { label: 'Flagged', value: MOCK_FRAUD_CASES.filter(f => f.status === 'FLAGGED').length, color: 'text-orange-400', icon: <AlertTriangle size={14} /> },
          { label: 'Investigating', value: MOCK_FRAUD_CASES.filter(f => f.status === 'UNDER_INVESTIGATION').length, color: 'text-amber-400', icon: <Clock size={14} /> },
          { label: 'Resolved', value: MOCK_FRAUD_CASES.filter(f => f.status.startsWith('RESOLVED')).length, color: 'text-emerald-400', icon: <CheckCircle2 size={14} /> },
        ].map(stat => (
          <div key={stat.label} className="border border-zinc-800 bg-zinc-950 p-4 rounded flex items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
            <span className={stat.color}>{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Case Table */}
      <div className="border border-zinc-800 bg-zinc-950 rounded font-mono overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Active Fraud Case Registry</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Case ID</th>
                <th className="px-5 py-3 text-left">Customer</th>
                <th className="px-5 py-3 text-left">Transaction</th>
                <th className="px-5 py-3 text-left">Risk Level</th>
                <th className="px-5 py-3 text-left">Fraud Score</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Detected At</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FRAUD_CASES.map(fraudCase => {
                const customer = MOCK_CUSTOMERS.find(c => c.id === fraudCase.customerId);
                return (
                  <tr key={fraudCase.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3 text-zinc-400 font-mono">{fraudCase.id}</td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-zinc-300">{customer?.name || fraudCase.customerId}</div>
                      <div className="text-[9px] text-zinc-600">{fraudCase.customerId}</div>
                    </td>
                    <td className="px-5 py-3 text-zinc-500">{fraudCase.transactionId || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${riskColors[fraudCase.riskLevel]}`}>
                        {fraudCase.riskLevel}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-zinc-900 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${fraudCase.score > 70 ? 'bg-red-500' : fraudCase.score > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${fraudCase.score}%` }}
                          />
                        </div>
                        <span className="text-zinc-400 font-bold">{fraudCase.score}</span>
                      </div>
                    </td>
                    <td className={`px-5 py-3 font-semibold ${statusColors[fraudCase.status]}`}>{fraudCase.status}</td>
                    <td className="px-5 py-3 text-zinc-500 text-[10px]">{new Date(fraudCase.detectedAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Notes expand area */}
        <div className="px-5 py-4 border-t border-zinc-900 space-y-2">
          {MOCK_FRAUD_CASES.filter(f => f.notes).map(f => (
            <div key={f.id} className="text-[10px] text-zinc-500 bg-zinc-900/40 border border-zinc-900 p-3 rounded">
              <span className="text-zinc-400 font-semibold">{f.id}:</span> {f.notes}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
