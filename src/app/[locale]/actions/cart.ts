'use server';

import { cookies } from 'next/headers';
import crypto from 'crypto';
import { getOrCreateCart, updateCartTotals, cartItemsInclude } from '@/lib/cart-utils';
import { CartWithRelations } from '@/lib/prisma-types';
import { prisma } from '../../../../prisma/prisma-client';

interface AddToCartPayload {
  productItemId: number;
  ingredients?: number[];
  removedIngredients?: number[];
}

const DEFAULT_MAX_CART_ITEMS = 50;

// Cache for maxCartItems (refreshes every 60 seconds)
let cachedMaxCartItems: number | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60 seconds

// Get max cart items from settings with caching
async function getMaxCartItems(): Promise<number> {
  const now = Date.now();
  if (cachedMaxCartItems !== null && now - cacheTimestamp < CACHE_TTL) {
    return cachedMaxCartItems;
  }

  try {
    const settings = await prisma.systemSettings.findFirst();
    cachedMaxCartItems = settings?.maxCartItems ?? DEFAULT_MAX_CART_ITEMS;
    cacheTimestamp = now;
    return cachedMaxCartItems;
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
    include: cartItemsInclude,
  }) as Promise<CartWithRelations | null>;
}

export async function addCartItemAction(payload: AddToCartPayload): Promise<CartWithRelations> {
  let token = cookies().get('cartToken')?.value;

  if (!token) {
    token = crypto.randomUUID();
    cookies().set('cartToken', token);
  }

  // Step 1: Get or create cart + get maxItems in parallel
  const [cart, maxItems] = await Promise.all([
    getOrCreateCart(token),
    getMaxCartItems(),
  ]);

  const sortedIngredientIds = payload.ingredients?.sort((a: number, b: number) => a - b) || [];
  const sortedRemovedIds = payload.removedIngredients?.sort((a: number, b: number) => a - b) || [];

  // Step 2: Get candidates + count in parallel
  const [candidates, currentTotal] = await Promise.all([
    prisma.cartItem.findMany({
      where: {
        cartId: cart.id,
        productItemId: payload.productItemId,
      },
      include: {
        ingredients: {
          select: { id: true },
        },
      },
    }),
    getCartTotalItems(cart.id),
  ]);

  // Check cart limit
  if (currentTotal >= maxItems) {
    throw new Error(`CART_LIMIT_EXCEEDED:${maxItems}`);
  }

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

  // Step 3: Update or create item
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

  // Step 4: Update totals and return
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
    // Get cart item and max items in parallel
    const [cartItem, maxItems] = await Promise.all([
      prisma.cartItem.findUnique({
        where: { id: itemId },
        select: { cartId: true, quantity: true },
      }),
      getMaxCartItems(),
    ]);

    if (cartItem && quantity > cartItem.quantity) {
      const currentTotal = await getCartTotalItems(cartItem.cartId);
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
