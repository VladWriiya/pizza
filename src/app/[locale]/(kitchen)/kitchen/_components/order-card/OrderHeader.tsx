'use client';

import { Clock, CalendarClock } from 'lucide-react';

interface OrderHeaderProps {
  orderId: number;
  elapsedMinutes: number;
  prepEstimatedMinutes?: number | null;
  scheduledFor?: Date | null;
  status: 'new' | 'preparing' | 'ready';
  isUrgent: boolean;
}

function formatElapsedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

function formatScheduledTime(date: Date): string {
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  if (isToday) return `Today ${hours}:${mins}`;
  if (isTomorrow) return `Tomorrow ${hours}:${mins}`;
  return `${d.getDate()}/${d.getMonth() + 1} ${hours}:${mins}`;
}

export function OrderHeader({ orderId, elapsedMinutes, prepEstimatedMinutes, scheduledFor, status, isUrgent }: OrderHeaderProps) {
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
          {scheduledFor && (
            <div className="pz-flex pz-items-center pz-gap-1 pz-text-sm pz-mt-1 pz-text-purple-600 pz-font-medium">
              <CalendarClock size={14} />
              <span>Scheduled: {formatScheduledTime(scheduledFor)}</span>
            </div>
          )}
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
