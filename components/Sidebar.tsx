'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { SidebarGroup, WorkspaceConfig } from '@/types';

// Dynamic icon resolver helper
const IconRenderer = ({ name, size = 16, className = '' }: { name: string; size?: number; className?: string }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle size={size} className={className} />;
  }
  return <IconComponent size={size} className={className} />;
};

const GROUP_TITLES: Record<SidebarGroup, string> = {
  intelligence: 'Intelligence Engines',
  operations: 'Core Operations',
  management: 'Governance & Audits',
  system: 'System Control'
};

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { getGroupedWorkspaces, activeRole } = useWorkspace();
  const grouped = getGroupedWorkspaces();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-900 text-zinc-400 flex flex-col h-screen select-none">
      {/* Brand Header */}
      <div className="h-14 border-b border-zinc-900 flex items-center px-5 gap-2.5">
        <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white font-mono font-bold text-sm tracking-tighter">
          C
        </div>
        <div>
          <div className="text-zinc-100 font-mono font-bold text-sm tracking-widest leading-none">CORTEX</div>
          <span className="text-[10px] text-zinc-500 font-mono leading-none tracking-tight">Enterprise Banking OS</span>
        </div>
      </div>

      {/* Role Indicator Banner */}
      <div className="bg-zinc-900/60 border-b border-zinc-900/80 px-5 py-2 flex flex-col justify-center">
        <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-mono">Simulated Role</span>
        <div className="text-xs text-emerald-500 font-mono font-semibold flex items-center gap-1.5 mt-0.5">
          <Icons.Shield size={10} />
          {activeRole}
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 scrollbar-thin">
        {(Object.keys(grouped) as SidebarGroup[]).map(groupKey => {
          const workspaces = grouped[groupKey];
          if (workspaces.length === 0) return null;

          return (
            <div key={groupKey} className="space-y-1">
              <h3 className="px-3 text-[10px] uppercase font-mono font-bold text-zinc-600 tracking-wider">
                {GROUP_TITLES[groupKey]}
              </h3>
              <nav className="space-y-0.5">
                {workspaces.map((ws: WorkspaceConfig) => {
                  const isActive = pathname === ws.route;
                  return (
                    <Link
                      key={ws.id}
                      href={ws.route}
                      className={`flex items-center gap-3 px-3 py-2 rounded text-xs font-mono transition-colors ${
                        isActive
                          ? 'bg-zinc-900 text-emerald-400 font-semibold border-l-2 border-emerald-500 rounded-l-none'
                          : 'hover:bg-zinc-900/50 hover:text-zinc-200'
                      }`}
                    >
                      <IconRenderer name={ws.icon} size={14} className={isActive ? 'text-emerald-400' : 'text-zinc-500'} />
                      <span className="truncate">{ws.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="h-10 border-t border-zinc-900 px-5 flex items-center justify-between text-[10px] font-mono text-zinc-600 bg-zinc-950">
        <span>V1.0.0-BETA</span>
        <span className="flex items-center gap-1 text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          CBS ONLINE
        </span>
      </div>
    </aside>
  );
};
export default Sidebar;
