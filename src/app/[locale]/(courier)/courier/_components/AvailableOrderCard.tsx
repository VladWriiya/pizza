'use client';

import { useState } from 'react';
import { Order } from '@prisma/client';
import { Button } from '@/shared/ui/button';
import { MapPin, Package, Clock } from 'lucide-react';
import { acceptDeliveryAction } from '@/features/order-management';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface AvailableOrderCardProps {
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

export function AvailableOrderCard({ order }: AvailableOrderCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const items = parseOrderItems(order.items);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  // Extract just the street/neighborhood from full address for preview
  const shortAddress = order.address.split(',')[0];

  const handleAccept = async () => {
    setLoading(true);
    try {
      const result = await acceptDeliveryAction(order.id, 30);
      if (result.success) {
        toast.success('Delivery accepted!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to accept delivery');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-4 pz-border pz-border-gray-200">
      <div className="pz-flex pz-justify-between pz-items-start pz-mb-3">
        <div>
          <h3 className="pz-font-bold pz-text-lg">Order #{order.id}</h3>
          <div className="pz-flex pz-items-center pz-gap-1 pz-text-sm pz-text-gray-500 pz-mt-1">
            <MapPin size={14} />
            <span>{shortAddress}</span>
          </div>
        </div>
        <span className="pz-bg-green-100 pz-text-green-700 pz-px-2 pz-py-1 pz-rounded pz-text-sm pz-font-semibold">
          Ready
        </span>
      </div>

      <div className="pz-flex pz-items-center pz-justify-between pz-mb-4">
        <div className="pz-flex pz-items-center pz-gap-4 pz-text-sm pz-text-gray-600">
          <span className="pz-flex pz-items-center pz-gap-1">
            <Package size={16} />
            {itemCount} items
          </span>
          <span className="pz-flex pz-items-center pz-gap-1">
            <Clock size={16} />
            ~30 min delivery
          </span>
        </div>
        <span className="pz-font-bold pz-text-lg">{order.totalAmount} ILS</span>
      </div>

      <Button
        onClick={handleAccept}
        disabled={loading}
        className="pz-w-full pz-h-12 pz-bg-emerald-500 hover:pz-bg-emerald-600"
      >
        {loading ? 'Accepting...' : 'Accept Delivery'}
      </Button>
    </div>
  );
}
