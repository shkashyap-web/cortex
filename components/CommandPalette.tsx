'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { Search, CornerDownLeft } from 'lucide-react';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';

type IconMap = Record<string, React.ComponentType<{ size?: number; className?: string }>>;

const IconRenderer = ({ name }: { name: string }) => {
  const IconComponent = (Icons as unknown as IconMap)[name];
  if (!IconComponent) return <Icons.Circle size={13} />;
  return <IconComponent size={13} />;
};

export interface CommandPaletteHandle {
  open: () => void;
}

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const workspaces = useMemo(() => workspaceRegistryService.getAuthorizedWorkspaces(), []);

  const results = useMemo(() => {
    if (!query.trim()) return workspaces;
    const q = query.toLowerCase();
    return workspaces.filter(
      (ws) => ws.title.toLowerCase().includes(q) || ws.description?.toLowerCase().includes(q)
    );
  }, [query, workspaces]);

  const safeActiveIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  const navigateTo = useCallback(
    (route: string) => {
      router.push(route);
      onClose();
      setQuery('');
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const target = results[safeActiveIndex];
        if (target) navigateTo(target.route);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, results, safeActiveIndex, navigateTo, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center pt-[15vh] px-4 font-mono">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-cortex-fade-in-scale">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900">
          <Search size={14} className="text-zinc-500 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Jump to a workspace or run a command..."
            className="flex-1 bg-transparent outline-none text-sm text-zinc-200 placeholder-zinc-600"
          />
          <kbd className="text-[10px] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto scrollbar-thin py-2">
          {results.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-zinc-600">No workspaces match &ldquo;{query}&rdquo;</div>
          )}
          {results.map((ws, idx) => (
            <button
              key={ws.id}
              onClick={() => navigateTo(ws.route)}
              onMouseEnter={() => setActiveIndex(idx)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                idx === safeActiveIndex ? 'bg-zinc-900' : ''
              }`}
            >
              <span className={`shrink-0 ${idx === safeActiveIndex ? 'text-emerald-400' : 'text-zinc-500'}`}>
                <IconRenderer name={ws.icon} />
              </span>
              <span className="flex-1 min-w-0">
                <div className={`text-xs truncate ${idx === safeActiveIndex ? 'text-zinc-100' : 'text-zinc-300'}`}>
                  {ws.title}
                </div>
                <div className="text-[10px] text-zinc-600 truncate">{ws.description}</div>
              </span>
              {idx === safeActiveIndex && <CornerDownLeft size={12} className="text-zinc-600 shrink-0" />}
            </button>
          ))}
        </div>

        <div className="border-t border-zinc-900 px-4 py-2 flex items-center gap-4 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1">
            <kbd className="border border-zinc-800 rounded px-1">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-zinc-800 rounded px-1">↵</kbd> Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-zinc-800 rounded px-1">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;