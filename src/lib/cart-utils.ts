
import type { CartItemWithRelations } from '@/lib/prisma-types';
import { prisma } from '../../prisma/prisma-client';

export const calculateItemPrice = (item: CartItemWithRelations): number => {
  const ingredientsPrice = item.ingredients.reduce((acc, ingredient) => acc + ingredient.price, 0);
  return (ingredientsPrice + item.productItem.price) * item.quantity;
};

export const getOrCreateCart = async (token: string) => {
  const cart = await prisma.cart.findFirst({
    where: { token },
  });

  if (cart) {
    return cart;
  }

  return prisma.cart.create({
    data: { token },
  });
};

export const updateCartTotals = async (token: string) => {
  const cart = await prisma.cart.findFirst({
    where: { token },
    include: {
      items: {
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

  if (!cart) {
    throw new Error('Cart not found during update.');
  }

  const totalAmount = cart.items.reduce((acc, item) => {
    return acc + calculateItemPrice(item);
  }, 0);

  return await prisma.cart.update({
    where: { id: cart.id },
    data: { totalAmount },
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
};
