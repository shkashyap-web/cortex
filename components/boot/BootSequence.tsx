'use client';

import React, { useEffect, useState, useCallback } from 'react';
import CortexSplash from './CortexSplash';
import EnterpriseLogin from './EnterpriseLogin';
import InitializationScreen from './InitializationScreen';
import { useRBAC } from '@/hooks/useRBAC';
import type { Role } from '@/types';

type BootStage = 'checking' | 'splash' | 'login' | 'initializing' | 'ready';

const SESSION_KEY = 'cortex.session.v1';

export interface CortexSession {
  employeeId: string;
  employeeName: string;
  role: Role;
  branch: string;
  region: string;
  loggedInAt: number;
}

function readStoredSession(): CortexSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as CortexSession) : null;
  } catch {
    return null;
  }
}

export const BootSequence: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<CortexSession | null>(() => readStoredSession());
  const [stage, setStage] = useState<BootStage>(() => {
    if (typeof window === 'undefined') return 'checking';
    return readStoredSession() ? 'ready' : 'splash';
  });
  const { switchRole } = useRBAC();

  // Sync the restored session's role into the RBAC context on first client render.
  useEffect(() => {
    if (session && stage === 'ready') {
      switchRole(session.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSplashComplete = useCallback(() => {
    setStage('login');
  }, []);

  const handleLoginSuccess = useCallback((newSession: CortexSession) => {
    setSession(newSession);
    switchRole(newSession.role);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } catch {
      // ignore storage errors (private browsing, etc.)
    }
    setStage('initializing');
  }, [switchRole]);

  const handleInitializationComplete = useCallback(() => {
    setStage('ready');
  }, []);

  if (stage === 'checking') {
    return <div className="fixed inset-0 bg-zinc-950" />;
  }

  if (stage === 'splash') {
    return <CortexSplash onComplete={handleSplashComplete} />;
  }

  if (stage === 'login') {
    return <EnterpriseLogin onSuccess={handleLoginSuccess} />;
  }

  if (stage === 'initializing') {
    return <InitializationScreen onComplete={handleInitializationComplete} session={session} />;
  }

  return <>{children}</>;
};

export default BootSequence;
export { SESSION_KEY };