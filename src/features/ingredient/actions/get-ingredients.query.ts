'use server';


import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';




export async function updateIngredientAvailabilityAction(id: number, isAvailable: boolean) {
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

export async function deleteIngredientAction(id: number) {
  try {
    await prisma.ingredient.delete({ where: { id } });
    revalidatePath('/admin/ingredients');
    return { success: true }; 
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete ingredient.';
    return { error: message };
  }
}
