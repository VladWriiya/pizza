'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';

interface ActionResult {
  success: boolean;
  error?: string;
}

/**
 * Toggle favorite status for a product
 */
export async function toggleFavoriteAction(productId: number): Promise<ActionResult & { isFavorite?: boolean }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in to save favorites' };
  }

  const userId = Number(session.user.id);

  try {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return { success: true, isFavorite: false };
    } else {
      await prisma.favorite.create({
        data: { userId, productId },
      });
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return { success: false, error: 'Failed to update favorites' };
  }
}

/**
 * Get all favorite product IDs for current user
 */
export async function getFavoriteIdsAction(): Promise<number[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(session.user.id) },
      select: { productId: true },
    });
    return favorites.map((f) => f.productId);
  } catch (error) {
    console.error('Get favorites error:', error);
    return [];
  }
}

/**
 * Get all favorite products with details for profile page
 */
export async function getFavoriteProductsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: Number(session.user.id) },
      include: {
        product: {
          include: {
            items: {
              orderBy: { price: 'asc' },
              take: 1,
            },
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => ({
      id: f.product.id,
      name: f.product.name,
      imageUrl: f.product.imageUrl,
      minPrice: f.product.items[0]?.price || f.product.minPrice,
      categoryName: f.product.category.name,
      addedAt: f.createdAt,
    }));
  } catch (error) {
    console.error('Get favorite products error:', error);
    return [];
  }
}

/**
 * Remove from favorites
 */
export async function removeFromFavoritesAction(productId: number): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Please sign in' };
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId: Number(session.user.id),
        productId,
      },
    });
    revalidatePath('/profile');
    return { success: true };
  } catch (error) {
    console.error('Remove favorite error:', error);
    return { success: false, error: 'Failed to remove from favorites' };
  }
}
