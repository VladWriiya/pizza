
import type { CartItemWithRelations } from '@/lib/prisma-types';
import { prisma } from '../../prisma/prisma-client';

export const calculateItemPrice = (item: CartItemWithRelations): number => {
  const ingredientsPrice = item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0);
  return (ingredientsPrice + item.productItem.price) * item.quantity;
};

export const getOrCreateCart = async (token: string) => {
  // Use upsert for atomic get-or-create in single query
  return prisma.cart.upsert({
    where: { token },
    update: {}, // No update needed, just return existing
    create: { token },
  });
};

// Shared include for cart queries - select only needed fields
const cartItemsInclude = {
  items: {
    orderBy: { createdAt: 'desc' as const },
    include: {
      productItem: {
        select: {
          price: true,
          size: true,
          pizzaType: true,
          product: {
            select: {
              name: true,
              imageUrl: true,
              translations: true,
              baseIngredients: {
                select: { id: true, name: true, translations: true },
              },
            },
          },
        },
      },
      ingredients: {
        select: { id: true, name: true, price: true, translations: true },
      },
    },
  },
};

export const updateCartTotals = async (token: string) => {
  // Single query: get cart with full data needed for both calculation and return
  const cart = await prisma.cart.findFirst({
    where: { token },
    include: cartItemsInclude,
  });

  if (!cart) {
    throw new Error('Cart not found during update.');
  }

  // Calculate total from fetched data
  const totalAmount = cart.items.reduce((acc, item) => {
    const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
    return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
  }, 0);

  // Only update if totalAmount changed
  if (cart.totalAmount !== totalAmount) {
    await prisma.cart.update({
      where: { id: cart.id },
      data: { totalAmount },
    });
    // Return cart with updated totalAmount
    return { ...cart, totalAmount };
  }

  return cart;
};

// Export for reuse in cart actions
export { cartItemsInclude };

/**
 * Merge guest cart with user cart on login/register
 *
 * Scenario:
 * 1. Guest adds items to cart (stored with token cookie)
 * 2. Guest logs in or registers
 * 3. We need to preserve their cart!
 *
 * Cases:
 * - User has NO cart → assign guest cart to user
 * - User HAS cart → move guest items to user cart, delete guest cart
 *
 * Returns the token of the cart that should be used (for cookie update)
 */
export async function mergeGuestCartOnLogin(userId: number, cartToken?: string): Promise<string | null> {
  if (!cartToken) return null;

  // Check if guest cart is already assigned to this user (already merged)
  const guestCart = await prisma.cart.findFirst({
    where: { token: cartToken },
    include: { items: true },
  });

  if (!guestCart) return null;

  // If guest cart already belongs to this user, no merge needed
  if (guestCart.userId === userId) {
    return cartToken;
  }

  const userCart = await prisma.cart.findFirst({
    where: { userId },
  });

  if (!userCart) {
    // User has no cart — just assign guest cart to user
    await prisma.cart.update({
      where: { id: guestCart.id },
      data: { userId },
    });
    return cartToken; // Keep same token
  } else {
    // User already has cart — merge items
    if (guestCart.items.length > 0) {
      await prisma.cartItem.updateMany({
        where: { cartId: guestCart.id },
        data: { cartId: userCart.id },
      });

      // Recalculate user cart total
      const updatedCart = await prisma.cart.findFirst({
        where: { id: userCart.id },
        include: { items: { include: { productItem: true, ingredients: true } } },
      });

      if (updatedCart) {
        const newTotal = updatedCart.items.reduce((acc, item) => {
          const ingredientsPrice = item.ingredients.reduce((sum, ing) => sum + ing.price, 0);
          return acc + (item.productItem.price + ingredientsPrice) * item.quantity;
        }, 0);

        await prisma.cart.update({
          where: { id: userCart.id },
          data: { totalAmount: newTotal },
        });
      }
    }

    // Delete empty guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });

    // Return user's cart token — cookie must be updated!
    return userCart.token;
  }
}
