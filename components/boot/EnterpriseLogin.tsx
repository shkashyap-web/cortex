'use client';

import React, { useState } from 'react';
import { Lock, User, Building2, MapPin, ShieldCheck, ChevronDown, Fingerprint } from 'lucide-react';
import type { Role } from '@/types';
import type { CortexSession } from './BootSequence';

const ROLES: Role[] = [
  'Executive',
  'Regional Manager',
  'Branch Manager',
  'Relationship Manager',
  'Loan Officer',
  'Risk Analyst',
  'Compliance Officer',
  'System Administrator',
  'Customer',
];

const BRANCHES = [
  'Mumbai BKC HQ (BR-MUMBAI-01)',
  'Delhi Connaught Place (BR-DELHI-02)',
  'Ahmedabad CG Road MSME (BR-AHMEDABAD-03)',
];

const REGIONS = ['West', 'North', 'South', 'East', 'North-East'];

const ROLE_NAME_HINTS: Record<Role, string> = {
  Executive: 'S. Das',
  'Regional Manager': 'A. Krishnan',
  'Branch Manager': 'R. Mehta',
  'Relationship Manager': 'P. Nair',
  'Loan Officer': 'V. Sharma',
  'Risk Analyst': 'N. Kapoor',
  'Compliance Officer': 'M. Iyer',
  'System Administrator': 'root.admin',
  Customer: 'Guest User',
};

export const EnterpriseLogin: React.FC<{ onSuccess: (s: CortexSession) => void }> = ({ onSuccess }) => {
  const [employeeId, setEmployeeId] = useState('IDBI-EMP-0421');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [region, setRegion] = useState(REGIONS[0]);
  const [role, setRole] = useState<Role>('Executive');
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!employeeId.trim()) {
      setError('Employee ID is required.');
      return;
    }
    if (!password.trim()) {
      setError('Password is required.');
      return;
    }

    setSubmitting(true);
    // Simulate a secure authentication handshake.
    setTimeout(() => {
      onSuccess({
        employeeId,
        employeeName: ROLE_NAME_HINTS[role],
        role,
        branch,
        region,
        loggedInAt: Date.now(),
      });
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center font-mono overflow-y-auto py-10">
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #52525b 1px, transparent 1px), linear-gradient(to bottom, #52525b 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-md mx-4 animate-cortex-fade-in">
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-11 h-11 rounded-xl border border-emerald-900/60 bg-emerald-950/20 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#10b981" strokeWidth="1.5">
              <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z" />
              <circle cx="12" cy="12" r="3.2" fill="#10b981" stroke="none" />
            </svg>
          </div>
          <h1 className="text-lg tracking-[0.25em] text-zinc-100 font-light">CORTEX</h1>
          <p className="text-[10px] text-zinc-600 tracking-widest uppercase mt-1">Enterprise Secure Access</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-7 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <div className="space-y-4">
            <Field label="Employee ID" icon={<User size={13} />}>
              <input
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="IDBI-EMP-XXXX"
                className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                autoComplete="username"
              />
            </Field>

            <Field label="Password" icon={<Lock size={13} />}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                autoComplete="current-password"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <SelectField label="Branch" icon={<Building2 size={13} />} value={branch} onChange={setBranch} options={BRANCHES} short />
              <SelectField label="Region" icon={<MapPin size={13} />} value={region} onChange={setRegion} options={REGIONS} />
            </div>

            <SelectField
              label="Role"
              icon={<ShieldCheck size={13} />}
              value={role}
              onChange={(v) => setRole(v as Role)}
              options={ROLES}
            />

            <label className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-emerald-600 w-3 h-3"
              />
              Remember this device
            </label>

            {error && (
              <div className="text-[11px] text-red-400 bg-red-950/20 border border-red-950 rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold tracking-wide py-2.5 rounded-lg transition-colors mt-2"
            >
              {submitting ? (
                <>
                  <Fingerprint size={13} className="animate-pulse" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Lock size={12} />
                  Secure Login
                </>
              )}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
                onClick={() => setError('Password reset requires branch administrator approval in this environment.')}
              >
                Forgot Password?
              </button>
              <span className="text-[10px] text-zinc-700">v3.1 · TLS 1.3</span>
            </div>
          </div>
        </form>

        <p className="text-center text-[10px] text-zinc-700 mt-5 tracking-wide">
          Unauthorized access is prohibited and monitored. IDBI Bank Enterprise Systems.
        </p>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  label,
  icon,
  children,
}) => (
  <div>
    <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">{label}</label>
    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 focus-within:border-emerald-800 rounded-lg px-3 py-2.5 transition-colors">
      <span className="text-zinc-600">{icon}</span>
      {children}
    </div>
  </div>
);

const SelectField: React.FC<{
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  short?: boolean;
}> = ({ label, icon, value, onChange, options, short }) => (
  <div>
    <label className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 block">{label}</label>
    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 focus-within:border-emerald-800 rounded-lg px-3 py-2.5 transition-colors">
      <span className="text-zinc-600 shrink-0">{icon}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-xs text-zinc-200 outline-none appearance-none cursor-pointer truncate"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-zinc-900 text-zinc-200">
            {short ? o.split(' (')[0] : o}
          </option>
        ))}
      </select>
      <ChevronDown size={11} className="text-zinc-600 shrink-0" />
    </div>
  </div>
);

export default EnterpriseLogin;