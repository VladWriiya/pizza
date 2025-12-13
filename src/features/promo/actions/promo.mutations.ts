'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { promoCardFormSchema, PromoCardFormValues } from '@/lib/schemas/promo.schema';

export async function createPromoCardAction(data: PromoCardFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validation = promoCardFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  // Get max sortIndex
  const maxSort = await prisma.promoCard.aggregate({
    _max: { sortIndex: true },
  });
  const nextSortIndex = (maxSort._max.sortIndex ?? -1) + 1;

  await prisma.promoCard.create({
    data: {
      ...validation.data,
      sortIndex: nextSortIndex,
    },
  });

  revalidatePath('/admin/promos');
  revalidatePath('/');
  return { success: true };
}

export async function updatePromoCardAction(id: number, data: PromoCardFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const validation = promoCardFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  await prisma.promoCard.update({
    where: { id },
    data: validation.data,
  });

  revalidatePath('/admin/promos');
  revalidatePath('/');
  return { success: true };
}

export async function deletePromoCardAction(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  await prisma.promoCard.delete({
    where: { id },
  });

  revalidatePath('/admin/promos');
  revalidatePath('/');
  return { success: true };
}

export async function reorderPromoCardsAction(orderedIds: number[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  // Update sortIndex for each card
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.promoCard.update({
        where: { id },
        data: { sortIndex: index },
      })
    )
  );

  revalidatePath('/admin/promos');
  revalidatePath('/');
  return { success: true };
}

export async function getPromoCardsAction() {
  return prisma.promoCard.findMany({
    orderBy: { sortIndex: 'asc' },
  });
}

export async function getActivePromoCardsAction() {
  return prisma.promoCard.findMany({
    where: { isActive: true },
    orderBy: { sortIndex: 'asc' },
  });
}
