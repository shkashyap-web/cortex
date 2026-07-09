'use client';

import React from 'react';
import { Shield, Settings, Server } from 'lucide-react';
import { WorkspaceConfig } from '@/types';

interface WorkspaceHeaderProps {
  config: WorkspaceConfig;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ config }) => {
  return (
    <div className="border border-zinc-800 bg-zinc-950 p-6 rounded mb-6 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 uppercase tracking-widest text-[9px]">Workspace Context</span>
            {config.featureFlags.map(flag => (
              <span key={flag} className="px-1.5 py-0.5 bg-indigo-950/40 border border-indigo-900 text-indigo-400 rounded text-[9px] font-bold">
                FLAG: {flag}
              </span>
            ))}
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{config.title}</h1>
          <p className="text-xs text-zinc-400 max-w-2xl">{config.description}</p>
        </div>

        {/* Workspace Specifications (Permissions/Required Services) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Permissions */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-400">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-zinc-500">RBAC:</span>
            <span className="font-semibold text-zinc-300">
              {config.permissions.join(', ')}
            </span>
          </div>

          {/* Services */}
          {config.requiredServices.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded text-[11px] text-zinc-400">
              <Server size={12} className="text-indigo-500" />
              <span className="text-zinc-500">Engines:</span>
              <span className="font-semibold text-zinc-300">
                {config.requiredServices.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WorkspaceHeader;
