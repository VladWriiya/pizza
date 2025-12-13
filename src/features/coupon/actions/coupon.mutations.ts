'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { couponFormSchema } from '@/lib/schemas/coupon.schema';
import { prisma } from '../../../../prisma/prisma-client';

export async function createCouponAction(data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const rawFormData = Object.fromEntries(data.entries());
  const formData = {
    ...rawFormData,
    discount: Number(rawFormData.discount),
    isActive: rawFormData.isActive === 'true',
    expiresAt: rawFormData.expiresAt || null,
  };
  const validation = couponFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }
  
  const { expiresAt, ...rest } = validation.data;

  try {
    await prisma.coupon.create({ 
        data: {
            ...rest,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to create coupon.' };
  }
}

export async function updateCouponAction(id: number, data: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  const rawFormData = Object.fromEntries(data.entries());
  const formData = {
    ...rawFormData,
    discount: Number(rawFormData.discount),
    isActive: rawFormData.isActive === 'true',
    expiresAt: rawFormData.expiresAt || null,
  };
  const validation = couponFormSchema.safeParse(formData);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  const { expiresAt, ...rest } = validation.data;

  try {
    await prisma.coupon.update({ 
        where: { id }, 
        data: {
            ...rest,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        }
    });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update coupon.' };
  }
}

export async function deleteCouponAction(id: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { error: 'Unauthorized' };
  }

  try {
    await prisma.coupon.delete({ where: { id } });
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete coupon.';
    return { error: errorMessage };
  }
}