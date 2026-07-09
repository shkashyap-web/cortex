'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useWorkspace } from '@/hooks/useWorkspace';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';

export const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { isRouteAllowed, activeRole } = useWorkspace();

  const isAllowed = isRouteAllowed(pathname);
  const currentWorkspace = workspaceRegistryService.getWorkspaceByRoute(pathname);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-mono selection:bg-emerald-900 selection:text-white">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Core Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Topbar />

        {/* Dynamic Workspace Panel */}
        <main className="flex-1 overflow-y-auto bg-zinc-900/40 p-6 scrollbar-thin">
          {isAllowed ? (
            children
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-md w-full border border-red-950 bg-red-950/10 rounded p-6 text-center space-y-4">
                <div className="w-10 h-10 bg-red-950/30 border border-red-900 rounded-full flex items-center justify-center text-red-500 mx-auto">
                  <ShieldAlert size={20} />
                </div>
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-red-200">Access Policy Denied</h2>
                  <p className="text-xs text-zinc-500">
                    Your current role does not possess the credentials required to enter this workspace.
                  </p>
                </div>
                
                <div className="bg-zinc-950 border border-zinc-900 rounded p-3 text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Active Workspace:</span>
                    <span className="text-zinc-300 font-semibold">{currentWorkspace?.title || pathname}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Assigned Role:</span>
                    <span className="text-emerald-500 font-semibold">{activeRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-600">Required Policy:</span>
                    <span className="text-red-400 font-mono">
                      {currentWorkspace?.permissions.join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-600">
                  Switch your simulated role in the <Link href="/settings" className="text-emerald-500 hover:underline">Settings</Link> panel to evaluate different access levels.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Help dynamic import link
import Link from 'next/link';

export default Shell;
