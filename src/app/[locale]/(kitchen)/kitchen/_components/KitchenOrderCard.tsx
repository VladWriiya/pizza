'use client';

import { useState, useEffect } from 'react';
import { Order } from '@prisma/client';
import { Button } from '@/shared/ui/button';
import { Clock, ChefHat, Check, Phone, User, MapPin } from 'lucide-react';
import { startPreparingOrderAction, markOrderReadyAction, updatePrepTimeAction } from '@/features/order-management';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface KitchenOrderCardProps {
  order: Order;
  status: 'new' | 'preparing' | 'ready';
}

// Parse order items from JSON
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  details?: string;
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

// Calculate time elapsed since a date
function getElapsedMinutes(date: Date | null): number {
  if (!date) return 0;
  return Math.floor((Date.now() - new Date(date).getTime()) / 60000);
}

// Format elapsed time as "Xm" or "X:XX"
function formatElapsedTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}`;
}

export function KitchenOrderCard({ order, status }: KitchenOrderCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  const items = parseOrderItems(order.items);

  // Update elapsed time every minute for preparing orders
  useEffect(() => {
    if (status === 'preparing' && order.prepStartedAt) {
      setElapsedMinutes(getElapsedMinutes(order.prepStartedAt));
      const interval = setInterval(() => {
        setElapsedMinutes(getElapsedMinutes(order.prepStartedAt));
      }, 60000);
      return () => clearInterval(interval);
    } else if (status === 'new') {
      setElapsedMinutes(getElapsedMinutes(order.createdAt));
      const interval = setInterval(() => {
        setElapsedMinutes(getElapsedMinutes(order.createdAt));
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [status, order.prepStartedAt, order.createdAt]);

  const handleStartPreparing = async () => {
    setLoading(true);
    try {
      const result = await startPreparingOrderAction(order.id, 25);
      if (result.success) {
        toast.success('Started preparing order');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to start preparing');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReady = async () => {
    setLoading(true);
    try {
      const result = await markOrderReadyAction(order.id);
      if (result.success) {
        toast.success('Order marked as ready');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to mark ready');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTime = async (minutes: number) => {
    const newTime = (order.prepEstimatedMinutes || 25) + minutes;
    if (newTime <= 0) return;

    const result = await updatePrepTimeAction(order.id, newTime);
    if (result.success) {
      router.refresh();
    } else {
      toast.error('Failed to update time');
    }
  };

  // Determine urgency based on waiting time
  const isWarning = elapsedMinutes > 15;
  const isUrgent = elapsedMinutes > 25;

  const cardBorderClass = isUrgent
    ? 'pz-border-red-500 pz-border-2'
    : isWarning
    ? 'pz-border-yellow-500 pz-border-2'
    : 'pz-border-gray-200 pz-border';

  return (
    <div className={`pz-bg-white pz-rounded-lg pz-shadow-sm ${cardBorderClass} pz-overflow-hidden`}>
      {/* Header */}
      <div className="pz-p-4 pz-border-b pz-border-gray-100">
        <div className="pz-flex pz-justify-between pz-items-start">
          <div>
            <h3 className="pz-font-bold pz-text-lg">Order #{order.id}</h3>
            <div className="pz-flex pz-items-center pz-gap-1 pz-text-sm pz-text-gray-500 pz-mt-1">
              <Clock size={14} />
              <span>{formatElapsedTime(elapsedMinutes)} ago</span>
              {status === 'preparing' && order.prepEstimatedMinutes && (
                <span className="pz-ml-2 pz-text-orange-600">
                  (Est. {order.prepEstimatedMinutes}m)
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

      {/* Items */}
      <div className="pz-p-4">
        <ul className="pz-space-y-2">
          {items.map((item, idx) => {
            // Parse details to highlight removed ingredients in red
            const detailParts = item.details?.split(' | ') || [];

            return (
              <li key={idx} className="pz-flex pz-justify-between pz-text-sm">
                <span>
                  <span className="pz-font-semibold">{item.quantity}x</span> {item.name}
                  {detailParts.length > 0 && (
                    <span className="pz-text-xs pz-block pz-ms-4">
                      {detailParts.map((part, partIdx) => {
                        const isRemoved = part.startsWith('-');
                        const isAdded = part.startsWith('+');
                        return (
                          <span
                            key={partIdx}
                            className={
                              isRemoved
                                ? 'pz-text-red-600 pz-font-medium'
                                : isAdded
                                ? 'pz-text-green-600'
                                : 'pz-text-gray-500'
                            }
                          >
                            {part}
                            {partIdx < detailParts.length - 1 && (
                              <span className="pz-text-gray-400"> | </span>
                            )}
                          </span>
                        );
                      })}
                    </span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>

        {order.comment && (
          <div className="pz-mt-3 pz-p-2 pz-bg-yellow-50 pz-rounded pz-text-sm">
            <span className="pz-font-semibold">Note:</span> {order.comment}
          </div>
        )}
      </div>

      {/* Customer Details (collapsible) */}
      <div className="pz-px-4 pz-pb-2">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="pz-text-sm pz-text-blue-600 hover:pz-underline"
        >
          {showDetails ? 'Hide details' : 'Show customer details'}
        </button>
        {showDetails && (
          <div className="pz-mt-2 pz-space-y-1 pz-text-sm pz-text-gray-600">
            <div className="pz-flex pz-items-center pz-gap-2">
              <User size={14} />
              <span>{order.fullName}</span>
            </div>
            <div className="pz-flex pz-items-center pz-gap-2">
              <Phone size={14} />
              <a href={`tel:${order.phone}`} className="pz-text-blue-600 hover:pz-underline">
                {order.phone}
              </a>
            </div>
            <div className="pz-flex pz-items-center pz-gap-2">
              <MapPin size={14} />
              <span>{order.address}</span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pz-p-4 pz-bg-gray-50 pz-border-t pz-border-gray-100">
        {status === 'new' && (
          <Button
            onClick={handleStartPreparing}
            disabled={loading}
            className="pz-w-full pz-bg-orange-500 hover:pz-bg-orange-600"
          >
            <ChefHat size={18} className="pz-mr-2" />
            {loading ? 'Starting...' : 'Start Preparing'}
          </Button>
        )}

        {status === 'preparing' && (
          <div className="pz-space-y-2">
            <div className="pz-flex pz-gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTime(-5)}
                className="pz-flex-1"
              >
                -5 min
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTime(5)}
                className="pz-flex-1"
              >
                +5 min
              </Button>
            </div>
            <Button
              onClick={handleMarkReady}
              disabled={loading}
              className="pz-w-full pz-bg-green-500 hover:pz-bg-green-600"
            >
              <Check size={18} className="pz-mr-2" />
              {loading ? 'Marking...' : 'Mark as Ready'}
            </Button>
          </div>
        )}

        {status === 'ready' && (
          <div className="pz-text-center pz-text-green-600 pz-font-semibold">
            ✓ Waiting for courier
          </div>
        )}
      </div>
    </div>
  );
}
