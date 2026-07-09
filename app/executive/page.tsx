'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_BRANCHES } from '@/data/branches';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_LOANS } from '@/data/loans';
import { MOCK_FRAUD_CASES } from '@/data/fraudAlerts';
import { MOCK_SIMULATION_SCENARIOS } from '@/data/simulations';
import { LayoutDashboard, AlertTriangle, TrendingUp, Building2, Users } from 'lucide-react';

export default function ExecutiveDashboardPage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/executive');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const totalDeposits = MOCK_BRANCHES.reduce((s, b) => s + b.depositsTotal, 0);
  const totalLoans = MOCK_BRANCHES.reduce((s, b) => s + b.loansTotal, 0);
  const totalCash = MOCK_BRANCHES.reduce((s, b) => s + b.cashReserve, 0);
  const highRiskCustomers = MOCK_CUSTOMERS.filter(c => c.riskProfile === 'HIGH').length;
  const criticalFraud = MOCK_FRAUD_CASES.filter(f => f.riskLevel === 'HIGH' || f.riskLevel === 'CRITICAL').length;
  const latestSimulation = MOCK_SIMULATION_SCENARIOS.slice(-1)[0];

  const executiveInsights = [
    { title: 'GNPA Stress Risk — Repo Rate Hike', category: 'RISK', impact: 'HIGH', detail: 'RBI simulation projects 44% increase in MSME default rate under 150bps rate hike. CG Road MSME portfolio at highest vulnerability.' },
    { title: 'KYC Compliance Deficit', category: 'COMPLIANCE', impact: 'MEDIUM', detail: `${MOCK_CUSTOMERS.filter(c => c.kycStatus === 'EXPIRED').length} customer(s) require urgent KYC re-verification to remain RBI compliant.` },
    { title: 'Fraud Monitoring Alert', category: 'FRAUD', impact: 'HIGH', detail: `${criticalFraud} high-risk fraud case(s) pending review. Off-shore remittance pattern detected in Rajesh Kumar account.` },
    { title: 'Working Capital Cycle Extension', category: 'LIQUIDITY', impact: 'MEDIUM', detail: 'Patel Agro Industries average working capital cycle extending from 60 to 68 days. Credit limit revision recommended.' },
  ];

  const impactColor: Record<string, string> = {
    HIGH: 'text-red-400 border-red-900 bg-red-950/15',
    MEDIUM: 'text-amber-400 border-amber-900 bg-amber-950/15',
    LOW: 'text-emerald-400 border-emerald-900 bg-emerald-950/15',
  };

  const categoryColor: Record<string, string> = {
    RISK: 'text-red-400',
    COMPLIANCE: 'text-amber-400',
    FRAUD: 'text-orange-400',
    LIQUIDITY: 'text-sky-400',
    GROWTH: 'text-emerald-400',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* Enterprise KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Total Deposits (All Branches)', value: `₹${(totalDeposits / 1e11).toFixed(1)} L Cr`, icon: <TrendingUp size={14} className="text-emerald-500" /> },
          { label: 'Total Loan Book', value: `₹${(totalLoans / 1e11).toFixed(1)} L Cr`, icon: <Building2 size={14} className="text-indigo-500" /> },
          { label: 'Cash Reserve', value: `₹${(totalCash / 1e9).toFixed(0)} Cr`, icon: <LayoutDashboard size={14} className="text-sky-500" /> },
          { label: 'High Risk Customers', value: highRiskCustomers, icon: <AlertTriangle size={14} className="text-red-500" /> },
        ].map(kpi => (
          <div key={kpi.label} className="border border-zinc-800 bg-zinc-950 rounded p-5 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-wider leading-tight max-w-[120px]">{kpi.label}</p>
              <p className="text-xl font-bold text-zinc-100 mt-1.5">{kpi.value}</p>
            </div>
            {kpi.icon}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Branch Performance Summary */}
        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Building2 size={12} />Branch Performance Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-wider">
                  <th className="py-2 text-left">Branch</th>
                  <th className="py-2 text-right">Deposits</th>
                  <th className="py-2 text-right">Loans</th>
                  <th className="py-2 text-right">Cash Reserve</th>
                  <th className="py-2 text-right">CD Ratio</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_BRANCHES.map(branch => {
                  const cdRatio = ((branch.loansTotal / branch.depositsTotal) * 100).toFixed(1);
                  return (
                    <tr key={branch.id} className="border-b border-zinc-900/50">
                      <td className="py-3">
                        <p className="font-semibold text-zinc-300">{branch.name}</p>
                        <p className="text-[9px] text-zinc-600">{branch.code}</p>
                      </td>
                      <td className="py-3 text-right text-zinc-400">₹{(branch.depositsTotal / 1e9).toFixed(0)} Cr</td>
                      <td className="py-3 text-right text-zinc-400">₹{(branch.loansTotal / 1e9).toFixed(0)} Cr</td>
                      <td className="py-3 text-right text-zinc-400">₹{(branch.cashReserve / 1e7).toFixed(0)} Cr</td>
                      <td className={`py-3 text-right font-bold ${Number(cdRatio) > 80 ? 'text-amber-400' : 'text-emerald-400'}`}>{cdRatio}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Simulation Signal */}
        <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <TrendingUp size={12} />Latest Simulation Signal
          </h2>
          {latestSimulation && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-zinc-200">{latestSimulation.name}</p>
              {latestSimulation.summaryInsight && (
                <p className="text-[10px] text-zinc-500 leading-relaxed">{latestSimulation.summaryInsight}</p>
              )}
              {latestSimulation.results?.map((r, i) => (
                <div key={i} className="text-[10px] flex justify-between items-center border-b border-zinc-900/50 py-1.5">
                  <span className="text-zinc-500 truncate mr-2">{r.metricName}</span>
                  <span className={`font-bold flex-shrink-0 ${r.impactLevel === 'CRITICAL' ? 'text-red-400' : r.impactLevel === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {r.percentageChange > 0 ? '+' : ''}{r.percentageChange.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Executive Insights Feed */}
      <div className="border border-zinc-800 bg-zinc-950 rounded overflow-hidden font-mono">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
            <Users size={12} className="text-emerald-500" />Executive Intelligence Feed
          </h2>
        </div>
        <div className="divide-y divide-zinc-900/70">
          {executiveInsights.map((insight, i) => (
            <div key={i} className={`px-5 py-4 border-l-2 flex gap-4 ${impactColor[insight.impact]}`}>
              <AlertTriangle size={12} className={`mt-0.5 flex-shrink-0 ${categoryColor[insight.category]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-zinc-200">{insight.title}</h4>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[9px] font-bold ${categoryColor[insight.category]}`}>{insight.category}</span>
                    <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${impactColor[insight.impact]}`}>{insight.impact}</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{insight.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
