'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';

export async function deleteCategoryAction(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    const productsInCategory = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productsInCategory > 0) {
      throw new Error('Cannot delete category with associated products.');
    }

    await prisma.category.delete({
      where: { id },
    });
    revalidatePath('/admin/categories');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete category.';
    return { error: message };
  }
}