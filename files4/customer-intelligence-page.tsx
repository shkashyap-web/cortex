'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_INVESTMENTS } from '@/data/investments';
import { getMockLoansForCustomer } from '@/data/loans';
import { getMockDigitalTwinForEntity } from '@/data/digitalTwins';
import { getMockRiskAssessmentsForEntity } from '@/data/riskAlerts';
import type { RiskAssessment } from '@/types';
import { User, Shield, Briefcase, Activity, RefreshCw } from 'lucide-react';

export default function CustomerIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/customer-intelligence');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-001');

  if (!wsConfig) return <div>Workspace config not found.</div>;

  const currentCustomer = MOCK_CUSTOMERS.find(c => c.id === selectedCustomerId) || MOCK_CUSTOMERS[0];
  const loans = getMockLoansForCustomer(currentCustomer.id);
  const twin = getMockDigitalTwinForEntity('Customer', currentCustomer.id);
  const risk = getMockRiskAssessmentsForEntity('Customer', currentCustomer.id);

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Left Column - Customer Directory */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950 rounded p-4 space-y-4">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center justify-between">
            <span>Customer Directory</span>
            <span className="text-[10px] text-zinc-500 font-normal">Count: {MOCK_CUSTOMERS.length}</span>
          </h2>
          
          <div className="space-y-2">
            {MOCK_CUSTOMERS.map(cust => (
              <button
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className={`w-full text-left p-3 rounded border text-xs transition-colors flex items-center justify-between ${
                  cust.id === selectedCustomerId
                    ? 'border-emerald-600/70 bg-emerald-950/15'
                    : 'border-zinc-905 bg-zinc-900/30 hover:border-zinc-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="font-semibold text-zinc-200">{cust.name}</div>
                  <div className="text-[10px] text-zinc-500">{cust.id} | {cust.phone}</div>
                </div>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                  cust.segment === 'HNI' ? 'bg-indigo-950 border border-indigo-900 text-indigo-400' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'
                }`}>
                  {cust.segment}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Columns - Detailed Intelligence View */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Profile Card */}
          <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
            <div className="flex justify-between items-start border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-zinc-400">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">{currentCustomer.name}</h3>
                  <p className="text-[10px] text-zinc-500">CKYC Ref: {currentCustomer.ckycId || 'NOT_REGISTERED'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                  currentCustomer.kycStatus === 'VERIFIED' ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400' : 'bg-red-950/30 border-red-900 text-red-400'
                }`}>
                  KYC: {currentCustomer.kycStatus}
                </span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded text-[10px]">
                  Risk Profile: {currentCustomer.riskProfile}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">Email Contact</span>
                <div className="text-zinc-300 truncate">{currentCustomer.email}</div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">PAN ID</span>
                <div className="text-zinc-300">{currentCustomer.pan}</div>
              </div>
              <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded space-y-1">
                <span className="text-zinc-500 text-[10px] uppercase">Registered Branch</span>
                <div className="text-zinc-300">{currentCustomer.branchId}</div>
              </div>
            </div>
          </div>

          {/* Underwriting, Twins & Risk Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Assessment */}
            <div className="border border-zinc-800 bg-zinc-950 rounded p-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Shield size={12} className="text-emerald-500" />
                Risk assessment score
              </h4>
              
              {risk ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-zinc-400">Composite Risk Score:</span>
                    <span className="text-sm font-bold text-zinc-200">{risk.overallScore} / 100</span>
                  </div>
                  <div className="space-y-1.5">
                    {risk.factors.map((fact: RiskAssessment['factors'][number]) => (
                      <div key={fact.factorName} className="text-[10px] bg-zinc-900/50 p-2 rounded border border-zinc-900">
                        <div className="flex justify-between font-semibold">
                          <span className="text-zinc-400">{fact.factorName}</span>
                          <span className="text-zinc-300">Factor Score: {fact.score}</span>
                        </div>
                        <p className="text-zinc-500 mt-0.5">{fact.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-600 text-center py-6">No risk factors evaluated yet for this profile.</div>
              )}
            </div>

            {/* Digital Twin Replicant */}
            <div className="border border-zinc-800 bg-zinc-950 rounded p-4 space-y-3">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                <Activity size={12} className="text-indigo-500" />
                Digital Twin Analytics
              </h4>
              
              {twin ? (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Twin Twin ID:</span>
                    <span className="text-zinc-300 font-semibold">{twin.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Twin Health Status:</span>
                    <span className={`font-bold ${
                      twin.healthStatus === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-500'
                    }`}>{twin.healthStatus}</span>
                  </div>
                  
                  <div className="bg-zinc-900/50 p-3 border border-zinc-900 rounded space-y-1">
                    <span className="text-zinc-500 text-[10px] uppercase">Fitted Forecast Warning:</span>
                    <p className="text-[10px] text-zinc-400 leading-relaxed">{twin.predictionPlaceholder}</p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-zinc-600 text-center py-6">No digital twin context registered.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
