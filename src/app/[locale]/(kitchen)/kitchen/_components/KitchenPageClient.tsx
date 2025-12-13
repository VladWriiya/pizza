'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';
import { KitchenBoard } from './KitchenBoard';
import { KitchenStats } from './KitchenStats';
import { RefreshCw } from 'lucide-react';

interface KitchenPageClientProps {
  initialOrders: Order[];
  initialStats: {
    totalToday: number;
    activeOrders: number;
    completedToday: number;
  } | null;
}

const REFRESH_INTERVAL = 15000; // 15 seconds

export function KitchenPageClient({ initialOrders, initialStats }: KitchenPageClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh using router.refresh() for soft update
  const refresh = useCallback(() => {
    setIsRefreshing(true);
    router.refresh();
    setLastUpdate(new Date());
    // Reset refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 500);
  }, [router]);

  // Set up auto-refresh interval
  useEffect(() => {
    const interval = setInterval(refresh, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  // Group orders by status
  const newOrders = initialOrders.filter((o) => o.status === 'CONFIRMED');
  const preparingOrders = initialOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = initialOrders.filter((o) => o.status === 'READY');

  return (
    <div className="pz-space-y-6">
      {/* Refresh indicator */}
      <div className="pz-flex pz-justify-between pz-items-center">
        <p className="pz-text-sm pz-text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="pz-flex pz-items-center pz-gap-2 pz-text-sm pz-text-gray-500 hover:pz-text-gray-700 pz-transition disabled:pz-opacity-50"
        >
          <RefreshCw size={16} className={isRefreshing ? 'pz-animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {initialStats && <KitchenStats stats={initialStats} />}
      <KitchenBoard
        newOrders={newOrders}
        preparingOrders={preparingOrders}
        readyOrders={readyOrders}
      />
    </div>
  );
}
