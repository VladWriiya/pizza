'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { prisma } from '../../../../prisma/prisma-client';
import { buildTranslations } from '@/lib/server/services/translation.service';

const categorySchema = z.object({
  name_en: z.string().min(2, { message: 'English name is required.' }),
  name_he: z.string().min(2, { message: 'Hebrew name is required.' }),
});

export async function createCategoryAction(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const formData = {
    name_en: data.get('name_en') as string,
    name_he: data.get('name_he') as string,
  };
  const validation = categorySchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  const internalName = validation.data.name_en;
  const translations = buildTranslations(validation.data.name_en, validation.data.name_he);

  try {
    const existingCategory = await prisma.category.findUnique({ where: { name: internalName } });
    if (existingCategory) {
      throw new Error('A category with this English name already exists.');
    }

    const highestOrderCategory = await prisma.category.findFirst({ orderBy: { sortIndex: 'desc' } });
    const newSortIndex = highestOrderCategory ? highestOrderCategory.sortIndex + 1 : 0;

    await prisma.category.create({
      data: {
        name: internalName,
        sortIndex: newSortIndex,
        translations,
      },
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create category.';
    return { success: false, error: message };
  }
}