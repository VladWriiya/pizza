'use client';

import { Button } from '@/shared/ui/button';
import { ChefHat, Check } from 'lucide-react';

interface OrderActionsProps {
  status: 'new' | 'preparing' | 'ready';
  loading: boolean;
  onStartPreparing: () => void;
  onMarkReady: () => void;
  onAddTime: (minutes: number) => void;
}

export function OrderActions({
  status,
  loading,
  onStartPreparing,
  onMarkReady,
  onAddTime,
}: OrderActionsProps) {
  return (
    <div className="pz-p-4 pz-bg-gray-50 pz-border-t pz-border-gray-100">
      {status === 'new' && (
        <Button
          onClick={onStartPreparing}
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
              onClick={() => onAddTime(-5)}
              className="pz-flex-1"
            >
              -5 min
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddTime(5)}
              className="pz-flex-1"
            >
              +5 min
            </Button>
          </div>
          <Button
            onClick={onMarkReady}
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
  );
}
