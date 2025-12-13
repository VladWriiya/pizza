'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';

export interface OrderItemData {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface OrderItemCardProps {
  item: OrderItemData;
  className?: string;
  showTotal?: boolean;
}

export function OrderItemCard({ item, className, showTotal = true }: OrderItemCardProps) {
  const [imageError, setImageError] = useState(false);
  const total = item.price * item.quantity;
  const hasValidImage = item.imageUrl && !imageError;

  return (
    <div className={cn('pz-flex pz-items-center pz-justify-between', className)}>
      <div className="pz-flex pz-items-center pz-gap-4">
        <div className="pz-relative pz-w-16 pz-h-16 pz-rounded-md pz-overflow-hidden pz-bg-gray-100 pz-flex-shrink-0">
          {hasValidImage ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="pz-w-full pz-h-full pz-object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="pz-w-full pz-h-full pz-flex pz-items-center pz-justify-center pz-bg-gradient-to-br pz-from-orange-100 pz-to-orange-200">
              <Package className="pz-w-6 pz-h-6 pz-text-orange-400" />
            </div>
          )}
        </div>
        <div>
          <p className="pz-font-semibold pz-text-gray-900">{item.name}</p>
          <p className="pz-text-sm pz-text-gray-500">
            {item.quantity} x {item.price} ILS
          </p>
        </div>
      </div>
      {showTotal && (
        <p className="pz-font-semibold pz-text-gray-900">{total} ILS</p>
      )}
    </div>
  );
}

interface OrderItemListProps {
  items: OrderItemData[];
  className?: string;
}

export function OrderItemList({ items, className }: OrderItemListProps) {
  if (items.length === 0) {
    return (
      <p className="pz-text-gray-500 pz-text-center pz-py-4">No items</p>
    );
  }

  return (
    <ul className={cn('pz-space-y-4', className)}>
      {items.map((item, index) => (
        <li key={item.id || index}>
          <OrderItemCard item={item} />
        </li>
      ))}
    </ul>
  );
}
