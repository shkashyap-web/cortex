'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_FRAUD_CASES } from '@/data/fraudAlerts';
import { FileCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function CompliancePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/compliance');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const kycSummary = {
    verified: MOCK_CUSTOMERS.filter(c => c.kycStatus === 'VERIFIED').length,
    expired: MOCK_CUSTOMERS.filter(c => c.kycStatus === 'EXPIRED').length,
    pending: MOCK_CUSTOMERS.filter(c => c.kycStatus === 'PENDING').length,
  };

  const workflowChecks = [
    { name: 'KYC Document Expiry Check', status: kycSummary.expired > 0 ? 'FAIL' : 'PASS', detail: `${kycSummary.expired} customer(s) with expired KYC credentials requiring re-verification` },
    { name: 'AML Fraud Case Review', status: MOCK_FRAUD_CASES.some(f => f.status === 'FLAGGED') ? 'REVIEW' : 'PASS', detail: `${MOCK_FRAUD_CASES.filter(f => f.status === 'FLAGGED').length} flagged case(s) pending compliance sign-off` },
    { name: 'CKYC Registration Coverage', status: MOCK_CUSTOMERS.some(c => !c.ckycId) ? 'REVIEW' : 'PASS', detail: `${MOCK_CUSTOMERS.filter(c => !c.ckycId).length} customer(s) without CKYC registration link` },
    { name: 'Transaction Monitoring Rules', status: 'PASS', detail: 'All real-time transaction filters active and healthy' },
    { name: 'Aadhaar Verification Consent', status: 'PASS', detail: 'All consent tokens valid and within renewal window' },
    { name: 'GST Filing Consistency', status: 'REVIEW', detail: '1 MSME entity filed GSTR-3B with 5-day delay — advisory issued' },
    { name: 'RBI Audit Readiness Index', status: 'PASS', detail: 'All regulatory submissions up to date as of Q1 FY2027' },
  ];

  const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    PASS: { icon: <CheckCircle2 size={12} />, color: 'text-emerald-400', bg: 'border-emerald-900/50 bg-emerald-950/15' },
    FAIL: { icon: <XCircle size={12} />, color: 'text-red-400', bg: 'border-red-900/50 bg-red-950/15' },
    REVIEW: { icon: <AlertTriangle size={12} />, color: 'text-amber-400', bg: 'border-amber-900/50 bg-amber-950/15' },
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* KYC Summary */}
      <div className="grid grid-cols-3 gap-4 font-mono">
        <div className="border border-emerald-900/40 bg-emerald-950/10 p-5 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">KYC Verified</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{kycSummary.verified}</p>
          </div>
          <CheckCircle2 size={20} className="text-emerald-500" />
        </div>
        <div className="border border-red-900/40 bg-red-950/10 p-5 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">KYC Expired</p>
            <p className="text-2xl font-bold text-red-400 mt-1">{kycSummary.expired}</p>
          </div>
          <XCircle size={20} className="text-red-500" />
        </div>
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded flex items-center justify-between">
          <div>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">KYC Pending</p>
            <p className="text-2xl font-bold text-zinc-400 mt-1">{kycSummary.pending}</p>
          </div>
          <AlertTriangle size={20} className="text-zinc-600" />
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="border border-zinc-800 bg-zinc-950 rounded overflow-hidden font-mono">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <FileCheck size={12} className="text-emerald-500" />Compliance Verification Checklist
          </h2>
        </div>
        <div className="divide-y divide-zinc-900/70">
          {workflowChecks.map((check, i) => {
            const cfg = statusConfig[check.status];
            return (
              <div key={i} className={`px-5 py-4 flex items-start gap-4 ${cfg.bg} border-l-2 ${check.status === 'PASS' ? 'border-emerald-700' : check.status === 'FAIL' ? 'border-red-700' : 'border-amber-700'}`}>
                <span className={`mt-0.5 flex-shrink-0 ${cfg.color}`}>{cfg.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold text-zinc-300">{check.name}</p>
                    <span className={`text-[9px] font-bold flex-shrink-0 ${cfg.color}`}>{check.status}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{check.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer KYC Table */}
      <div className="border border-zinc-800 bg-zinc-950 rounded overflow-hidden font-mono">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Customer KYC Status Register</h3>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Customer</th>
              <th className="px-5 py-3 text-left">PAN</th>
              <th className="px-5 py-3 text-left">CKYC ID</th>
              <th className="px-5 py-3 text-left">KYC Status</th>
              <th className="px-5 py-3 text-left">Segment</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CUSTOMERS.map(c => (
              <tr key={c.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-semibold text-zinc-300">{c.name}</p>
                  <p className="text-[9px] text-zinc-600">{c.id}</p>
                </td>
                <td className="px-5 py-3 text-zinc-400 font-mono">{c.pan}</td>
                <td className="px-5 py-3 text-zinc-500 text-[10px]">{c.ckycId || <span className="text-red-500">NOT REGISTERED</span>}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                    c.kycStatus === 'VERIFIED' ? 'text-emerald-400 border-emerald-900 bg-emerald-950/20' :
                    c.kycStatus === 'EXPIRED' ? 'text-red-400 border-red-900 bg-red-950/20' :
                    'text-zinc-400 border-zinc-800 bg-zinc-900/20'
                  }`}>{c.kycStatus}</span>
                </td>
                <td className="px-5 py-3 text-zinc-400">{c.segment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
