'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { useCortexDE } from '@/hooks/useCortexDE';
import { useRBAC } from '@/hooks/useRBAC';
import { MOCK_CUSTOMERS } from '@/data/customers';
import { Brain, PlayCircle, CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DecisionIntelligencePage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/decision-intelligence');
  const { context } = useRBAC();
  const { evaluateDecision, isEvaluating, result, error } = useCortexDE();
  const [selectedEntityId, setSelectedEntityId] = useState('CUST-001');
  const [decisionType, setDecisionType] = useState('LOAN_APPROVAL');
  const [showTrace, setShowTrace] = useState(false);

  if (!wsConfig) return <div>Workspace config not found.</div>;

  const decisionTypes = ['LOAN_APPROVAL', 'FRAUD_CHECK', 'PORTFOLIO_OPTIMIZE', 'MSME_CASHFLOW'];

  const handleEvaluate = async () => {
    await evaluateDecision({
      decisionType,
      entityType: 'Customer',
      entityId: selectedEntityId,
      context: { initiatedFrom: 'decision-intelligence-workspace' },
      initiatorId: context.userId,
    });
  };

  const statusConfig: Record<string, { icon: React.ReactNode; color: string }> = {
    APPROVED: { icon: <CheckCircle2 size={14} />, color: 'text-emerald-400' },
    REJECTED: { icon: <XCircle size={14} />, color: 'text-red-400' },
    MANUAL_REVIEW: { icon: <AlertTriangle size={14} />, color: 'text-amber-400' },
    FLAGGED: { icon: <AlertTriangle size={14} />, color: 'text-orange-400' },
    COMPLETED: { icon: <CheckCircle2 size={14} />, color: 'text-sky-400' },
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Left: Decision Request Builder */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950 rounded p-5 space-y-5">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center gap-2">
            <Brain size={12} className="text-emerald-500" />
            Pipeline Evaluation
          </h2>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Decision Type</label>
              <select
                value={decisionType}
                onChange={e => setDecisionType(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                {decisionTypes.map(dt => (
                  <option key={dt} value={dt}>{dt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Entity Subject</label>
              <select
                value={selectedEntityId}
                onChange={e => setSelectedEntityId(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-zinc-700"
              >
                {MOCK_CUSTOMERS.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                ))}
              </select>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-900 rounded p-3 text-[10px] space-y-1 text-zinc-500">
              <div className="flex justify-between"><span>Initiator:</span><span className="text-zinc-400">{context.userId}</span></div>
              <div className="flex justify-between"><span>Active Role:</span><span className="text-emerald-500">{context.role}</span></div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={isEvaluating}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900/40 border border-emerald-800 hover:bg-emerald-900/60 text-emerald-400 rounded text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlayCircle size={14} />
              {isEvaluating ? 'Pipeline Running...' : 'Evaluate Decision'}
            </button>

            {error && (
              <div className="border border-red-900 bg-red-950/20 rounded p-3 text-[10px] text-red-400">
                Error: {error}
              </div>
            )}
          </div>
        </div>

        {/* Right: Result Panel */}
        <div className="lg:col-span-2 space-y-5">
          {isEvaluating && (
            <div className="border border-zinc-800 bg-zinc-950 rounded p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-zinc-300">CORTEX Decision Pipeline Running</p>
                <p className="text-[10px] text-zinc-500">Memory Engine → Knowledge Graph → Digital Twin → Agent Selection → Reasoning...</p>
              </div>
            </div>
          )}

          {result && !isEvaluating && (
            <>
              {/* Result Summary */}
              <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-300">Decision Result</h3>
                    <p className="text-[10px] text-zinc-500">{result.decisionId}</p>
                  </div>
                  <div className={`flex items-center gap-1.5 font-bold text-sm ${statusConfig[result.status]?.color || 'text-zinc-400'}`}>
                    {statusConfig[result.status]?.icon}
                    {result.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900/50 border border-zinc-900 p-3 rounded">
                    <p className="text-zinc-500 text-[10px]">Confidence Score</p>
                    <p className="text-lg font-bold text-zinc-200 mt-0.5">{(result.confidenceScore * 100).toFixed(0)}%</p>
                  </div>
                  <div className="bg-zinc-900/50 border border-zinc-900 p-3 rounded">
                    <p className="text-zinc-500 text-[10px]">Evaluated At</p>
                    <p className="text-xs font-bold text-zinc-300 mt-0.5">{new Date(result.evaluatedAt).toLocaleTimeString()}</p>
                  </div>
                </div>

                {/* Primary Recommendation */}
                {result.recommendations[0] && (
                  <div className="border border-emerald-900/50 bg-emerald-950/10 p-4 rounded space-y-1.5">
                    <p className="text-[9px] text-emerald-500 uppercase tracking-wider">Primary Recommendation</p>
                    <h4 className="text-xs font-bold text-zinc-200">{result.recommendations[0].title}</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">{result.recommendations[0].description}</p>
                    {result.recommendations[0].impactMetric && (
                      <p className="text-[10px] text-emerald-500">Impact: {result.recommendations[0].impactMetric}</p>
                    )}
                  </div>
                )}

                {/* Rationale */}
                <div className="border border-zinc-900 bg-zinc-900/30 p-4 rounded space-y-1">
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Primary Rationale</p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{result.explanation.primaryRationale}</p>
                </div>

                {/* Evidence */}
                {result.explanation.evidence.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] text-zinc-500 uppercase tracking-wider">Decision Evidence</p>
                    {result.explanation.evidence.map((ev, i) => (
                      <div key={i} className="text-[10px] bg-zinc-900/40 border border-zinc-900 p-2.5 rounded flex items-start gap-2">
                        <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded text-[9px] flex-shrink-0">{ev.sourceType}</span>
                        <span className="text-zinc-400 leading-relaxed">{ev.description}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reasoning Trace Toggle */}
                <button
                  onClick={() => setShowTrace(!showTrace)}
                  className="flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-400 transition-colors"
                >
                  {showTrace ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  {showTrace ? 'Hide' : 'Show'} Reasoning Trace ({result.explanation.reasoningTrace.steps.length} steps)
                </button>

                {showTrace && (
                  <div className="space-y-2 border-t border-zinc-900 pt-3">
                    {result.explanation.reasoningTrace.steps.map((step, i) => (
                      <div key={i} className="flex gap-3 text-[10px]">
                        <div className="flex-shrink-0 w-5 h-5 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-600 text-[9px]">
                          {i + 1}
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-zinc-500 leading-relaxed">{step.thought}</p>
                          <p className="text-zinc-400 leading-relaxed">{step.observation}</p>
                          {step.agentId && <p className="text-indigo-500">Agent: {step.agentId}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Alternatives */}
              {result.explanation.alternatives.length > 0 && (
                <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3">
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2">
                    Alternative Recommendations ({result.explanation.alternatives.length})
                  </h3>
                  {result.explanation.alternatives.map((alt, i) => (
                    <div key={i} className="border border-zinc-900 bg-zinc-900/30 p-4 rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-zinc-300">{alt.recommendation.title}</h4>
                        <span className="text-[10px] text-zinc-500">Confidence: {(alt.recommendation.confidenceScore * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-[10px] text-zinc-500">{alt.recommendation.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {alt.tradeoffs.map((t, j) => (
                          <span key={j} className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded text-[9px]">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!result && !isEvaluating && (
            <div className="border border-zinc-800 bg-zinc-950 rounded p-10 flex flex-col items-center gap-3 text-center">
              <Brain size={32} className="text-zinc-700" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400">No Decision Evaluated</p>
                <p className="text-[10px] text-zinc-600">
                  Configure a decision request on the left panel and click Evaluate Decision to run the full CORTEX pipeline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
