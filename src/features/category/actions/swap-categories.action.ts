'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';

export async function swapCategoriesAction(id1: number, id2: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const [cat1, cat2] = await Promise.all([
      prisma.category.findUnique({ where: { id: id1 } }),
      prisma.category.findUnique({ where: { id: id2 } }),
    ]);

    if (!cat1 || !cat2) {
      throw new Error('One or both categories not found.');
    }

    await prisma.$transaction([
      prisma.category.update({
        where: { id: id1 },
        data: { sortIndex: cat2.sortIndex },
      }),
      prisma.category.update({
        where: { id: id2 },
        data: { sortIndex: cat1.sortIndex },
      }),
    ]);

    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to swap categories.';
    return { success: false, error: message };
  }
}