'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';

export async function updateCategoriesOrderAction(
  categories: { id: number; sortIndex: number }[]
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.$transaction(
      categories.map((category) =>
        prisma.category.update({
          where: { id: category.id },
          data: { sortIndex: category.sortIndex },
        })
      )
    );
    revalidatePath('/admin/categories');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update order.' };
  }
}