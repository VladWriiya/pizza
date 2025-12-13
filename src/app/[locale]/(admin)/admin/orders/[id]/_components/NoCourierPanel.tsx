'use client';

import { useState, useTransition } from 'react';
import { Truck, Phone, PackageCheck } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { offerSelfPickupAction, markDeliveredByOwnerAction } from '@/features/demo-mode/actions/demo-order.actions';
import toast from 'react-hot-toast';

interface Props {
  orderId: number;
  status: string;
  courierUserId: number | null;
  prepStartedAt: Date | null;
}

export function NoCourierPanel({ orderId, status, courierUserId, prepStartedAt }: Props) {
  const [isPending, startTransition] = useTransition();
  const [action, setAction] = useState<'pickup' | 'delivered' | null>(null);

  // Only show for READY orders without courier
  if (status !== 'READY' || courierUserId !== null) {
    return null;
  }

  // Calculate waiting time
  const waitingMinutes = prepStartedAt
    ? Math.floor((Date.now() - new Date(prepStartedAt).getTime()) / 60000)
    : 0;

  const handleSelfPickup = () => {
    setAction('pickup');
    startTransition(async () => {
      const result = await offerSelfPickupAction(orderId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setAction(null);
    });
  };

  const handleMarkDelivered = () => {
    setAction('delivered');
    startTransition(async () => {
      const result = await markDeliveredByOwnerAction(orderId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      setAction(null);
    });
  };

  return (
    <div className="pz-bg-orange-50 pz-border-2 pz-border-orange-500 pz-rounded-xl pz-p-4 pz-mb-6">
      <div className="pz-flex pz-items-start pz-gap-3">
        <div className="pz-bg-orange-500 pz-p-2 pz-rounded-lg pz-shrink-0">
          <Truck className="pz-w-5 pz-h-5 pz-text-white" />
        </div>
        <div className="pz-flex-1">
          <h3 className="pz-font-bold pz-text-orange-800">No Courier Assigned</h3>
          <p className="pz-text-sm pz-text-orange-700 pz-mt-1">
            Order is ready but no courier is available.
            {waitingMinutes > 0 && (
              <span className="pz-font-semibold"> Waiting: {waitingMinutes} min</span>
            )}
          </p>
        </div>
      </div>

      <div className="pz-flex pz-gap-3 pz-mt-4 pz-ps-11">
        <Button
          onClick={handleSelfPickup}
          disabled={isPending}
          variant="outline"
          className="pz-border-orange-500 pz-text-orange-700 hover:pz-bg-orange-100"
        >
          <Phone className="pz-w-4 pz-h-4 pz-me-2" />
          {isPending && action === 'pickup' ? 'Notifying...' : 'Offer Self-Pickup'}
        </Button>
        <Button
          onClick={handleMarkDelivered}
          disabled={isPending}
          className="pz-bg-green-600 hover:pz-bg-green-700"
        >
          <PackageCheck className="pz-w-4 pz-h-4 pz-me-2" />
          {isPending && action === 'delivered' ? 'Marking...' : 'Mark Delivered'}
        </Button>
      </div>
    </div>
  );
}
