'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';
import { Link } from '@/i18n/navigation';

interface WaitingOrder {
  id: number;
  fullName: string;
  address: string;
  waitingMinutes: number;
}

interface Props {
  waitingOrders: WaitingOrder[];
  soundEnabled: boolean;
}

export function NoCourierUrgentBanner({ waitingOrders, soundEnabled }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasPlayedRef = useRef(false);

  // Play urgent sound when orders appear
  useEffect(() => {
    if (waitingOrders.length > 0 && soundEnabled && !hasPlayedRef.current) {
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/alert.mp3');
        audioRef.current.volume = 0.8; // Louder for urgent
      }
      // Play twice for urgency
      audioRef.current.play().catch(() => {});
      setTimeout(() => {
        audioRef.current?.play().catch(() => {});
      }, 1000);
      hasPlayedRef.current = true;
    }

    // Reset when orders are cleared
    if (waitingOrders.length === 0) {
      hasPlayedRef.current = false;
    }
  }, [waitingOrders.length, soundEnabled]);

  if (waitingOrders.length === 0) {
    return null;
  }

  const maxWaitingMinutes = Math.max(...waitingOrders.map(o => o.waitingMinutes));
  const isCritical = maxWaitingMinutes >= 15;

  return (
    <div
      className={`pz-rounded-xl pz-p-4 pz-mb-6 pz-border-2 ${
        isCritical
          ? 'pz-bg-red-50 pz-border-red-500 pz-animate-pulse'
          : 'pz-bg-orange-50 pz-border-orange-500'
      }`}
    >
      <div className="pz-flex pz-items-start pz-gap-3">
        <div className={`pz-p-2 pz-rounded-lg pz-shrink-0 ${isCritical ? 'pz-bg-red-500' : 'pz-bg-orange-500'}`}>
          <AlertTriangle className="pz-w-6 pz-h-6 pz-text-white" />
        </div>

        <div className="pz-flex-1">
          <div className="pz-flex pz-items-center pz-gap-2">
            <h3 className={`pz-font-bold pz-text-lg ${isCritical ? 'pz-text-red-800' : 'pz-text-orange-800'}`}>
              {isCritical ? 'CRITICAL: ' : ''}No Courier Available!
            </h3>
            <span className={`pz-px-2 pz-py-0.5 pz-rounded-full pz-text-sm pz-font-bold ${
              isCritical ? 'pz-bg-red-200 pz-text-red-800' : 'pz-bg-orange-200 pz-text-orange-800'
            }`}>
              {waitingOrders.length} {waitingOrders.length === 1 ? 'order' : 'orders'}
            </span>
          </div>

          <p className={`pz-text-sm pz-mt-1 ${isCritical ? 'pz-text-red-700' : 'pz-text-orange-700'}`}>
            {isCritical
              ? `Orders waiting ${maxWaitingMinutes}+ min! Customers expecting delivery NOW.`
              : 'Orders are ready but no courier is assigned. Action required.'}
          </p>

          {/* Order list */}
          <div className="pz-mt-3 pz-space-y-2">
            {waitingOrders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className={`pz-flex pz-items-center pz-justify-between pz-p-2 pz-rounded-lg pz-transition-colors ${
                  isCritical
                    ? 'pz-bg-red-100 hover:pz-bg-red-200'
                    : 'pz-bg-orange-100 hover:pz-bg-orange-200'
                }`}
              >
                <div className="pz-flex pz-items-center pz-gap-3">
                  <span className="pz-font-mono pz-font-bold">#{order.id}</span>
                  <span className="pz-text-sm">{order.fullName}</span>
                </div>
                <div className="pz-flex pz-items-center pz-gap-4 pz-text-sm">
                  <span className="pz-flex pz-items-center pz-gap-1 pz-opacity-75">
                    <MapPin className="pz-w-3 pz-h-3" />
                    {order.address.substring(0, 20)}...
                  </span>
                  <span className={`pz-flex pz-items-center pz-gap-1 pz-font-bold ${
                    order.waitingMinutes >= 15 ? 'pz-text-red-700' : 'pz-text-orange-700'
                  }`}>
                    <Clock className="pz-w-3 pz-h-3" />
                    {order.waitingMinutes} min
                  </span>
                </div>
              </Link>
            ))}
            {waitingOrders.length > 3 && (
              <p className="pz-text-sm pz-text-center pz-opacity-75">
                +{waitingOrders.length - 3} more orders waiting
              </p>
            )}
          </div>

          {/* Action button */}
          <div className="pz-mt-4">
            <Link
              href="/admin/orders?status=READY"
              className={`pz-inline-flex pz-items-center pz-gap-2 pz-px-4 pz-py-2 pz-rounded-lg pz-font-medium pz-transition-colors ${
                isCritical
                  ? 'pz-bg-red-600 pz-text-white hover:pz-bg-red-700'
                  : 'pz-bg-orange-600 pz-text-white hover:pz-bg-orange-700'
              }`}
            >
              View All Ready Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
