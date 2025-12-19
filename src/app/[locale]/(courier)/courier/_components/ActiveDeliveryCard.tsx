'use client';

import { useState, useEffect } from 'react';
import { Order } from '@prisma/client';
import { Button } from '@/shared/ui/button';
import { Phone, MapPin, Clock, CheckCircle, Navigation, CalendarClock } from 'lucide-react';
import { markDeliveredAction } from '@/features/order-management';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

interface ActiveDeliveryCardProps {
  order: Order;
}

// Parse order items from JSON
interface OrderItem {
  name: string;
  quantity: number;
}

function parseOrderItems(items: unknown): OrderItem[] {
  try {
    // items can be a JSON string or already parsed array
    const parsed = typeof items === 'string' ? JSON.parse(items) : items;
    if (Array.isArray(parsed)) {
      return parsed as OrderItem[];
    }
  } catch {
    // ignore parse errors
  }
  return [];
}

function getElapsedMinutes(date: Date | null): number {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function ActiveDeliveryCard({ order }: ActiveDeliveryCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const items = parseOrderItems(order.items);

  useEffect(() => {
    if (order.deliveryStartedAt) {
      setElapsedMinutes(getElapsedMinutes(order.deliveryStartedAt));
      const interval = setInterval(() => {
        setElapsedMinutes(getElapsedMinutes(order.deliveryStartedAt));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [order.deliveryStartedAt]);

  const handleMarkDelivered = async () => {
    if (!confirm(`Confirm delivery to ${order.fullName}?`)) return;

    setLoading(true);
    try {
      const result = await markDeliveredAction(order.id);
      if (result.success) {
        toast.success('Delivery completed!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to mark as delivered');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(order.address);
    // Try Google Maps first, fallback to Apple Maps on iOS
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:${order.phone}`;
  };

  const estimatedRemaining = order.deliveryEstimatedMinutes
    ? Math.max(0, order.deliveryEstimatedMinutes - elapsedMinutes)
    : 0;
 
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-md pz-overflow-hidden pz-border-2 pz-border-emerald-500">
      {/* Header */}
      <div className="pz-bg-emerald-500 pz-text-white pz-p-3 sm:pz-p-4">
        <div className="pz-flex pz-justify-between pz-items-center">
          <h3 className="pz-font-bold pz-text-lg sm:pz-text-xl">#{order.id}</h3>
          <div className="pz-flex pz-items-center pz-gap-1 pz-text-sm sm:pz-text-base">
            <Clock size={14} className="sm:pz-w-4 sm:pz-h-4" />
            <span>{formatTime(elapsedMinutes)}</span>
            {order.deliveryEstimatedMinutes && (
              <span className="pz-text-emerald-200 pz-text-xs sm:pz-text-sm">
                ({estimatedRemaining}m)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info - Most Important */}
      <div className="pz-p-3 sm:pz-p-4 pz-border-b pz-border-gray-100">
        <h4 className="pz-text-xl sm:pz-text-2xl pz-font-bold pz-mb-2">{order.fullName}</h4>

        {order.scheduledFor && (
          <div className="pz-flex pz-items-center pz-gap-2 pz-text-sm pz-text-purple-600 pz-font-medium pz-mb-3 pz-bg-purple-50 pz-p-2 pz-rounded-lg">
            <CalendarClock size={16} />
            <span>Scheduled: {formatScheduledTime(order.scheduledFor)}</span>
          </div>
        )}

        {/* Phone - Large and tappable */}
        <button
          onClick={handleCall}
          className="pz-flex pz-items-center pz-gap-2 sm:pz-gap-3 pz-w-full pz-p-2.5 sm:pz-p-3 pz-bg-blue-50 pz-rounded-lg pz-mb-2 sm:pz-mb-3 hover:pz-bg-blue-100 pz-transition"
        >
          <Phone className="pz-text-blue-600 pz-w-5 pz-h-5 sm:pz-w-6 sm:pz-h-6" />
          <span className="pz-text-lg sm:pz-text-xl pz-font-semibold pz-text-blue-600">{order.phone}</span>
        </button>

        {/* Address - Large and tappable */}
        <button
          onClick={handleOpenMaps}
          className="pz-flex pz-items-start pz-gap-2 sm:pz-gap-3 pz-w-full pz-p-2.5 sm:pz-p-3 pz-bg-green-50 pz-rounded-lg hover:pz-bg-green-100 pz-transition pz-text-left"
        >
          <MapPin className="pz-text-green-600 pz-mt-0.5 pz-w-5 pz-h-5 sm:pz-w-6 sm:pz-h-6" />
          <div>
            <span className="pz-text-base sm:pz-text-lg pz-font-semibold">{order.address}</span>
            <div className="pz-text-xs sm:pz-text-sm pz-text-green-600 pz-flex pz-items-center pz-gap-1 pz-mt-0.5 sm:pz-mt-1">
              <Navigation size={12} className="sm:pz-w-3.5 sm:pz-h-3.5" />
              Open in Maps
            </div>
          </div>
        </button>
      </div>

      {/* Order Notes */}
      {order.comment && (
        <div className="pz-px-3 sm:pz-px-4 pz-py-2 sm:pz-py-3 pz-bg-yellow-50 pz-border-b pz-border-gray-100 pz-text-sm sm:pz-text-base">
          <span className="pz-font-semibold">📝</span> {order.comment}
        </div>
      )}

      {/* Order Items Summary */}
      <div className="pz-p-3 sm:pz-p-4 pz-border-b pz-border-gray-100">
        <h5 className="pz-font-semibold pz-mb-1 sm:pz-mb-2 pz-text-sm sm:pz-text-base">Items ({items.length})</h5>
        <ul className="pz-text-xs sm:pz-text-sm pz-text-gray-600">
          {items.map((item, idx) => (
            <li key={idx}>
              {item.quantity}x {item.name}
            </li>
          ))}
        </ul>
        <div className="pz-mt-2 pz-text-base sm:pz-text-lg pz-font-bold">
          Total: {order.totalAmount} ₪
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pz-p-3 sm:pz-p-4 pz-space-y-2 sm:pz-space-y-3">
        <div className="pz-flex pz-gap-2 sm:pz-gap-3">
          <Button
            variant="outline"
            onClick={handleCall}
            className="pz-flex-1 pz-h-12 sm:pz-h-14"
          >
            <Phone size={18} className="pz-mr-1 sm:pz-mr-2" />
            Call
          </Button>
          <Button
            variant="outline"
            onClick={handleOpenMaps}
            className="pz-flex-1 pz-h-12 sm:pz-h-14"
          >
            <Navigation size={18} className="pz-mr-1 sm:pz-mr-2" />
            Navigate
          </Button>
        </div>
        <Button
          onClick={handleMarkDelivered}
          disabled={loading}
          className="pz-w-full pz-h-14 sm:pz-h-16 pz-text-base sm:pz-text-lg pz-bg-emerald-500 hover:pz-bg-emerald-600"
        >
          <CheckCircle size={22} className="pz-mr-2" />
          {loading ? 'Marking...' : 'Delivered'}
        </Button>
      </div>
    </div>
  );
}
