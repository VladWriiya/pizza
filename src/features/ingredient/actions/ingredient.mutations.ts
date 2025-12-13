'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ingredientFormSchema } from '@/lib/schemas/ingredient.schema';
import { prisma } from '../../../../prisma/prisma-client';
import { buildTranslations } from '@/lib/server/services/translation.service';

export async function createIngredientAction(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const formData = Object.fromEntries(data.entries());
  const validation = ingredientFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  const { name_en, name_he, ...rest } = validation.data;
  const translations = buildTranslations(name_en, name_he);

  try {
    await prisma.ingredient.create({
      data: {
        ...rest,
        name: name_en,
        translations,
      },
    });
    revalidatePath('/admin/ingredients');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to create ingredient.' };
  }
}

export async function updateIngredientAction(id: number, data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const formData = Object.fromEntries(data.entries());
  const validation = ingredientFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  const { name_en, name_he, ...rest } = validation.data;
  const translations = buildTranslations(name_en, name_he);

  try {
    await prisma.ingredient.update({
      where: { id },
      data: {
        ...rest,
        name: name_en,
        translations,
      },
    });
    revalidatePath('/admin/ingredients');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update ingredient.' };
  }
}

export async function updateIngredientAvailabilityAction(id: number, isAvailable: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.ingredient.update({
      where: { id },
      data: { isAvailable },
    });
    revalidatePath('/admin/ingredients');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update ingredient.' };
  }
}