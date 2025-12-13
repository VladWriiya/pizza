import { NextRequest, NextResponse } from 'next/server';

import { updateCartTotals } from '@/lib/cart-utils';
import { prisma } from '../../../../../prisma/prisma-client';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const data = (await req.json()) as { quantity: number };
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Cart token not found' }, { status: 401 });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity: data.quantity },
    });

    const updatedCart = await updateCartTotals(token);

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('[CART_PATCH] Server error:', error);
    return NextResponse.json({ message: 'Failed to update cart item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const token = req.cookies.get('cartToken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Cart token not found' }, { status: 401 });
    }

    await prisma.cartItem.delete({ where: { id } });

    const updatedCart = await updateCartTotals(token);

    return NextResponse.json(updatedCart);
  } catch (error) {
    console.error('[CART_DELETE] Server error:', error);
    return NextResponse.json({ message: 'Failed to delete cart item' }, { status: 500 });
  }
}
