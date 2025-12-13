import { prisma } from '../../prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
import { Clock } from 'lucide-react';
import { autoActivateEmergencyClosureAction } from '@/features/system-settings';

const ACTIVE_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.DELIVERING,
];

const WARNING_THRESHOLD = 50;
const CRITICAL_THRESHOLD = 100;

export async function HighLoadBanner() {
  const activeOrdersCount = await prisma.order.count({
    where: { status: { in: ACTIVE_STATUSES } },
  });

  if (activeOrdersCount < WARNING_THRESHOLD) {
    return null;
  }

  // Check if any are demo orders to show demo badge
  const demoCount = await prisma.order.count({
    where: { status: { in: ACTIVE_STATUSES }, isDemo: true },
  });
  const isDemo = demoCount > 0;

  // Auto-pause at critical load (100+ orders)
  if (activeOrdersCount >= CRITICAL_THRESHOLD) {
    await autoActivateEmergencyClosureAction({
      reason: isDemo ? 'DEMO: Critical Load' : 'Critical Load',
      message: 'Order intake automatically paused due to extremely high demand.',
      until: new Date(Date.now() + 15 * 60 * 1000), // 15 min auto-pause
    });
    // EmergencyBanner will show instead, but we still show high load info
  }

  return (
    <div className={`pz-text-white pz-py-3 pz-px-4 ${isDemo ? 'pz-bg-orange-500' : 'pz-bg-orange-600'}`}>
      <div className="pz-container pz-mx-auto pz-flex pz-items-center pz-justify-center pz-gap-3 pz-text-center">
        <Clock className="pz-w-5 pz-h-5 pz-flex-shrink-0 pz-animate-pulse" />
        <div>
          {isDemo && (
            <span className="pz-px-2 pz-py-0.5 pz-bg-white pz-text-orange-800 pz-rounded pz-text-xs pz-font-bold pz-me-2">
              DEMO
            </span>
          )}
          <span className="pz-font-semibold">High Demand</span>
          <span className="pz-mx-2">—</span>
          <span>We&apos;re experiencing high order volume. Delivery times may be longer than usual.</span>
          <span className="pz-ms-2 pz-opacity-90">({activeOrdersCount} active orders)</span>
        </div>
      </div>
    </div>
  );
}
