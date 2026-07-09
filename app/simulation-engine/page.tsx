'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_SIMULATION_SCENARIOS } from '@/data/simulations';
import { TrendingUp, PlayCircle, AlertTriangle, CheckCircle2, Minus } from 'lucide-react';

export default function SimulationEnginePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/simulation-engine');
  const [selectedId, setSelectedId] = useState<string>(MOCK_SIMULATION_SCENARIOS[0]?.id || '');

  if (!wsConfig) return <div>Workspace config not found.</div>;

  const selected = MOCK_SIMULATION_SCENARIOS.find(s => s.id === selectedId);

  const impactIcon = (level: string) => {
    if (level === 'CRITICAL') return <AlertTriangle size={11} className="text-red-400" />;
    if (level === 'WARNING') return <AlertTriangle size={11} className="text-amber-400" />;
    if (level === 'POSITIVE') return <CheckCircle2 size={11} className="text-emerald-400" />;
    return <Minus size={11} className="text-zinc-500" />;
  };

  const impactColor = (level: string) => {
    if (level === 'CRITICAL') return 'text-red-400';
    if (level === 'WARNING') return 'text-amber-400';
    if (level === 'POSITIVE') return 'text-emerald-400';
    return 'text-zinc-400';
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Scenario List */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><TrendingUp size={12} /> Scenarios</span>
            <span className="text-[10px] text-zinc-500 font-normal">{MOCK_SIMULATION_SCENARIOS.length}</span>
          </h2>
          <div className="space-y-2">
            {MOCK_SIMULATION_SCENARIOS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedId(s.id)}
                className={`w-full text-left p-3 rounded border text-xs transition-colors space-y-1 ${
                  s.id === selectedId ? 'border-emerald-700/60 bg-emerald-950/15' : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 truncate">{s.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                    s.status === 'COMPLETED' ? 'border-emerald-900 text-emerald-400' : 'border-zinc-700 text-zinc-500'
                  }`}>{s.status}</span>
                </div>
                <p className="text-[9px] text-zinc-600">{s.id} · by {s.executedBy}</p>
              </button>
            ))}
          </div>

          {/* Placeholder: Run new simulation */}
          <div className="border border-dashed border-zinc-800 rounded p-3 flex items-center gap-2 text-[10px] text-zinc-600 hover:text-zinc-500 hover:border-zinc-700 cursor-pointer transition-colors">
            <PlayCircle size={12} />
            Configure & Run New Scenario
          </div>
        </div>

        {/* Scenario Detail */}
        <div className="lg:col-span-2 space-y-5">
          {selected ? (
            <>
              {/* Header */}
              <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
                <div className="border-b border-zinc-900 pb-3 space-y-1">
                  <h3 className="text-sm font-bold text-zinc-100">{selected.name}</h3>
                  <p className="text-[11px] text-zinc-400">{selected.description}</p>
                </div>

                {/* Parameters Grid */}
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2">Input Parameters</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {[
                      ['Interest Rate Δ', `${selected.parameters.interestRateChange > 0 ? '+' : ''}${selected.parameters.interestRateChange}%`],
                      ['Inflation Δ', `${selected.parameters.inflationChange > 0 ? '+' : ''}${selected.parameters.inflationChange}%`],
                      ['Fuel Price Δ', `${selected.parameters.fuelPriceChange > 0 ? '+' : ''}${selected.parameters.fuelPriceChange}%`],
                      ['Economic Slowdown', `${selected.parameters.economicSlowdownPercent}%`],
                      ['MSME Growth', `${selected.parameters.msmeGrowthPercent}%`],
                      ['Portfolio Shock', selected.parameters.portfolioShockLevel],
                    ].map(([label, val]) => (
                      <div key={label} className="bg-zinc-900/50 border border-zinc-900 rounded p-2.5 space-y-0.5">
                        <p className="text-[9px] text-zinc-500">{label}</p>
                        <p className="font-bold text-zinc-200">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Table */}
              {selected.results && selected.results.length > 0 && (
                <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2">Simulation Results</h3>
                  <div className="space-y-2">
                    {selected.results.map((result, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 bg-zinc-900/30 border border-zinc-900 rounded text-xs">
                        <div className="flex items-center gap-1.5 w-48 flex-shrink-0">
                          {impactIcon(result.impactLevel)}
                          <span className="text-zinc-300 font-semibold truncate">{result.metricName}</span>
                        </div>
                        <div className="flex items-center gap-4 ml-auto text-right">
                          <div>
                            <p className="text-[9px] text-zinc-600">Baseline</p>
                            <p className="text-zinc-400">{result.baselineValue.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-600">Simulated</p>
                            <p className={`font-bold ${impactColor(result.impactLevel)}`}>{result.simulatedValue.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-[9px] text-zinc-600">Change</p>
                            <p className={`font-bold ${result.percentageChange > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {result.percentageChange > 0 ? '+' : ''}{result.percentageChange.toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.summaryInsight && (
                    <div className="border border-amber-900/40 bg-amber-950/10 rounded p-4 space-y-1">
                      <p className="text-[9px] text-amber-500 uppercase tracking-wider">Executive Summary Insight</p>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">{selected.summaryInsight}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="border border-zinc-800 bg-zinc-950 rounded p-10 flex items-center justify-center">
              <p className="text-xs text-zinc-600">Select a simulation scenario to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
