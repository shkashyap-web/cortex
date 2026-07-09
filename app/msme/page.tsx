'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_MSMES } from '@/data/msmes';
import { getMockLoansForMSME } from '@/data/loans';
import { getMockDigitalTwinForEntity } from '@/data/digitalTwins';
import { Store, Activity, TrendingUp } from 'lucide-react';

export default function MSMEIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/msme');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const ratingColor: Record<string, string> = {
    AAA: 'text-emerald-400', AA: 'text-emerald-500', A: 'text-green-400',
    BBB: 'text-yellow-400', BB: 'text-amber-400', B: 'text-orange-400',
    C: 'text-red-400', D: 'text-red-600',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="space-y-5 font-mono">
        {MOCK_MSMES.map(msme => {
          const loans = getMockLoansForMSME(msme.id);
          const twin = getMockDigitalTwinForEntity('MSME', msme.id);

          return (
            <div key={msme.id} className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-zinc-400">
                    <Store size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{msme.companyName}</h3>
                    <p className="text-[10px] text-zinc-500">{msme.id} · {msme.registrationNumber}</p>
                    <p className="text-[10px] text-zinc-500">GST: {msme.gstNumber} · Branch: {msme.branchId}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`text-lg font-bold ${ratingColor[msme.riskRating]}`}>{msme.riskRating}</p>
                  <p className="text-[9px] text-zinc-600">Risk Rating</p>
                </div>
              </div>

              {/* Core Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Annual Revenue', value: `₹${(msme.annualRevenue / 10000000).toFixed(1)} Cr` },
                  { label: 'Employees', value: msme.employeeCount },
                  { label: 'Industry', value: msme.industry },
                  { label: 'Health Score', value: `${msme.financialHealthScore}/100` },
                ].map(item => (
                  <div key={item.label} className="bg-zinc-900/40 border border-zinc-900 p-3 rounded space-y-0.5">
                    <p className="text-[9px] text-zinc-500 uppercase">{item.label}</p>
                    <p className="text-xs font-bold text-zinc-300">{String(item.value)}</p>
                  </div>
                ))}
              </div>

              {/* Financial Health Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>Financial Health Index</span>
                  <span>{msme.financialHealthScore}%</span>
                </div>
                <div className="w-full bg-zinc-900 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${msme.financialHealthScore >= 75 ? 'bg-emerald-500' : msme.financialHealthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${msme.financialHealthScore}%` }}
                  />
                </div>
              </div>

              {/* Loans & Twin */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Loans */}
                <div className="border border-zinc-900 rounded p-3 space-y-2">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1"><TrendingUp size={9} />Active Credit Facilities</h4>
                  {loans.length === 0 ? (
                    <p className="text-[10px] text-zinc-600">No credit facilities.</p>
                  ) : (
                    loans.map(loan => (
                      <div key={loan.id} className="text-[10px] bg-zinc-900/50 p-2 rounded flex justify-between">
                        <span className="text-zinc-400">{loan.type.replace(/_/g, ' ')}</span>
                        <span className="text-zinc-300 font-bold">₹{(loan.amount / 100000).toFixed(0)} L @ {loan.interestRate}%</span>
                      </div>
                    ))
                  )}
                </div>

                {/* Twin */}
                <div className="border border-zinc-900 rounded p-3 space-y-2">
                  <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1"><Activity size={9} />Digital Twin Signal</h4>
                  {twin ? (
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Twin Status:</span>
                        <span className={`font-bold ${twin.healthStatus === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`}>{twin.healthStatus}</span>
                      </div>
                      <p className="text-zinc-500 leading-relaxed">{twin.predictionPlaceholder}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] text-zinc-600">No digital twin registered.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
