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
        'pz-flex pz-items-center pz-justify-between',
        {
          'pz-opacity-50 pz-pointer-events-none': disabled,
        },
        className
      )}
    >
      <div className="pz-flex pz-items-center pz-gap-5 pz-flex-1">
        <img src={imageUrl} alt={name} className="pz-w-16 pz-h-16 pz-rounded-full" />
        <div>
          <h4 className="pz-font-bold">{name}</h4>
          <p className="pz-text-xs pz-text-gray-400">{details}</p>
        </div>
      </div>

      <p className="pz-font-bold">{price * quantity} ₪</p>

      <div className="pz-flex pz-items-center pz-gap-5 pz-ml-10">
        <CountButton onClick={onClickCountButton} value={quantity} />
        <button type="button" onClick={onClickRemove}>
          <X className="pz-text-gray-400 hover:pz-text-red-500" size={20} />
        </button>
      </div>
    </div>
  );
};
