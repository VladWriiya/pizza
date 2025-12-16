
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
