'use client';

import { useState, useEffect } from 'react';
import { Order } from '@prisma/client';
import { OrderHeader } from './OrderHeader';
import { OrderItemsList } from './OrderItemsList';
import { CustomerDetails } from './CustomerDetails';
import { OrderActions } from './OrderActions';
import { useKitchenOrderActions } from './useKitchenOrderActions';

interface KitchenOrderCardProps {
  order: Order;
  status: 'new' | 'preparing' | 'ready';
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  details?: string;
}

function parseOrderItems(items: unknown): OrderItem[] {
  try {
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

export function KitchenOrderCard({ order, status }: KitchenOrderCardProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const items = parseOrderItems(order.items);

  const { loading, handleStartPreparing, handleMarkReady, handleAddTime } = useKitchenOrderActions({
    orderId: order.id,
    prepEstimatedMinutes: order.prepEstimatedMinutes,
  });

  // Update elapsed time every minute
  useEffect(() => {
    const targetDate = status === 'preparing' ? order.prepStartedAt : order.createdAt;
    setElapsedMinutes(getElapsedMinutes(targetDate));

    const interval = setInterval(() => {
      setElapsedMinutes(getElapsedMinutes(targetDate));
    }, 60000);

    return () => clearInterval(interval);
  }, [status, order.prepStartedAt, order.createdAt]);

  const isWarning = elapsedMinutes > 15;
  const isUrgent = elapsedMinutes > 25;

  const cardBorderClass = isUrgent
    ? 'pz-border-red-500 pz-border-2'
    : isWarning
    ? 'pz-border-yellow-500 pz-border-2'
    : 'pz-border-gray-200 pz-border';

  return (
    <div className={`pz-bg-white pz-rounded-lg pz-shadow-sm ${cardBorderClass} pz-overflow-hidden`}>
      <OrderHeader
        orderId={order.id}
        elapsedMinutes={elapsedMinutes}
        prepEstimatedMinutes={order.prepEstimatedMinutes}
        scheduledFor={order.scheduledFor}
        status={status}
        isUrgent={isUrgent}
      />

      <OrderItemsList items={items} comment={order.comment} />

      <CustomerDetails
        fullName={order.fullName}
        phone={order.phone}
        address={order.address}
      />

      <OrderActions
        status={status}
        loading={loading}
        onStartPreparing={handleStartPreparing}
        onMarkReady={handleMarkReady}
        onAddTime={handleAddTime}
      />
    </div>
  );
}
