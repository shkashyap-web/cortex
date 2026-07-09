'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_RISK_ASSESSMENTS } from '@/data/riskAlerts';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_MSMES } from '@/data/msmes';
import { AlertTriangle, Shield } from 'lucide-react';

export default function RiskIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/risk');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const scoreColor = (score: number) => {
    if (score >= 70) return 'text-red-400';
    if (score >= 45) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getEntityName = (type: string, id: string) => {
    if (type === 'Customer') return MOCK_CUSTOMERS.find(c => c.id === id)?.name || id;
    if (type === 'MSME') return MOCK_MSMES.find(m => m.id === id)?.companyName || id;
    return id;
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="space-y-5 font-mono">
        {MOCK_RISK_ASSESSMENTS.map(assessment => (
          <div key={assessment.id} className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-5">
            {/* Assessment Header */}
            <div className="flex items-start justify-between border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center">
                  <AlertTriangle size={16} className={scoreColor(assessment.overallScore)} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-200">
                    {getEntityName(assessment.entityType, assessment.entityId)}
                  </h3>
                  <p className="text-[10px] text-zinc-500">{assessment.entityType} · {assessment.entityId} · Assessor: {assessment.assessorId}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-bold ${scoreColor(assessment.overallScore)}`}>{assessment.overallScore}</p>
                <p className="text-[9px] text-zinc-600">Risk Score / 100</p>
              </div>
            </div>

            {/* Score Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>Composite Risk Level</span>
                <span>{assessment.overallScore >= 70 ? 'HIGH RISK' : assessment.overallScore >= 45 ? 'MEDIUM RISK' : 'LOW RISK'}</span>
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${assessment.overallScore >= 70 ? 'bg-red-500' : assessment.overallScore >= 45 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${assessment.overallScore}%` }}
                />
              </div>
            </div>

            {/* Risk Factors */}
            <div className="space-y-2">
              <h4 className="text-[10px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Shield size={9} />Risk Factor Breakdown
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {assessment.factors.map(factor => (
                  <div key={factor.factorName} className="border border-zinc-900 bg-zinc-900/30 rounded p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-zinc-300 leading-tight">{factor.factorName}</span>
                      <span className={`text-xs font-bold ${scoreColor(factor.score)}`}>{factor.score}</span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full ${scoreColor(factor.score) === 'text-red-400' ? 'bg-red-500' : scoreColor(factor.score) === 'text-amber-400' ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${factor.score}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-relaxed">{factor.description}</p>
                    <p className="text-[9px] text-zinc-600">Weight: {(factor.weight * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-zinc-600 border-t border-zinc-900 pt-3">
              <span>Assessed: {new Date(assessment.assessedAt).toLocaleString()}</span>
              <span>Assessment ID: {assessment.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
