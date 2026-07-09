'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_INVESTMENTS } from '@/data/investments';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';

export default function WealthIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/wealth');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const customer = MOCK_CUSTOMERS.find(c => c.id === 'CUST-001');
  const totalValue = MOCK_INVESTMENTS.reduce((s, inv) => s + inv.value, 0);
  const totalCost = MOCK_INVESTMENTS.reduce((s, inv) => s + (inv.units * inv.purchasePrice), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = ((totalGain / totalCost) * 100).toFixed(2);

  const assetTypeColor: Record<string, string> = {
    EQUITY: 'text-indigo-400 border-indigo-900 bg-indigo-950/20',
    MUTUAL_FUND: 'text-sky-400 border-sky-900 bg-sky-950/20',
    GOLD: 'text-amber-400 border-amber-900 bg-amber-950/20',
    DEBT: 'text-emerald-400 border-emerald-900 bg-emerald-950/20',
    ALTERNATIVE: 'text-violet-400 border-violet-900 bg-violet-950/20',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* HNI Summary Header */}
      <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4 font-mono">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
              <Coins size={12} className="text-amber-400" />HNI Wealth Portfolio
            </h2>
            <p className="text-[11px] text-zinc-500 mt-1">{customer?.name} · {customer?.id} · Segment: {customer?.segment}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-zinc-500">Total Portfolio Value</p>
            <p className="text-2xl font-bold text-zinc-100">₹{(totalValue / 100000).toFixed(2)} L</p>
          </div>
        </div>

        {/* Portfolio KPIs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-900 rounded p-3 space-y-0.5">
            <p className="text-[9px] text-zinc-500 uppercase">Total Invested</p>
            <p className="text-sm font-bold text-zinc-300">₹{(totalCost / 100000).toFixed(2)} L</p>
          </div>
          <div className={`bg-zinc-900/40 border rounded p-3 space-y-0.5 ${totalGain >= 0 ? 'border-emerald-900/40' : 'border-red-900/40'}`}>
            <p className="text-[9px] text-zinc-500 uppercase">Unrealised Gain/Loss</p>
            <p className={`text-sm font-bold flex items-center gap-1 ${totalGain >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {totalGain >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              ₹{(Math.abs(totalGain) / 100000).toFixed(2)} L ({totalGainPct}%)
            </p>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-900 rounded p-3 space-y-0.5">
            <p className="text-[9px] text-zinc-500 uppercase">Number of Holdings</p>
            <p className="text-sm font-bold text-zinc-300">{MOCK_INVESTMENTS.length} positions</p>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="border border-zinc-800 bg-zinc-950 rounded overflow-hidden font-mono">
        <div className="px-5 py-3 border-b border-zinc-900">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Holdings Register</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] text-zinc-600 uppercase tracking-wider">
                <th className="px-5 py-3 text-left">Asset</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-right">Units</th>
                <th className="px-5 py-3 text-right">Purchase Price</th>
                <th className="px-5 py-3 text-right">Current Price</th>
                <th className="px-5 py-3 text-right">Current Value</th>
                <th className="px-5 py-3 text-right">Allocation</th>
                <th className="px-5 py-3 text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVESTMENTS.map(inv => {
                const cost = inv.units * inv.purchasePrice;
                const gainPct = (((inv.currentPrice - inv.purchasePrice) / inv.purchasePrice) * 100).toFixed(2);
                const isGain = inv.currentPrice >= inv.purchasePrice;
                return (
                  <tr key={inv.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-zinc-300">{inv.assetName}</p>
                      <p className="text-[9px] text-zinc-600">{inv.id}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${assetTypeColor[inv.assetType] || ''}`}>
                        {inv.assetType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-zinc-400">{inv.units.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-zinc-400">₹{inv.purchasePrice.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right text-zinc-300 font-semibold">₹{inv.currentPrice.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right font-bold text-zinc-100">₹{(inv.value / 100000).toFixed(2)} L</td>
                    <td className="px-5 py-3 text-right text-zinc-400">{inv.allocationPercentage}%</td>
                    <td className={`px-5 py-3 text-right font-bold ${isGain ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isGain ? '+' : ''}{gainPct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
