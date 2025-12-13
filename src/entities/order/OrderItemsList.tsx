'use client';

import React from 'react';
import { WhiteBlock } from '@/shared/WhiteBlock';
import { TransformedCartItem } from '@/lib/cart-helpers';
import { CheckoutItem } from './CheckoutItem';

interface Props {
  items: TransformedCartItem[];
  onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void;
  onClickRemove: (id: number) => void;
  title?: string;
}

export const OrderItemsList: React.FC<Props> = ({ items, onClickCountButton, onClickRemove, title }) => {
  return (
    <WhiteBlock title={title}>
      <div className="pz-flex pz-flex-col pz-gap-5">
        {items.map((item) => (
          <CheckoutItem
            key={item.id}
            {...item}
            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
            onClickRemove={() => onClickRemove(item.id)}
          />
        ))}
      </div>
    </WhiteBlock>
  );
};