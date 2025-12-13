'use client';

import React from 'react';
import { DemoResultBanner } from './DemoResultBanner';
import { DemoStatsPanel } from './DemoStatsPanel';
import { DemoScenariosGrid } from './DemoScenariosGrid';
import { DemoInfoBox } from './DemoInfoBox';
import { useDemoPanel } from '../_hooks/useDemoPanel';

export function DemoPanelClient() {
  const { loading, stats, result, clearResult, actions } = useDemoPanel();

  return (
    <div className="pz-space-y-6">
      <DemoResultBanner result={result} onClear={clearResult} />

      <DemoStatsPanel stats={stats} />

      <div className="pz-flex pz-justify-end">
        <button
          onClick={actions.reset}
          disabled={loading !== null}
          className="pz-px-6 pz-py-3 pz-bg-gray-800 pz-text-white pz-rounded-lg pz-font-semibold hover:pz-bg-gray-900 disabled:pz-opacity-50 disabled:pz-cursor-not-allowed pz-transition-colors"
        >
          {loading === 'reset' ? 'Cleaning up...' : 'Reset All Demo Data'}
        </button>
      </div>

      <DemoScenariosGrid loading={loading} actions={actions} />

      <DemoInfoBox />
    </div>
  );
}
