'use client';

import React from 'react';
import { useRBAC } from '@/hooks/useRBAC';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { agentRegistryService } from '@/services/agent/AgentRegistry';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { MOCK_MSMES } from '@/data/msmes';
import { MOCK_LOANS } from '@/data/loans';
import { Activity, ShieldAlert, Cpu, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function OverviewPage() {
  const { context } = useRBAC();
  const overviewWorkspace = workspaceRegistryService.getWorkspaceByRoute('/overview');
  const totalAgents = agentRegistryService.getAllAgents().length;
  const activeAgents = agentRegistryService.getAllAgents().filter(a => a.status === 'IDLE' || a.status === 'BUSY').length;

  if (!overviewWorkspace) return <div>Overview workspace config not found.</div>;

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={overviewWorkspace} />

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-2">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] uppercase tracking-wider font-bold">Cognitive Health</span>
            <Heart size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-zinc-100 font-mono">98.2%</div>
          <p className="text-[10px] text-zinc-500">All services online and syncing.</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-2">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] uppercase tracking-wider font-bold">Pluggable Agents</span>
            <Cpu size={14} className="text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-zinc-100 font-mono">{activeAgents} / {totalAgents}</div>
          <p className="text-[10px] text-zinc-500">Active agent executors online.</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-2">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] uppercase tracking-wider font-bold">Active Customer Twins</span>
            <Activity size={14} className="text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-zinc-100 font-mono">{MOCK_CUSTOMERS.length + MOCK_MSMES.length}</div>
          <p className="text-[10px] text-zinc-500">Sync cycle latency: ~0.45s</p>
        </div>

        <div className="border border-zinc-800 bg-zinc-950 p-5 rounded space-y-2">
          <div className="flex justify-between items-start text-zinc-500">
            <span className="text-[10px] uppercase tracking-wider font-bold">Active Loan Ratios</span>
            <CheckCircle2 size={14} className="text-amber-500" />
          </div>
          <div className="text-xl font-bold text-zinc-100 font-mono">
            {MOCK_LOANS.filter(l => l.status === 'ACTIVE').length} Active
          </div>
          <p className="text-[10px] text-zinc-500">Total volume INR 2.25 Cr.</p>
        </div>
      </div>

      {/* Platform Concept Info */}
      <div className="border border-zinc-800 bg-zinc-950 p-6 rounded space-y-4">
        <h2 className="text-sm font-bold text-zinc-200">CORTEX Cognitive Architecture</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-zinc-400">
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Event-Driven Decoupling
            </h3>
            <p className="leading-relaxed text-[11px]">
              Every transactional ledger update, loan request, or digital twin synchronizer publishes structured events to the central Event Bus. Engines subscribe and react autonomously.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Enterprise Memory Context
            </h3>
            <p className="leading-relaxed text-[11px]">
              Platform decisions consult the Memory Engine, pulling historical interactions, compliance checklists, and behavioral changes instead of standard isolated API calls.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-zinc-300 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              Explainable Rationale Trace
            </h3>
            <p className="leading-relaxed text-[11px]">
              Rather than black-box evaluations, the Decision Engine compiles audit steps, alternative evaluations, and citation evidence to justify underwriting recommendations.
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-500">
          <span>Enterprise operating system session: ACTIVE</span>
          <Link href="/settings" className="text-emerald-500 hover:underline">
            Open Simulator to change Roles &gt;
          </Link>
        </div>
      </div>
    </div>
  );
}
