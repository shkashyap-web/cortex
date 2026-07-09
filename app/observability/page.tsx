'use client';

import React from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { observabilityService } from '@/services/core/ObservabilityService';
import { EVENT_BUS } from '@/services/core/EventBus';
import { agentRegistryService } from '@/services/agent/AgentRegistry';
import { workflowEngine } from '@/services/core/WorkflowEngine';
import { Activity, Database, Zap, GitBranch, Server } from 'lucide-react';

export default function ObservabilityPage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/observability');
  if (!wsConfig) return <div>Workspace config not found.</div>;

  const metrics = observabilityService.getMetrics();
  const latencyMetrics = metrics.filter(m => m.type === 'LATENCY');
  const errorMetrics = metrics.filter(m => m.type === 'ERROR');
  const avgLatency = latencyMetrics.length > 0
    ? (latencyMetrics.reduce((s, m) => s + (m.durationMs || 0), 0) / latencyMetrics.length).toFixed(1)
    : '—';

  const eventHistory = EVENT_BUS.getHistory();
  const agentStatuses = agentRegistryService.listAgents();

  const platformServices = [
    { name: 'Decision Engine', id: 'cortex-de', healthy: true },
    { name: 'Memory Engine', id: 'cortex-mem', healthy: true },
    { name: 'Event Bus', id: 'cortex-eb', healthy: true },
    { name: 'Workflow Engine', id: 'cortex-wf', healthy: true },
    { name: 'Integration Layer', id: 'cortex-il', healthy: true },
    { name: 'Explainability Engine', id: 'cortex-exp', healthy: true },
    { name: 'Document Intelligence', id: 'cortex-doc', healthy: true },
    { name: 'RBAC Service', id: 'cortex-rbac', healthy: true },
  ];

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      {/* KPI Stats */}
      <div className="grid grid-cols-4 gap-4 font-mono">
        {[
          { label: 'Total Telemetry Events', value: metrics.length, icon: <Activity size={14} />, color: 'text-zinc-200' },
          { label: 'Avg Latency (ms)', value: avgLatency, icon: <Zap size={14} />, color: 'text-emerald-400' },
          { label: 'Error Events', value: errorMetrics.length, icon: <Server size={14} />, color: errorMetrics.length > 0 ? 'text-red-400' : 'text-emerald-400' },
          { label: 'Bus Events Processed', value: eventHistory.length, icon: <GitBranch size={14} />, color: 'text-sky-400' },
        ].map(stat => (
          <div key={stat.label} className="border border-zinc-800 bg-zinc-950 p-4 rounded flex items-center justify-between">
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${stat.color}`}>{stat.value}</p>
            </div>
            <span className={stat.color}>{stat.icon}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono">
        {/* Platform Services Health */}
        <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Server size={12} />Platform Services Health
          </h2>
          <div className="space-y-1.5">
            {platformServices.map(svc => (
              <div key={svc.id} className="flex items-center justify-between text-xs py-2 border-b border-zinc-900/50">
                <div>
                  <p className="text-zinc-300 font-semibold">{svc.name}</p>
                  <p className="text-[9px] text-zinc-600">{svc.id}</p>
                </div>
                <span className={`flex items-center gap-1.5 text-[10px] font-bold ${svc.healthy ? 'text-emerald-400' : 'text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${svc.healthy ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  {svc.healthy ? 'HEALTHY' : 'DOWN'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Status */}
        <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Database size={12} />Agent Registry Status
          </h2>
          <div className="space-y-1.5">
            {agentStatuses.map(agent => (
              <div key={agent.id} className="flex items-center justify-between text-xs py-2 border-b border-zinc-900/50">
                <div>
                  <p className="text-zinc-300 font-semibold">{agent.name}</p>
                  <p className="text-[9px] text-zinc-600">{agent.id} · v{agent.version}</p>
                </div>
                <span className={`text-[10px] font-bold ${
                  agent.status === 'IDLE' ? 'text-emerald-400' :
                  agent.status === 'BUSY' ? 'text-amber-400' :
                  agent.status === 'OFFLINE' ? 'text-zinc-600' : 'text-red-400'
                }`}>{agent.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Telemetry Log */}
      <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3 font-mono">
        <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
          <Activity size={12} />Telemetry Stream ({metrics.length} events)
        </h2>
        {metrics.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-xs text-zinc-600">No telemetry data recorded yet.</p>
            <p className="text-[10px] text-zinc-700 mt-1">Interact with other workspaces (e.g., run a Decision Engine evaluation) to generate events.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {[...metrics].reverse().map(metric => (
              <div key={metric.id} className="flex items-start gap-3 text-[10px] py-2 border-b border-zinc-900/50">
                <span className="text-zinc-600 flex-shrink-0 w-16">{new Date(metric.timestamp).toLocaleTimeString()}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold flex-shrink-0 ${
                  metric.type === 'ERROR' ? 'bg-red-950/40 text-red-400' :
                  metric.type === 'LATENCY' ? 'bg-sky-950/40 text-sky-400' :
                  'bg-zinc-900 text-zinc-500'
                }`}>{metric.type}</span>
                <span className="text-zinc-400">{metric.source} · {metric.name}</span>
                {metric.durationMs !== undefined && (
                  <span className="ml-auto text-zinc-600 flex-shrink-0">{metric.durationMs}ms</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Bus History */}
      {eventHistory.length > 0 && (
        <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3 font-mono">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <GitBranch size={12} />Event Bus History ({eventHistory.length} events)
          </h2>
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {[...eventHistory].reverse().map(event => (
              <div key={event.id} className="flex items-start gap-3 text-[10px] py-2 border-b border-zinc-900/50">
                <span className="text-zinc-600 flex-shrink-0 w-16">{new Date(event.timestamp).toLocaleTimeString()}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-950/40 text-indigo-400 flex-shrink-0">{event.type}</span>
                <span className="text-zinc-500">from: {event.source}</span>
                <span className="ml-auto text-zinc-700 font-mono flex-shrink-0">{event.correlationId.slice(0, 8)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
