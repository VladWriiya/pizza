'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { cancelOrderAction } from '@/features/order-management';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { XCircle, AlertTriangle } from 'lucide-react';

interface CancelOrderPanelProps {
  orderId: number;
  status: string;
}

const CANCEL_REASONS = [
  'Customer requested cancellation',
  'Out of stock ingredients',
  'Restaurant too busy',
  'Delivery area not available',
  'Payment issue',
  'Duplicate order',
  'Other',
];

export function CancelOrderPanel({ orderId, status }: CancelOrderPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  // Can't cancel delivered or already cancelled orders
  const canCancel = !['DELIVERED', 'CANCELLED', 'SUCCEEDED'].includes(status);

  if (!canCancel) {
    return null;
  }

  const handleCancel = async () => {
    const finalReason = reason === 'Other' ? customReason : reason;

    if (!finalReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    if (!confirm(`Are you sure you want to cancel this order?\n\nReason: ${finalReason}`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await cancelOrderAction(orderId, finalReason);
      if (result.success) {
        toast.success('Order cancelled');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to cancel order');
      }
    } finally {
      setLoading(false);
      setShowForm(false);
    }
  };

  return (
    <div className="pz-bg-white pz-p-6 pz-rounded-lg">
      <h2 className="pz-text-lg pz-font-semibold pz-flex pz-items-center pz-gap-2">
        <XCircle size={20} className="pz-text-red-500" />
        Cancel Order
      </h2>

      {!showForm ? (
        <div className="pz-mt-4">
          <Button
            variant="destructive"
            onClick={() => setShowForm(true)}
            className="pz-w-full"
          >
            Cancel This Order
          </Button>
        </div>
      ) : (
        <div className="pz-mt-4 pz-space-y-4">
          <div className="pz-flex pz-items-center pz-gap-2 pz-p-3 pz-bg-yellow-50 pz-text-yellow-700 pz-rounded-lg pz-text-sm">
            <AlertTriangle size={16} />
            This action cannot be undone
          </div>

          <div>
            <label className="pz-block pz-text-sm pz-font-medium pz-mb-2">
              Cancellation Reason
            </label>
            <div className="pz-space-y-2">
              {CANCEL_REASONS.map((r) => (
                <label key={r} className="pz-flex pz-items-center pz-gap-2 pz-cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    value={r}
                    checked={reason === r}
                    onChange={(e) => setReason(e.target.value)}
                    className="pz-w-4 pz-h-4"
                  />
                  <span className="pz-text-sm">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {reason === 'Other' && (
            <Textarea
              placeholder="Enter cancellation reason..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="pz-min-h-[80px]"
            />
          )}

          <div className="pz-flex pz-gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setReason('');
                setCustomReason('');
              }}
              className="pz-flex-1"
            >
              Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading || !reason || (reason === 'Other' && !customReason.trim())}
              className="pz-flex-1"
            >
              {loading ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
