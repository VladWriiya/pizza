'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

interface UpdateSettingsData {
  openTime?: string;
  closeTime?: string;
  lastOrderTime?: string;
  maxCartItems?: number;
  maxOrdersPerHour?: number;
  maxActiveOrders?: number;
}

export async function updateSystemSettingsAction(data: UpdateSettingsData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: { id: 1, ...data },
      update: data,
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, settings };
  } catch (error) {
    console.error('Failed to update system settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
