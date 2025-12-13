'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  simulateLargeCateringOrderAction,
  simulateEmergencyClosureAction,
  simulateNoCouriersAction,
  simulateViralLoadAction,
  resetAllDemoDataAction,
  getDemoStatsAction,
} from '@/features/demo-mode';

export interface DemoStats {
  totalDemoOrders: number;
  totalDemoUsers: number;
  isEmergencyClosureDemo: boolean;
  emergencyClosureActive: boolean;
  ordersByScenario: Record<string, number>;
}

export interface ActionResult {
  type: 'success' | 'error';
  message: string;
}

type ActionFn = () => Promise<{ success: boolean; message?: string; error?: string }>;

export function useDemoPanel() {
  const [loading, setLoading] = useState<string | null>(null);
  const [stats, setStats] = useState<DemoStats | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);

  const refreshStats = useCallback(async () => {
    const response = await getDemoStatsAction();
    if (response.success && response.stats) {
      setStats(response.stats);
    }
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const handleAction = useCallback(
    async (actionName: string, action: ActionFn) => {
      setLoading(actionName);
      setResult(null);

      try {
        const response = await action();
        if (response.success) {
          setResult({ type: 'success', message: response.message || 'Action completed' });
        } else {
          setResult({ type: 'error', message: response.error || 'Action failed' });
        }
        await refreshStats();
      } catch {
        setResult({ type: 'error', message: 'An unexpected error occurred' });
      } finally {
        setLoading(null);
      }
    },
    [refreshStats]
  );

  const clearResult = useCallback(() => setResult(null), []);

  const actions = {
    largeCatering: () => handleAction('large-catering', simulateLargeCateringOrderAction),
    emergency: () => handleAction('emergency', simulateEmergencyClosureAction),
    noCouriers: () => handleAction('no-couriers', simulateNoCouriersAction),
    viral: () => handleAction('viral', simulateViralLoadAction),
    reset: () => handleAction('reset', resetAllDemoDataAction),
  };

  return {
    loading,
    stats,
    result,
    clearResult,
    actions,
  };
}
