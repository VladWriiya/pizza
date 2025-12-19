'use client';

import { Clock } from 'lucide-react';

interface OrderHeaderProps {
  orderId: number;
  elapsedMinutes: number;
  prepEstimatedMinutes?: number | null;
  status: 'new' | 'preparing' | 'ready';
  isUrgent: boolean;
}

function formatElapsedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

export function OrderHeader({ orderId, elapsedMinutes, prepEstimatedMinutes, status, isUrgent }: OrderHeaderProps) {
  return (
    <div className="pz-p-4 pz-border-b pz-border-gray-100">
      <div className="pz-flex pz-justify-between pz-items-start">
        <div>
          <h3 className="pz-font-bold pz-text-lg">Order #{orderId}</h3>
          <div className="pz-flex pz-items-center pz-gap-1 pz-text-sm pz-text-gray-500 pz-mt-1">
            <Clock size={14} />
            <span>{formatElapsedTime(elapsedMinutes)} ago</span>
            {status === 'preparing' && prepEstimatedMinutes && (
              <span className="pz-ml-2 pz-text-orange-600">
                (Est. {prepEstimatedMinutes}m)
              </span>
            )}
          </div>
        </div>
        {isUrgent && (
          <span className="pz-bg-red-100 pz-text-red-700 pz-px-2 pz-py-1 pz-rounded pz-text-xs pz-font-semibold">
            URGENT
          </span>
        )}
      </div>
    </div>
  );
}
