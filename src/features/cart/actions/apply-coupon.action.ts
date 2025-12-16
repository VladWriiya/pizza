'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { CartWithRelations } from '@/lib/prisma-types';
import { prisma } from '../../../../prisma/prisma-client';
import { cartItemsInclude } from '@/lib/cart-utils';

export async function applyCouponAction(code: string) {
  const cookieStore = await cookies();
  const cartToken = cookieStore.get('cartToken')?.value;

  if (!cartToken) {
    return { success: false, error: 'Cart not found.' };
  }

  const normalizedCode = code.trim().toUpperCase();

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date())) {
    return { success: false, error: 'Coupon is not valid or has expired.' };
  }

  const cart = await prisma.cart.findFirst({
    where: { token: cartToken },
    include: {
      items: {
        include: {
          productItem: true, // <-- ВОТ ИСПРАВЛЕНИЕ
        },
      },
    },
  });

  if (!cart) {
    return { success: false, error: 'Cart not found.' };
  }
  
  const subtotal = cart.items.reduce((acc, item) => acc + item.quantity * item.productItem.price, 0);
  let finalAmount = subtotal;
  let discountAmount = 0;

  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (subtotal * coupon.discount) / 100;
  } else { 
    discountAmount = coupon.discount;
  }
  
  finalAmount = Math.max(0, subtotal - discountAmount);

  const updatedCart = await prisma.cart.update({
    where: { id: cart.id },
    data: {
        totalAmount: finalAmount,
        couponCode: coupon.code,
    },
    include: cartItemsInclude,
  });

  revalidatePath('/purchase');
  return { success: true, cart: updatedCart as CartWithRelations, discount: discountAmount };
}