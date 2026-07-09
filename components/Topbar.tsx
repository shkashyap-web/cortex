'use client';

import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown, Check, Globe } from 'lucide-react';
import { useRBAC } from '@/hooks/useRBAC';
import Breadcrumbs from './Breadcrumbs';

export const Topbar: React.FC = () => {
  const { context } = useRBAC();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [activeWorkspaceBranch, setActiveWorkspaceBranch] = useState('Mumbai BKC HQ (BR-MUMBAI-01)');

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

        {/* Global Search Placeholder */}
        <div className="relative w-48">
          <span className="absolute inset-y-0 left-2.5 flex items-center text-zinc-500">
            <Search size={12} />
          </span>
          <input
            type="text"
            placeholder="Search catalog..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700"
            disabled
          />
        </div>

        {/* Notifications Icon */}
        <button className="p-1.5 text-zinc-500 hover:text-zinc-300 relative border border-transparent hover:border-zinc-800 hover:bg-zinc-900 rounded transition-colors">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        </button>

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
    </header>
  );
};
export default Topbar;
