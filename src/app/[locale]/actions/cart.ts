'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getOrCreateCart, updateCartTotals } from '@/lib/cart-utils';
import { CartWithRelations } from '@/lib/prisma-types';
import { prisma } from '../../../../prisma/prisma-client';

interface AddToCartPayload {
  productItemId: number;
  ingredients?: number[];
  removedIngredients?: number[];
}

const DEFAULT_MAX_CART_ITEMS = 50;

// Get max cart items from settings or use default
async function getMaxCartItems(): Promise<number> {
  try {
    const settings = await prisma.systemSettings.findFirst();
    return settings?.maxCartItems ?? DEFAULT_MAX_CART_ITEMS;
  } catch {
    return DEFAULT_MAX_CART_ITEMS;
  }
}

// Calculate total items in cart (sum of all quantities)
async function getCartTotalItems(cartId: number): Promise<number> {
  const result = await prisma.cartItem.aggregate({
    where: { cartId },
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

export async function getCartAction(): Promise<CartWithRelations | null> {
  const token = cookies().get('cartToken')?.value;
  if (!token) {
    return null;
  }

  return prisma.cart.findFirst({
    where: { token },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
        include: {
          productItem: {
            include: {
              product: {
                include: {
                  baseIngredients: true,
                },
              },
            },
          },
          ingredients: true,
        },
      },
    },
  });
}

export async function addCartItemAction(payload: AddToCartPayload): Promise<CartWithRelations> {
  let token = cookies().get('cartToken')?.value;

  if (!token) {
    token = crypto.randomUUID();
    cookies().set('cartToken', token);
  }

  const cart = await getOrCreateCart(token);

  // Check cart limit before adding
  const [currentTotal, maxItems] = await Promise.all([
    getCartTotalItems(cart.id),
    getMaxCartItems(),
  ]);

  if (currentTotal >= maxItems) {
    throw new Error(`CART_LIMIT_EXCEEDED:${maxItems}`);
  }

  const sortedIngredientIds = payload.ingredients?.sort((a: number, b: number) => a - b) || [];
  const sortedRemovedIds = payload.removedIngredients?.sort((a: number, b: number) => a - b) || [];

  const candidates = await prisma.cartItem.findMany({
    where: {
      cartId: cart.id,
      productItemId: payload.productItemId,
    },
    include: {
      ingredients: {
        select: { id: true },
      },
    },
  });

  const existingItem = candidates.find((item) => {
    // Compare added ingredients
    const itemIngredientIds = item.ingredients.map((ing) => ing.id).sort((a: number, b: number) => a - b);
    if (itemIngredientIds.length !== sortedIngredientIds.length) {
      return false;
    }
    const ingredientsMatch = itemIngredientIds.every((id, index) => id === sortedIngredientIds[index]);
    if (!ingredientsMatch) return false;

    // Compare removed ingredients
    const itemRemovedIds = ((item.removedIngredientIds as number[]) || []).sort((a: number, b: number) => a - b);
    if (itemRemovedIds.length !== sortedRemovedIds.length) {
      return false;
    }
    return itemRemovedIds.every((id, index) => id === sortedRemovedIds[index]);
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: { increment: 1 } },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productItemId: payload.productItemId,
        quantity: 1,
        ingredients: { connect: sortedIngredientIds.map((id: number) => ({ id })) },
        removedIngredientIds: sortedRemovedIds.length > 0 ? sortedRemovedIds : undefined,
      },
    });
  }

  return updateCartTotals(token);
}

export async function updateCartItemQuantityAction(itemId: number, quantity: number): Promise<CartWithRelations> {
  const token = cookies().get('cartToken')?.value;
  if (!token) {
    throw new Error('Cart token not found');
  }

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    // Check cart limit when increasing quantity
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (cartItem && quantity > cartItem.quantity) {
      const [currentTotal, maxItems] = await Promise.all([
        getCartTotalItems(cartItem.cartId),
        getMaxCartItems(),
      ]);

      const increase = quantity - cartItem.quantity;
      if (currentTotal + increase > maxItems) {
        throw new Error(`CART_LIMIT_EXCEEDED:${maxItems}`);
      }
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return updateCartTotals(token);
}

export async function removeCartItemAction(itemId: number): Promise<CartWithRelations> {
  const token = cookies().get('cartToken')?.value;
  if (!token) {
    throw new Error('Cart token not found');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return updateCartTotals(token);
}
