'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { TransformedCartItem } from '@/lib/cart-helpers';
import { CountButton } from '@/shared/CountButton';

interface Props extends TransformedCartItem {
  onClickCountButton: (type: 'plus' | 'minus') => void;
  onClickRemove: () => void;
  className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
  name,
  price,
  imageUrl,
  quantity,
  details,
  className,
  disabled,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div
      className={cn(
        'pz-flex pz-flex-col sm:pz-flex-row pz-items-start sm:pz-items-center pz-justify-between pz-gap-3 sm:pz-gap-0',
        {
          'pz-opacity-50 pz-pointer-events-none': disabled,
        },
        className
      )}
    >
      {/* Product info */}
      <div className="pz-flex pz-items-center pz-gap-3 sm:pz-gap-5 pz-flex-1 pz-w-full sm:pz-w-auto">
        <img src={imageUrl} alt={name} className="pz-w-12 pz-h-12 sm:pz-w-16 sm:pz-h-16 pz-rounded-full pz-shrink-0" />
        <div className="pz-flex-1 pz-min-w-0">
          <h4 className="pz-font-bold pz-text-sm sm:pz-text-base pz-truncate">{name}</h4>
          <p className="pz-text-xs pz-text-gray-400 pz-line-clamp-2">{details}</p>
        </div>
      </div>

      {/* Price and controls */}
      <div className="pz-flex pz-items-center pz-justify-between sm:pz-justify-end pz-gap-3 sm:pz-gap-5 pz-w-full sm:pz-w-auto sm:pz-ml-4">
        <p className="pz-font-bold pz-text-sm sm:pz-text-base">{price * quantity} ₪</p>
        <div className="pz-flex pz-items-center pz-gap-3 sm:pz-gap-5">
          <CountButton onClick={onClickCountButton} value={quantity} />
          <button type="button" onClick={onClickRemove}>
            <X className="pz-text-gray-400 hover:pz-text-red-500" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
