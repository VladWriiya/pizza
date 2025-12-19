'use client';

import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { refundOrderAction, partialRefundOrderAction } from '@/features/order-management';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { AlertTriangle, DollarSign, RefreshCcw } from 'lucide-react';

interface RefundPanelProps {
  orderId: number;
  totalAmount: number;
  refundedAmount: number | null;
  paymentId: string | null;
  isDemo: boolean;
  status: string;
}

export function RefundPanel({
  orderId,
  totalAmount,
  refundedAmount,
  paymentId,
  isDemo,
  status,
}: RefundPanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [partialAmount, setPartialAmount] = useState('');
  const [showPartial, setShowPartial] = useState(false);

  const alreadyRefunded = refundedAmount || 0;
  const maxRefundable = totalAmount - alreadyRefunded;
  const isFullyRefunded = alreadyRefunded >= totalAmount;

  // Can't refund if no payment, demo order, or already fully refunded
  const canRefund = paymentId && !isDemo && !isFullyRefunded && status !== 'CANCELLED';

  const handleFullRefund = async () => {
    if (!confirm('Are you sure you want to process a FULL refund? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const result = await refundOrderAction(orderId);
      if (result.success) {
        toast.success('Refund processed successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to process refund');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePartialRefund = async () => {
    const amount = parseFloat(partialAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > maxRefundable) {
      toast.error(`Maximum refundable amount is ${maxRefundable} ILS`);
      return;
    }

    if (!confirm(`Are you sure you want to refund ${amount} ILS?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await partialRefundOrderAction(orderId, amount);
      if (result.success) {
        toast.success(`Refunded ${amount} ILS successfully`);
        setPartialAmount('');
        setShowPartial(false);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to process refund');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pz-bg-white pz-p-6 pz-rounded-lg">
      <h2 className="pz-text-lg pz-font-semibold pz-flex pz-items-center pz-gap-2">
        <RefreshCcw size={20} />
        Refund
      </h2>

      <div className="pz-mt-4 pz-space-y-3">
        {/* Amount info */}
        <div className="pz-flex pz-justify-between pz-text-sm">
          <span className="pz-text-gray-500">Total Amount:</span>
          <span className="pz-font-semibold">{totalAmount} ILS</span>
        </div>

        {alreadyRefunded > 0 && (
          <div className="pz-flex pz-justify-between pz-text-sm">
            <span className="pz-text-gray-500">Already Refunded:</span>
            <span className="pz-font-semibold pz-text-orange-600">{alreadyRefunded} ILS</span>
          </div>
        )}

        {!isFullyRefunded && (
          <div className="pz-flex pz-justify-between pz-text-sm">
            <span className="pz-text-gray-500">Refundable:</span>
            <span className="pz-font-semibold pz-text-green-600">{maxRefundable} ILS</span>
          </div>
        )}

        {/* Status messages */}
        {isFullyRefunded && (
          <div className="pz-flex pz-items-center pz-gap-2 pz-p-3 pz-bg-green-50 pz-text-green-700 pz-rounded-lg pz-text-sm">
            <DollarSign size={16} />
            Fully refunded
          </div>
        )}

        {isDemo && (
          <div className="pz-flex pz-items-center pz-gap-2 pz-p-3 pz-bg-purple-50 pz-text-purple-700 pz-rounded-lg pz-text-sm">
            <AlertTriangle size={16} />
            Demo orders cannot be refunded
          </div>
        )}

        {!paymentId && !isDemo && (
          <div className="pz-flex pz-items-center pz-gap-2 pz-p-3 pz-bg-yellow-50 pz-text-yellow-700 pz-rounded-lg pz-text-sm">
            <AlertTriangle size={16} />
            No payment ID - cannot refund
          </div>
        )}

        {/* Refund buttons */}
        {canRefund && (
          <div className="pz-space-y-3 pz-pt-2">
            {showPartial ? (
              <div className="pz-space-y-2">
                <div className="pz-flex pz-gap-2">
                  <Input
                    type="number"
                    placeholder={`Amount (max ${maxRefundable})`}
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(e.target.value)}
                    min={1}
                    max={maxRefundable}
                    className="pz-flex-1"
                  />
                  <Button
                    onClick={handlePartialRefund}
                    disabled={loading}
                    size="sm"
                  >
                    {loading ? 'Processing...' : 'Refund'}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPartial(false)}
                  className="pz-w-full"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={handleFullRefund}
                  disabled={loading}
                  variant="destructive"
                  className="pz-w-full"
                >
                  {loading ? 'Processing...' : `Full Refund (${maxRefundable} ILS)`}
                </Button>
                <Button
                  onClick={() => setShowPartial(true)}
                  variant="outline"
                  className="pz-w-full"
                >
                  Partial Refund
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
