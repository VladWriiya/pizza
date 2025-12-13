'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { OrderStatus } from '@prisma/client';

const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'ALL', label: 'All', color: 'pz-bg-gray-100 pz-text-gray-800' },
  { value: OrderStatus.PENDING, label: 'Pending', color: 'pz-bg-yellow-100 pz-text-yellow-800' },
  { value: OrderStatus.CONFIRMED, label: 'Confirmed', color: 'pz-bg-blue-100 pz-text-blue-800' },
  { value: OrderStatus.PREPARING, label: 'Preparing', color: 'pz-bg-orange-100 pz-text-orange-800' },
  { value: OrderStatus.READY, label: 'Ready', color: 'pz-bg-green-100 pz-text-green-800' },
  { value: OrderStatus.DELIVERING, label: 'Delivering', color: 'pz-bg-purple-100 pz-text-purple-800' },
  { value: OrderStatus.DELIVERED, label: 'Delivered', color: 'pz-bg-emerald-100 pz-text-emerald-800' },
  { value: OrderStatus.CANCELLED, label: 'Cancelled', color: 'pz-bg-red-100 pz-text-red-800' },
];

interface Props {
  counts?: Record<string, number>;
}

export function OrderStatusFilter({ counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'ALL';
  const currentQuery = searchParams.get('query') || '';

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams();
    if (status !== 'ALL') {
      params.set('status', status);
    }
    if (currentQuery) {
      params.set('query', currentQuery);
    }
    router.push(`/admin/orders${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <div className="pz-flex pz-flex-wrap pz-gap-2 pz-mb-6">
      {STATUS_OPTIONS.map((option) => {
        const isActive = currentStatus === option.value;
        const count = option.value === 'ALL'
          ? Object.values(counts || {}).reduce((a, b) => a + b, 0)
          : counts?.[option.value] || 0;

        return (
          <button
            key={option.value}
            onClick={() => handleStatusChange(option.value)}
            className={`pz-px-3 pz-py-1.5 pz-rounded-full pz-text-sm pz-font-medium pz-transition-all pz-flex pz-items-center pz-gap-2 ${
              isActive
                ? `${option.color} pz-ring-2 pz-ring-offset-1 pz-ring-current`
                : 'pz-bg-gray-50 pz-text-gray-600 hover:pz-bg-gray-100'
            }`}
          >
            {option.label}
            {count > 0 && (
              <span className={`pz-px-1.5 pz-py-0.5 pz-rounded-full pz-text-xs ${
                isActive ? 'pz-bg-white/50' : 'pz-bg-gray-200'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
