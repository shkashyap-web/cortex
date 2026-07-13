'use client';

import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import type { CortexSession } from './BootSequence';

const SUBSYSTEMS = [
  'Enterprise Memory',
  'Event Bus',
  'Decision Engine',
  'Knowledge Graph',
  'Digital Twins',
  'AI Agents',
  'Fraud Intelligence',
  'Executive Intelligence',
];

export const InitializationScreen: React.FC<{
  onComplete: () => void;
  session: CortexSession | null;
}> = ({ onComplete, session }) => {
  const [readyCount, setReadyCount] = useState(0);

  useEffect(() => {
    if (readyCount >= SUBSYSTEMS.length) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
    const delay = 180 + Math.random() * 220;
    const t = setTimeout(() => setReadyCount((c) => c + 1), delay);
    return () => clearTimeout(t);
  }, [readyCount, onComplete]);

  const progress = Math.min(100, Math.round((readyCount / SUBSYSTEMS.length) * 100));

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center font-mono">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-sm mx-4 animate-cortex-fade-in">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-sm tracking-[0.2em] text-zinc-200 uppercase">Initializing CORTEX</h2>
          {session && (
            <p className="text-[10px] text-zinc-600 mt-1.5">
              {session.employeeName} · {session.role} · {session.branch.split(' (')[0]}
            </p>
          )}
        </div>

        <div className="space-y-2.5 mb-8">
          {SUBSYSTEMS.map((system, idx) => {
            const isReady = idx < readyCount;
            const isActive = idx === readyCount;
            return (
              <div
                key={system}
                className={`flex items-center gap-3 text-xs transition-opacity ${
                  isReady || isActive ? 'opacity-100' : 'opacity-30'
                } ${isReady ? 'animate-cortex-check-in' : ''}`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
                    isReady
                      ? 'bg-emerald-950/40 border-emerald-700 text-emerald-500'
                      : isActive
                      ? 'border-zinc-600 text-zinc-500'
                      : 'border-zinc-800 text-zinc-800'
                  }`}
                >
                  {isReady ? (
                    <Check size={10} />
                  ) : isActive ? (
                    <Loader2 size={10} className="animate-spin" />
                  ) : null}
                </span>
                <span className={isReady ? 'text-zinc-300' : isActive ? 'text-zinc-400' : 'text-zinc-700'}>
                  {system}
                </span>
              </div>
            );
          })}
        </div>

        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-zinc-600">
          <span>Establishing secure enterprise session</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default InitializationScreen;