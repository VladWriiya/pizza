'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { Trash2Icon } from 'lucide-react';
import { CountButton } from '@/shared/CountButton';
import type { TransformedCartItem } from '@/lib/cart-helpers';

interface CartItemProps extends TransformedCartItem {
  onClickCountButton: (type: 'plus' | 'minus') => void;
  onClickRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  imageUrl,
  name,
  price,
  quantity,
  details,
  disabled,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div className={cn('pz-flex pz-bg-white pz-p-3 sm:pz-p-5 pz-gap-3 sm:pz-gap-6', { 'pz-opacity-50 pz-pointer-events-none': disabled })} data-testid="cart-item">
      <img src={imageUrl} alt={name} className="pz-w-[50px] pz-h-[50px] sm:pz-w-[60px] sm:pz-h-[60px]" />
      <div className="pz-flex-1">
        <div>
          <h2 className="pz-text-lg pz-font-bold pz-flex-1 pz-leading-6">{name}</h2>
          {details && <p className="pz-text-xs pz-text-gray-400 pz-w-[90%]">{details}</p>}
        </div>
    
        <hr className="pz-my-3" />

        <div className="pz-flex pz-items-center pz-justify-between">
          <CountButton onClick={onClickCountButton} value={quantity} />
          <div className="pz-flex pz-items-center pz-gap-3">
            <h2 className="pz-font-bold">{price * quantity} ₪</h2>
            <Trash2Icon
              onClick={onClickRemove}
              className="pz-text-gray-400 pz-cursor-pointer hover:pz-text-gray-600"
              size={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
