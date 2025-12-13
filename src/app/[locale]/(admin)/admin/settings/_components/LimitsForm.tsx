'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateSystemSettingsAction } from '@/features/system-settings';

interface Props {
  maxCartItems: number;
  maxOrdersPerHour: number;
  maxActiveOrders: number;
}

export function LimitsForm({ maxCartItems, maxOrdersPerHour, maxActiveOrders }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState(maxCartItems);
  const [ordersPerHour, setOrdersPerHour] = useState(maxOrdersPerHour);
  const [activeOrders, setActiveOrders] = useState(maxActiveOrders);

  const hasChanges =
    cartItems !== maxCartItems ||
    ordersPerHour !== maxOrdersPerHour ||
    activeOrders !== maxActiveOrders;

  async function handleSave() {
    setIsLoading(true);
    try {
      const result = await updateSystemSettingsAction({
        maxCartItems: cartItems,
        maxOrdersPerHour: ordersPerHour,
        maxActiveOrders: activeOrders,
      });

      if (result.success) {
        toast.success('Limits updated');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update');
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="pz-bg-white pz-border pz-rounded-xl pz-p-6">
      <div className="pz-flex pz-items-center pz-gap-2 pz-mb-4">
        <ShieldCheck className="pz-w-5 pz-h-5 pz-text-gray-600" />
        <h3 className="pz-text-lg pz-font-semibold">Order Limits</h3>
      </div>

      <div className="pz-grid pz-grid-cols-3 pz-gap-4">
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Max Cart Items</label>
          <input
            type="number"
            min={1}
            max={200}
            value={cartItems}
            onChange={(e) => setCartItems(Number(e.target.value))}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
          <p className="pz-text-xs pz-text-gray-400 pz-mt-1">Per order</p>
        </div>
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Max Orders/Hour</label>
          <input
            type="number"
            min={1}
            max={50}
            value={ordersPerHour}
            onChange={(e) => setOrdersPerHour(Number(e.target.value))}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
          <p className="pz-text-xs pz-text-gray-400 pz-mt-1">Per user/IP</p>
        </div>
        <div>
          <label className="pz-block pz-text-sm pz-text-gray-500 pz-mb-1">Max Active Orders</label>
          <input
            type="number"
            min={1}
            max={100}
            value={activeOrders}
            onChange={(e) => setActiveOrders(Number(e.target.value))}
            className="pz-w-full pz-border pz-rounded-lg pz-px-3 pz-py-2"
          />
          <p className="pz-text-xs pz-text-gray-400 pz-mt-1">Kitchen capacity</p>
        </div>
      </div>

      {hasChanges && (
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="pz-mt-4 pz-flex pz-items-center pz-gap-2 pz-bg-blue-600 pz-text-white pz-px-4 pz-py-2 pz-rounded-lg pz-font-medium hover:pz-bg-blue-700 pz-transition disabled:pz-opacity-50"
        >
          <Save className="pz-w-4 pz-h-4" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      )}
    </div>
  );
}
