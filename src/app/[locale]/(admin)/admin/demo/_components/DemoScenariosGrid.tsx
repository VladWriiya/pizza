'use client';

import React from 'react';
import { DemoScenarioCard } from './DemoScenarioCard';

interface DemoScenariosGridProps {
  loading: string | null;
  actions: {
    largeCatering: () => Promise<void>;
    emergency: () => Promise<void>;
    noCouriers: () => Promise<void>;
    viral: () => Promise<void>;
  };
}

export function DemoScenariosGrid({ loading, actions }: DemoScenariosGridProps) {
  return (
    <div className="pz-grid pz-grid-cols-1 lg:pz-grid-cols-2 pz-gap-6">
      <DemoScenarioCard
        icon="🍕"
        title="1. Large Catering Order (50 pizzas)"
        description="Creates a massive order with 50 items that requires manual approval."
        buttonText="Simulate Large Order"
        variant="default"
        isLoading={loading === 'large-catering'}
        onActivate={actions.largeCatering}
      />

      <DemoScenarioCard
        icon="🚨"
        title="2. Emergency Closure"
        description="Activates emergency closure mode. Auto-expires in 5 minutes."
        buttonText="Activate Emergency"
        variant="danger"
        isLoading={loading === 'emergency'}
        onActivate={actions.emergency}
      />

      <DemoScenarioCard
        icon="🛵"
        title="3. No Couriers Available"
        description="Creates 3 orders stuck in READY status without courier assignment."
        buttonText="Simulate No Couriers"
        variant="warning"
        isLoading={loading === 'no-couriers'}
        onActivate={actions.noCouriers}
      />

      <DemoScenarioCard
        icon="📈"
        title="4. Viral Load (100 orders)"
        description="Creates 100 orders simultaneously to simulate viral marketing."
        buttonText="Simulate Viral Load"
        variant="danger"
        isLoading={loading === 'viral'}
        onActivate={actions.viral}
      />
    </div>
  );
}
