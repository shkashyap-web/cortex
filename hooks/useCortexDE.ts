'use client';

import { useState } from 'react';
import { DecisionRequest, DecisionResult } from '@/types';
import { decisionEngineService } from '@/services/cortex-de/DecisionEngine';

export function useCortexDE() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const evaluateDecision = async (request: Omit<DecisionRequest, 'id' | 'correlationId'>) => {
    setIsEvaluating(true);
    setError(null);

    const fullRequest: DecisionRequest = {
      ...request,
      id: `REQ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      correlationId: `CORR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    };

    try {
      const evaluationResult = await decisionEngineService.evaluateDecision(fullRequest);
      setResult(evaluationResult);
      return evaluationResult;
    } catch (err: any) {
      const message = err.message || 'Error occurred during decision pipeline evaluation';
      setError(message);
      throw err;
    } finally {
      setIsEvaluating(false);
    }
  };

  return {
    evaluateDecision,
    isEvaluating,
    result,
    error,
    clearResult: () => setResult(null)
  };
}
