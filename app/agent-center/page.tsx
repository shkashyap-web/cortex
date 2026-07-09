'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { AGENT_REGISTRY } from '@/config/agents';
import { agentRegistryService } from '@/services/agent/AgentRegistry';
import { Cpu, Zap, Shield, Database, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { AgentStatus } from '@/types';

export default function AgentCenterPage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/agent-center');
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>(
    () => Object.fromEntries(AGENT_REGISTRY.map(a => [a.id, a.status]))
  );

  if (!wsConfig) return <div>Workspace config not found.</div>;

  const statusConfig: Record<AgentStatus, { icon: React.ReactNode; color: string; label: string }> = {
    IDLE: { icon: <CheckCircle2 size={11} />, color: 'text-emerald-400', label: 'IDLE' },
    BUSY: { icon: <Zap size={11} />, color: 'text-amber-400', label: 'BUSY' },
    OFFLINE: { icon: <Circle size={11} />, color: 'text-zinc-600', label: 'OFFLINE' },
    SUSPENDED: { icon: <AlertCircle size={11} />, color: 'text-red-400', label: 'SUSPENDED' },
  };

  const cycleStatus = (agentId: string, current: AgentStatus) => {
    const order: AgentStatus[] = ['IDLE', 'BUSY', 'OFFLINE', 'SUSPENDED'];
    const next = order[(order.indexOf(current) + 1) % order.length];
    agentRegistryService.updateAgentStatus(agentId, next);
    setAgentStatuses(prev => ({ ...prev, [agentId]: next }));
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-4 gap-4 font-mono">
        {(['IDLE', 'BUSY', 'OFFLINE', 'SUSPENDED'] as AgentStatus[]).map(s => {
          const count = Object.values(agentStatuses).filter(v => v === s).length;
          const cfg = statusConfig[s];
          return (
            <div key={s} className="border border-zinc-800 bg-zinc-950 p-4 rounded flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{s} Agents</p>
                <p className={`text-2xl font-bold mt-0.5 ${cfg.color}`}>{count}</p>
              </div>
              <span className={cfg.color}>{cfg.icon}</span>
            </div>
          );
        })}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono">
        {AGENT_REGISTRY.map(agent => {
          const status = agentStatuses[agent.id] || agent.status;
          const cfg = statusConfig[status];
          return (
            <div key={agent.id} className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-zinc-400">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-200">{agent.name}</h3>
                    <p className="text-[10px] text-zinc-500">v{agent.version} · {agent.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => cycleStatus(agent.id, status)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-bold transition-colors ${cfg.color} border-zinc-800 hover:border-zinc-700 bg-zinc-900/50`}
                  title="Click to cycle status"
                >
                  {cfg.icon}
                  {cfg.label}
                </button>
              </div>

              {/* Description */}
              <p className="text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-900 pt-3">{agent.description}</p>

              {/* Capabilities */}
              <div className="space-y-2">
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap size={8} />Capabilities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="px-2 py-0.5 bg-indigo-950/30 border border-indigo-900/50 text-indigo-400 rounded text-[9px] font-semibold">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Supported Entities & Permissions */}
              <div className="grid grid-cols-2 gap-3 border-t border-zinc-900 pt-3">
                <div className="space-y-1">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Database size={8} />Entities
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.supportedEntities.map(e => (
                      <span key={e} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[9px]">{e}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield size={8} />Permissions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {agent.permissions.map(p => (
                      <span key={p} className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded text-[9px]">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Future Tools */}
              <div className="border-t border-zinc-900 pt-2">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-1">Future Tooling</p>
                <p className="text-[10px] text-zinc-600 font-mono">{agent.futureTools.join(' · ')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
