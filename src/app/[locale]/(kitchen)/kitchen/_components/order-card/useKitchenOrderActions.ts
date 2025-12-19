'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  startPreparingOrderAction,
  markOrderReadyAction,
  updatePrepTimeAction,
} from '@/features/order-management';

interface UseKitchenOrderActionsProps {
  orderId: number;
  prepEstimatedMinutes?: number | null;
}

export function useKitchenOrderActions({ orderId, prepEstimatedMinutes }: UseKitchenOrderActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartPreparing = async () => {
    setLoading(true);
    try {
      const result = await startPreparingOrderAction(orderId, 25);
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
      const result = await markOrderReadyAction(orderId);
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
    const newTime = (prepEstimatedMinutes || 25) + minutes;
    if (newTime <= 0) return;

    const result = await updatePrepTimeAction(orderId, newTime);
    if (result.success) {
      router.refresh();
    } else {
      toast.error('Failed to update time');
    }
  };

  return {
    loading,
    handleStartPreparing,
    handleMarkReady,
    handleAddTime,
  };
}
