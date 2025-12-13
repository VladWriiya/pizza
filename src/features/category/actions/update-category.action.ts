'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { categoryFormSchema } from '@/lib/schemas/category.schema';
import { prisma } from '../../../../prisma/prisma-client';
import { buildTranslations } from '@/lib/server/services/translation.service';

export async function updateCategoryAction(id: number, data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const formData = {
    name_en: data.get('name_en') as string,
    name_he: data.get('name_he') as string,
  };
  const validation = categoryFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  const translations = buildTranslations(validation.data.name_en, validation.data.name_he);

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: validation.data.name_en,
        translations,
      },
    });
    revalidatePath('/admin/categories');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update category.' };
  }
}