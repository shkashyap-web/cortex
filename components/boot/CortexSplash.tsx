'use client';

import React, { useEffect } from 'react';

export const CortexSplash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, 2600);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center font-mono overflow-hidden">
      {/* subtle grid backdrop */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-zinc-950" />

      <div className="relative flex flex-col items-center animate-cortex-fade-in-scale">
        <div className="relative w-16 h-16 mb-8 flex items-center justify-center rounded-2xl border border-emerald-900/60 bg-emerald-950/20 animate-cortex-pulse-ring">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#10b981" strokeWidth="1.5">
            <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
            <circle cx="12" cy="12" r="3.2" fill="#10b981" stroke="none" />
          </svg>
        </div>

        <h1 className="text-4xl tracking-[0.3em] font-light text-zinc-50">CORTEX</h1>

        <p className="mt-4 text-[11px] text-zinc-500 tracking-widest text-center leading-relaxed uppercase">
          Cognitive Orchestration &amp; Reasoning Technology
          <br />
          for Executive Decision Intelligence
        </p>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        <p className="mt-6 text-[10px] text-emerald-600/80 tracking-[0.25em] uppercase">
          Enterprise Banking Operating System
        </p>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 text-[10px] text-zinc-700 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
        Booting secure session
      </div>
    </div>
  );
};

export default CortexSplash;