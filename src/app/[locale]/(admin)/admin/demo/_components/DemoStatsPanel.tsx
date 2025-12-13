'use client';

import React from 'react';

interface DemoStats {
  totalDemoOrders: number;
  totalDemoUsers: number;
  isEmergencyClosureDemo: boolean;
  emergencyClosureActive: boolean;
  ordersByScenario: Record<string, number>;
}

interface DemoStatsPanelProps {
  stats: DemoStats | null;
}

export function DemoStatsPanel({ stats }: DemoStatsPanelProps) {
  if (!stats) {
    return (
      <div className="pz-bg-gray-100 pz-rounded-lg pz-p-4">
        <p className="pz-text-gray-500">Loading demo statistics...</p>
      </div>
    );
  }

  const hasActiveDemo =
    stats.totalDemoOrders > 0 ||
    stats.totalDemoUsers > 0 ||
    stats.isEmergencyClosureDemo;

  return (
    <div
      className={`pz-rounded-lg pz-p-4 pz-border-2 ${
        hasActiveDemo
          ? 'pz-bg-purple-50 pz-border-purple-300'
          : 'pz-bg-gray-50 pz-border-gray-200'
      }`}
    >
      <h3 className="pz-font-semibold pz-mb-3">Active Demo Data</h3>

      <div className="pz-grid pz-grid-cols-3 pz-gap-4 pz-mb-4">
        <div className="pz-text-center">
          <div className="pz-text-2xl pz-font-bold pz-text-purple-600">
            {stats.totalDemoOrders}
          </div>
          <div className="pz-text-sm pz-text-gray-500">Demo Orders</div>
        </div>
        <div className="pz-text-center">
          <div className="pz-text-2xl pz-font-bold pz-text-purple-600">
            {stats.totalDemoUsers}
          </div>
          <div className="pz-text-sm pz-text-gray-500">Demo Users</div>
        </div>
        <div className="pz-text-center">
          <div
            className={`pz-text-2xl pz-font-bold ${
              stats.emergencyClosureActive ? 'pz-text-red-600' : 'pz-text-green-600'
            }`}
          >
            {stats.emergencyClosureActive ? 'ACTIVE' : 'OFF'}
          </div>
          <div className="pz-text-sm pz-text-gray-500">Emergency</div>
        </div>
      </div>

      {Object.keys(stats.ordersByScenario).length > 0 && (
        <div className="pz-border-t pz-border-gray-200 pz-pt-3">
          <h4 className="pz-text-sm pz-font-medium pz-text-gray-600 pz-mb-2">
            Orders by Scenario
          </h4>
          <div className="pz-flex pz-flex-wrap pz-gap-2">
            {Object.entries(stats.ordersByScenario).map(([scenario, count]) => (
              <span
                key={scenario}
                className="pz-px-2 pz-py-1 pz-bg-purple-100 pz-text-purple-800 pz-rounded pz-text-xs"
              >
                {scenario}: {count}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
