'use client';
import React from 'react';
import { Button } from '@/shared/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cart.store';
import { CartDrawer } from '@/widgets/CartDrawer';

export const CartButton = ({ className }: { className?: string }) => {
  const { items, totalAmount, loading } = useCartStore();
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartDrawer>
      <Button disabled={loading} className={cn('group relative', className)} data-testid="cart-button">
        <b data-testid="cart-total">{totalAmount} ₪</b>
        <span className="pz-h-full pz-w-[1px] pz-bg-white/30 pz-mx-3" />
        <div className="pz-flex pz-items-center pz-gap-1 pz-transition pz-duration-300 group-hover:pz-opacity-0">
          <ShoppingCart size={16} strokeWidth={2} />
          <b data-testid="cart-count">{totalQuantity}</b>
        </div>
        <ArrowRight
          size={20}
          className="pz-absolute pz-right-5 pz-transition pz-duration-300 -pz-translate-x-2 pz-opacity-0 group-hover:pz-opacity-100 group-hover:pz-translate-x-0"
        />
      </Button>
    </CartDrawer>
  );
};
