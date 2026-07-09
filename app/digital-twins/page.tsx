'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_DIGITAL_TWINS } from '@/data/digitalTwins';
import { Activity, Binary, RefreshCw, AlertTriangle } from 'lucide-react';

export default function DigitalTwinsPage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/digital-twins');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const healthColors = {
    HEALTHY: 'text-emerald-400 border-emerald-900 bg-emerald-950/20',
    WARNING: 'text-amber-400 border-amber-900 bg-amber-950/20',
    CRITICAL: 'text-red-400 border-red-900 bg-red-950/20',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 font-mono">
        {MOCK_DIGITAL_TWINS.map(twin => (
          <div key={twin.id} className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
            {/* Twin Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Binary size={14} className="text-indigo-400" />
                  <span className="text-xs font-bold text-zinc-200">{twin.entityType} Twin</span>
                </div>
                <p className="text-[10px] text-zinc-500">{twin.id}</p>
                <p className="text-[10px] text-zinc-500">Ref Entity: {twin.entityId}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${healthColors[twin.healthStatus]}`}>
                {twin.healthStatus}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="border-t border-zinc-900 pt-3 grid grid-cols-2 gap-2">
              {Object.entries(twin.metrics).map(([key, val]) => (
                <div key={key} className="bg-zinc-900/50 border border-zinc-900 rounded p-2 space-y-0.5">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider truncate">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-xs font-bold text-zinc-200">{typeof val === 'number' && val > 1000 ? `₹${(val / 1e7).toFixed(1)}Cr` : val.toFixed ? val.toFixed(2) : val}</p>
                </div>
              ))}
            </div>

            {/* Prediction / Recommendation */}
            <div className="space-y-2 border-t border-zinc-900 pt-3">
              <div className="bg-zinc-900/30 border border-zinc-900 p-3 rounded space-y-1">
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Activity size={8} />Prediction Signal
                </p>
                <p className="text-[10px] text-zinc-400 leading-relaxed">{twin.predictionPlaceholder}</p>
              </div>
              <div className="bg-indigo-950/10 border border-indigo-900/40 p-3 rounded space-y-1">
                <p className="text-[9px] text-indigo-500 uppercase tracking-wider">Advisory Placeholder</p>
                <p className="text-[10px] text-zinc-400 leading-relaxed">{twin.recommendationPlaceholder}</p>
              </div>
            </div>

            {/* Relationships */}
            {twin.relationships.length > 0 && (
              <div className="border-t border-zinc-900 pt-3 space-y-1">
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Entity Relationships</p>
                {twin.relationships.map((rel, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px]">
                    <span className="text-zinc-600">{rel.targetEntityType}</span>
                    <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded font-mono">{rel.relationshipType}</span>
                    <span className="text-zinc-400 truncate">{rel.targetEntityId}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-[9px] text-zinc-600">
              <span>Last Sync: {new Date(twin.lastSyncTimestamp).toLocaleTimeString()}</span>
              <button className="flex items-center gap-1 text-indigo-500 hover:text-indigo-400 transition-colors">
                <RefreshCw size={9} />
                Sync Twin
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
