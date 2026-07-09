'use client';

import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import { ROLE_DETAILS } from '@/config/rbac';
import { Role } from '@/types';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { Shield, Key, Eye, Check } from 'lucide-react';

export default function SettingsPage() {
  const { context, switchRole } = useRBAC();
  const settingsWorkspace = workspaceRegistryService.getWorkspaceByRoute('/settings');

  if (!settingsWorkspace) return <div>Settings workspace config not found.</div>;

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={settingsWorkspace} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Active Session Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4">
            <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2">
              Active Security Context
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Security Identity:</span>
                <span className="text-zinc-300 font-bold">{context.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Operational Role:</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <Shield size={10} />
                  {context.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Branch Division:</span>
                <span className="text-zinc-300">{context.branchId || 'GLOBAL'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-zinc-500 block mb-1">Assigned Permissions Checklist:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {context.permissions.map(perm => (
                    <span key={perm} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[9px] font-semibold">
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns - Role Simulator */}
        <div className="lg:col-span-2 border border-zinc-800 bg-zinc-950 p-5 rounded space-y-4">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Key size={14} className="text-emerald-500" />
            Enterprise Role Simulator (RBAC Testing)
          </h2>
          <p className="text-xs text-zinc-400">
            Select a target profile to swap simulated credentials. Navigational permissions, decision evaluations, and view accessibility filters adjust instantly across the platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
            {(Object.keys(ROLE_DETAILS) as Role[]).map(roleName => {
              const details = ROLE_DETAILS[roleName];
              const isActive = context.role === roleName;
              return (
                <button
                  key={roleName}
                  onClick={() => switchRole(roleName)}
                  className={`border text-left p-4 rounded transition-all duration-150 flex flex-col justify-between h-32 hover:border-zinc-700 ${
                    isActive
                      ? 'border-emerald-600/70 bg-emerald-950/15'
                      : 'border-zinc-800 bg-zinc-900/40'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isActive ? 'text-emerald-400' : 'text-zinc-300'}`}>
                        {roleName}
                      </span>
                      {isActive && (
                        <span className="w-4 h-4 bg-emerald-950/40 border border-emerald-600 rounded-full flex items-center justify-center text-emerald-400">
                          <Check size={8} />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 line-clamp-3 leading-relaxed">
                      {details.description}
                    </p>
                  </div>
                  <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-mono self-end">
                    {isActive ? 'ACTIVE CREDENTIALS' : 'CLICK TO SWITCH'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
