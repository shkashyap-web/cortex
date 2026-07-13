'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, ChevronDown, Check, Globe, AlertTriangle, TrendingUp, ShieldAlert, Info } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import Breadcrumbs from './Breadcrumbs';
import CommandPalette from './CommandPalette';

const NOTIFICATIONS = [
  { id: 1, icon: ShieldAlert, tone: 'text-red-400', title: 'High-severity fraud alert', detail: 'Card-not-present velocity anomaly · BR-MUMBAI-01', time: '3m ago' },
  { id: 2, icon: TrendingUp, tone: 'text-emerald-400', title: 'MSME opportunity identified', detail: '4 accounts eligible for credit line expansion', time: '22m ago' },
  { id: 3, icon: AlertTriangle, tone: 'text-amber-400', title: 'Pending loan review', detail: '2 applications awaiting risk sign-off', time: '1h ago' },
  { id: 4, icon: Info, tone: 'text-sky-400', title: 'System update', detail: 'Decision Engine reasoner pipeline redeployed', time: '3h ago' },
];

export const Topbar: React.FC = () => {
  const { context } = useRBAC();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeWorkspaceBranch, setActiveWorkspaceBranch] = useState('Mumbai BKC HQ (BR-MUMBAI-01)');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const workspaces = [
    'Mumbai BKC HQ (BR-MUMBAI-01)',
    'Delhi Connaught Place (BR-DELHI-02)',
    'Ahmedabad CG Road MSME (BR-AHMEDABAD-03)'
  ];

  return (
    <header className="h-14 bg-zinc-950 border-b border-zinc-900 flex items-center justify-between px-6 select-none font-mono">
      {/* Breadcrumbs Left */}
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>

      {/* Utilities Right */}
      <div className="flex items-center gap-4">
        {/* Branch Workspace Selector */}
        <div className="relative">
          <button
            onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 hover:bg-zinc-800/80 transition-colors"
          >
            <Globe size={12} className="text-zinc-500" />
            <span>{activeWorkspaceBranch}</span>
            <ChevronDown size={10} className="text-zinc-500" />
          </button>
          
          {showWorkspaceMenu && (
            <div className="absolute right-0 mt-1.5 w-64 bg-zinc-950 border border-zinc-800 rounded shadow-2xl z-50 py-1 font-mono">
              <div className="px-3 py-1 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-1.5 mb-1">
                Select Active Branch
              </div>
              {workspaces.map(ws => (
                <button
                  key={ws}
                  onClick={() => {
                    setActiveWorkspaceBranch(ws);
                    setShowWorkspaceMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100 flex items-center justify-between"
                >
                  <span>{ws}</span>
                  {activeWorkspaceBranch === ws && <Check size={12} className="text-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search / Command Palette Trigger */}
        <button
          onClick={() => setPaletteOpen(true)}
          className="relative w-52 flex items-center gap-2 pl-8 pr-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500 hover:border-zinc-700 hover:text-zinc-400 transition-colors text-left"
        >
          <span className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500">
            <Search size={12} />
          </span>
          <span className="flex-1">Search workspaces...</span>
          <kbd className="text-[9px] border border-zinc-800 rounded px-1 py-0.5 text-zinc-600">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-1.5 text-zinc-500 hover:text-zinc-300 relative border border-transparent hover:border-zinc-800 hover:bg-zinc-900 rounded transition-colors"
          >
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl z-50 py-1 font-mono">
              <div className="px-3 py-2 text-[10px] text-zinc-500 uppercase tracking-wider border-b border-zinc-900 flex items-center justify-between">
                <span>Notification Center</span>
                <span className="text-emerald-500">{NOTIFICATIONS.length} new</span>
              </div>
              <div className="max-h-72 overflow-y-auto scrollbar-thin">
                {NOTIFICATIONS.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 hover:bg-zinc-900/70 border-b border-zinc-900/60 last:border-0">
                      <Icon size={13} className={`${n.tone} mt-0.5 shrink-0`} />
                      <div className="min-w-0">
                        <div className="text-[11px] text-zinc-200 font-semibold truncate">{n.title}</div>
                        <div className="text-[10px] text-zinc-500 truncate">{n.detail}</div>
                        <div className="text-[9px] text-zinc-700 mt-0.5">{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
        <div className="flex items-center gap-2 border-l border-zinc-900 pl-4">
          <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
            <User size={12} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-zinc-300 font-semibold leading-tight">S. Das</span>
            <span className="text-[9px] text-zinc-600 font-mono leading-none mt-0.5">{context.role}</span>
          </div>
        </div>
      </div>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
};
export default Topbar;