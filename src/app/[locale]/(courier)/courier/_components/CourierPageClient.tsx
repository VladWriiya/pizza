'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@prisma/client';
import { CourierStats } from './CourierStats';
import { ActiveDeliveryCard } from './ActiveDeliveryCard';
import { AvailableOrderCard } from './AvailableOrderCard';
import { RefreshCw } from 'lucide-react';

interface CourierPageClientProps {
  initialActiveDeliveries: Order[];
  initialAvailableOrders: Order[];
  initialStats: {
    deliveriesToday: number;
    activeDeliveries: number;
  } | null;
}

const REFRESH_INTERVAL = 15000; // 15 seconds

export function CourierPageClient({
  initialActiveDeliveries,
  initialAvailableOrders,
  initialStats,
}: CourierPageClientProps) {
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

      {initialStats && <CourierStats stats={initialStats} />}

      {/* Active Deliveries Section */}
      <section>
        <h2 className="pz-text-xl pz-font-bold pz-mb-4 pz-flex pz-items-center pz-gap-2">
          🚗 My Active Deliveries
          <span className="pz-bg-emerald-100 pz-text-emerald-700 pz-px-2 pz-py-0.5 pz-rounded-full pz-text-sm">
            {initialActiveDeliveries.length}
          </span>
        </h2>
        {initialActiveDeliveries.length === 0 ? (
          <div className="pz-bg-white pz-rounded-xl pz-p-8 pz-text-center pz-text-gray-500">
            No active deliveries. Accept an order below to get started.
          </div>
        ) : (
          <div className="pz-space-y-4">
            {initialActiveDeliveries.map((order) => (
              <ActiveDeliveryCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>

      {/* Available Orders Section */}
      <section>
        <h2 className="pz-text-xl pz-font-bold pz-mb-4 pz-flex pz-items-center pz-gap-2">
          📦 Available Orders
          <span className="pz-bg-blue-100 pz-text-blue-700 pz-px-2 pz-py-0.5 pz-rounded-full pz-text-sm">
            {initialAvailableOrders.length}
          </span>
        </h2>
        {initialAvailableOrders.length === 0 ? (
          <div className="pz-bg-white pz-rounded-xl pz-p-8 pz-text-center pz-text-gray-500">
            No orders available for delivery at the moment.
          </div>
        ) : (
          <div className="pz-space-y-3">
            {initialAvailableOrders.map((order) => (
              <AvailableOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
