'use client';

import { OrderStatus } from '@prisma/client';
import { Check, Clock, ChefHat, Package, Truck, PartyPopper } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderStatusTimelineProps {
  status: OrderStatus;
  prepStartedAt?: Date | null;
  prepEstimatedMinutes?: number | null;
  deliveryStartedAt?: Date | null;
  deliveryEstimatedMinutes?: number | null;
}

interface TimelineStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  statuses: OrderStatus[];
}

const steps: TimelineStep[] = [
  {
    id: 'confirmed',
    label: 'Order Confirmed',
    icon: <Check size={20} />,
    statuses: ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED'],
  },
  {
    id: 'preparing',
    label: 'Preparing',
    icon: <ChefHat size={20} />,
    statuses: ['PREPARING', 'READY', 'DELIVERING', 'DELIVERED'],
  },
  {
    id: 'ready',
    label: 'Ready',
    icon: <Package size={20} />,
    statuses: ['READY', 'DELIVERING', 'DELIVERED'],
  },
  {
    id: 'delivering',
    label: 'On the Way',
    icon: <Truck size={20} />,
    statuses: ['DELIVERING', 'DELIVERED'],
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: <PartyPopper size={20} />,
    statuses: ['DELIVERED'],
  },
];

function getElapsedMinutes(date: Date | null | undefined): number {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

function getRemainingMinutes(startedAt: Date | null | undefined, estimatedMinutes: number | null | undefined): number {
  if (!startedAt || !estimatedMinutes) return 0;
  const elapsed = getElapsedMinutes(startedAt);
  return Math.max(0, estimatedMinutes - elapsed);
}

export function OrderStatusTimeline({
  status,
  prepStartedAt,
  prepEstimatedMinutes,
  deliveryStartedAt,
  deliveryEstimatedMinutes,
}: OrderStatusTimelineProps) {
  const isCancelled = status === 'CANCELLED';
  const isPending = status === 'PENDING';

  if (isCancelled) {
    return (
      <div className="pz-text-center pz-py-8">
        <div className="pz-w-16 pz-h-16 pz-bg-red-100 pz-rounded-full pz-flex pz-items-center pz-justify-center pz-mx-auto pz-mb-4">
          <span className="pz-text-3xl">❌</span>
        </div>
        <p className="pz-text-xl pz-font-semibold pz-text-red-600">Order Cancelled</p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="pz-text-center pz-py-8">
        <div className="pz-w-16 pz-h-16 pz-bg-yellow-100 pz-rounded-full pz-flex pz-items-center pz-justify-center pz-mx-auto pz-mb-4 pz-animate-pulse">
          <Clock size={32} className="pz-text-yellow-600" />
        </div>
        <p className="pz-text-xl pz-font-semibold pz-text-yellow-600">Processing Payment...</p>
      </div>
    );
  }

  // Calculate time estimates for display
  const prepRemaining = getRemainingMinutes(prepStartedAt, prepEstimatedMinutes);
  const deliveryRemaining = getRemainingMinutes(deliveryStartedAt, deliveryEstimatedMinutes);

  return (
    <div className="pz-relative">
      {/* Mobile: Vertical timeline */}
      <div className="pz-flex pz-flex-col pz-space-y-4 md:pz-hidden">
        {steps.map((step) => {
          const isCurrent = step.statuses[0] === status;
          const isPast = step.statuses.includes(status);

          return (
            <div key={step.id} className="pz-flex pz-items-start pz-gap-4">
              <div
                className={cn(
                  'pz-w-10 pz-h-10 pz-rounded-full pz-flex pz-items-center pz-justify-center pz-flex-shrink-0',
                  isPast
                    ? 'pz-bg-green-500 pz-text-white'
                    : 'pz-bg-gray-200 pz-text-gray-400'
                )}
              >
                {isPast ? <Check size={20} /> : step.icon}
              </div>
              <div className="pz-flex-1">
                <p
                  className={cn(
                    'pz-font-semibold',
                    isPast ? 'pz-text-gray-900' : 'pz-text-gray-400'
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && step.id === 'preparing' && prepEstimatedMinutes && (
                  <p className="pz-text-sm pz-text-orange-600">
                    ~{prepRemaining} minutes remaining
                  </p>
                )}
                {isCurrent && step.id === 'delivering' && deliveryEstimatedMinutes && (
                  <p className="pz-text-sm pz-text-blue-600">
                    ~{deliveryRemaining} minutes remaining
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: Horizontal timeline */}
      <div className="pz-hidden md:pz-block">
        <div className="pz-flex pz-justify-between pz-items-center">
          {steps.map((step, index) => {
            const isCurrent = step.statuses[0] === status;
            const isPast = step.statuses.includes(status);

            return (
              <div key={step.id} className="pz-flex pz-flex-col pz-items-center pz-relative pz-flex-1">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={cn(
                      'pz-absolute pz-top-5 pz-right-1/2 pz-w-full pz-h-1 -pz-translate-y-1/2',
                      isPast ? 'pz-bg-green-500' : 'pz-bg-gray-200'
                    )}
                  />
                )}

                {/* Circle */}
                <div
                  className={cn(
                    'pz-relative pz-z-10 pz-w-10 pz-h-10 pz-rounded-full pz-flex pz-items-center pz-justify-center pz-transition-all',
                    isCurrent && 'pz-ring-4 pz-ring-green-200 pz-animate-pulse',
                    isPast
                      ? 'pz-bg-green-500 pz-text-white'
                      : 'pz-bg-gray-200 pz-text-gray-400'
                  )}
                >
                  {isPast ? <Check size={20} /> : step.icon}
                </div>

                {/* Label */}
                <p
                  className={cn(
                    'pz-mt-2 pz-text-sm pz-font-medium pz-text-center',
                    isPast ? 'pz-text-gray-900' : 'pz-text-gray-400'
                  )}
                >
                  {step.label}
                </p>

                {/* Time estimate */}
                {isCurrent && step.id === 'preparing' && prepEstimatedMinutes && (
                  <p className="pz-text-xs pz-text-orange-600 pz-mt-1">
                    ~{prepRemaining}m left
                  </p>
                )}
                {isCurrent && step.id === 'delivering' && deliveryEstimatedMinutes && (
                  <p className="pz-text-xs pz-text-blue-600 pz-mt-1">
                    ~{deliveryRemaining}m left
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
