'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Order } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';
import { OrderItem } from '@/lib/schemas/order-form-schema';
import { safeJsonParse } from '@/lib/utils';

export async function getMyOrders(): Promise<Order[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

interface ReorderResult {
  success: boolean;
  error?: string;
  addedCount?: number;
  skippedCount?: number;
}

/**
 * Add items from a previous order to the current cart
 */
export async function reorderAction(orderId: number): Promise<ReorderResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in to reorder' };
  }

  try {
    // Get the order
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: Number(session.user.id),
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Parse order items
    const items = safeJsonParse<OrderItem[]>(order.items as string, []);
    if (items.length === 0) {
      return { success: false, error: 'Order has no items' };
    }

    // Get or create cart
    let token = cookies().get('cartToken')?.value;
    if (!token) {
      token = crypto.randomUUID();
      cookies().set('cartToken', token);
    }

    let cart = await prisma.cart.findFirst({
      where: { OR: [{ userId: Number(session.user.id) }, { token }] },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          token,
          userId: Number(session.user.id),
          totalAmount: 0,
        },
      });
    }

    // Check which products still exist
    const productItemIds = items
      .map((item) => item.productItemId)
      .filter((id): id is number => typeof id === 'number');

    const existingProductItems = await prisma.productItem.findMany({
      where: { id: { in: productItemIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingProductItems.map((p) => p.id));

    let addedCount = 0;
    let skippedCount = 0;

    // Add items to cart
    for (const item of items) {
      if (!item.productItemId || !existingIds.has(item.productItemId)) {
        skippedCount++;
        continue;
      }

      const ingredientIds = item.ingredientIds || [];
      const removedIds = item.removedIngredientIds || [];

      // Check if similar item exists in cart
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productItemId: item.productItemId,
        },
        include: { ingredients: { select: { id: true } } },
      });

      if (existingCartItem) {
        // Check if ingredients match
        const existingIngIds = existingCartItem.ingredients.map((i) => i.id).sort();
        const existingRemovedIds = ((existingCartItem.removedIngredientIds as number[]) || []).sort();
        const newIngIds = [...ingredientIds].sort();
        const newRemovedIds = [...removedIds].sort();

        const ingredientsMatch =
          existingIngIds.length === newIngIds.length &&
          existingIngIds.every((id, i) => id === newIngIds[i]) &&
          existingRemovedIds.length === newRemovedIds.length &&
          existingRemovedIds.every((id, i) => id === newRemovedIds[i]);

        if (ingredientsMatch) {
          // Increment quantity
          await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: { increment: item.quantity } },
          });
          addedCount++;
          continue;
        }
      }

      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productItemId: item.productItemId,
          quantity: item.quantity,
          ingredients: ingredientIds.length > 0 ? { connect: ingredientIds.map((id) => ({ id })) } : undefined,
          removedIngredientIds: removedIds.length > 0 ? removedIds : undefined,
        },
      });
      addedCount++;
    }

    // Recalculate cart total
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: {
        productItem: true,
        ingredients: true,
      },
    });

    const totalAmount = cartItems.reduce((sum, item) => {
      const itemPrice = item.productItem.price;
      const ingredientsPrice = item.ingredients.reduce((s, ing) => s + ing.price, 0);
      return sum + (itemPrice + ingredientsPrice) * item.quantity;
    }, 0);

    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount },
    });

    return {
      success: true,
      addedCount,
      skippedCount,
    };
  } catch (error) {
    console.error('Reorder error:', error);
    return { success: false, error: 'Failed to add items to cart' };
  }
}
