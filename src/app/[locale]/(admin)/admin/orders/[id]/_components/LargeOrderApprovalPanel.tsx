'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { approveLargeCateringAction, rejectLargeCateringAction } from '@/features/demo-mode/actions/demo-order.actions';
import toast from 'react-hot-toast';

interface Props {
  orderId: number;
  demoScenario: string | null;
  status: string;
  itemsCount: number;
}

export function LargeOrderApprovalPanel({ orderId, demoScenario, status, itemsCount }: Props) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  // Only show for large catering demo orders that are pending
  if (demoScenario !== 'large-catering' || status !== 'PENDING') {
    return null;
  }

  const handleApprove = () => {
    setAction('approve');
    startTransition(async () => {
      const result = await approveLargeCateringAction(orderId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setAction(null);
    });
  };

  const handleReject = () => {
    setAction('reject');
    startTransition(async () => {
      const result = await rejectLargeCateringAction(orderId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setAction(null);
    });
  };

  return (
    <div className="pz-bg-yellow-50 pz-border-2 pz-border-yellow-500 pz-rounded-xl pz-p-4 pz-mb-6">
      <div className="pz-flex pz-items-start pz-gap-3">
        <div className="pz-bg-yellow-500 pz-p-2 pz-rounded-lg pz-shrink-0">
          <AlertTriangle className="pz-w-5 pz-h-5 pz-text-white" />
        </div>
        <div className="pz-flex-1">
          <h3 className="pz-font-bold pz-text-yellow-800">Large Order - Approval Required</h3>
          <p className="pz-text-sm pz-text-yellow-700 pz-mt-1">
            This order contains {itemsCount} items and requires manual approval.
            Please verify kitchen capacity before approving.
          </p>
        </div>
      </div>

      <div className="pz-flex pz-gap-3 pz-mt-4 pz-ps-11">
        <Button
          onClick={handleApprove}
          disabled={isPending}
          className="pz-bg-green-600 hover:pz-bg-green-700"
        >
          <Check className="pz-w-4 pz-h-4 pz-me-2" />
          {isPending && action === 'approve' ? 'Approving...' : 'Approve Order'}
        </Button>
        <Button
          onClick={handleReject}
          disabled={isPending}
          variant="destructive"
        >
          <X className="pz-w-4 pz-h-4 pz-me-2" />
          {isPending && action === 'reject' ? 'Rejecting...' : 'Reject Order'}
        </Button>
      </div>
    </div>
  );
}
