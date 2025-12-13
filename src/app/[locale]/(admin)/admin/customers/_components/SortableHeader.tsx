'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import type { SortField, SortOrder } from '@/app/[locale]/actions/customer';

interface SortableHeaderProps {
  field: SortField;
  label: string;
}

export function SortableHeader({ field, label }: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy') || 'lastOrder';
  const currentOrder = (searchParams.get('order') || 'desc') as SortOrder;
  const isActive = currentSort === field;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', field);

    // Toggle order if clicking same field, otherwise default to desc
    if (isActive) {
      params.set('order', currentOrder === 'desc' ? 'asc' : 'desc');
    } else {
      params.set('order', 'desc');
    }

    router.push(`/admin/customers?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className="pz-flex pz-items-center pz-gap-1 pz-font-semibold hover:pz-text-primary pz-transition-colors"
    >
      {label}
      {isActive ? (
        currentOrder === 'desc' ? (
          <ArrowDown className="pz-w-4 pz-h-4" />
        ) : (
          <ArrowUp className="pz-w-4 pz-h-4" />
        )
      ) : (
        <ArrowUpDown className="pz-w-3 pz-h-3 pz-opacity-40" />
      )}
    </button>
  );
}
