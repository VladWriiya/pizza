'use server';

import { prisma } from '../../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth, DEMO_EXPIRATION_MINUTES } from '../../lib/demo-helpers';

export async function simulateEmergencyClosureAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        emergencyClosureActive: true,
        emergencyClosureReason: 'DEMO: Technical Issues',
        emergencyClosureMessage: 'DEMO MODE: Restaurant temporarily closed due to simulated emergency',
        emergencyClosureUntil: new Date(Date.now() + DEMO_EXPIRATION_MINUTES * 60 * 1000),
        emergencyClosureActivatedBy: auth.userId,
        emergencyClosureActivatedAt: new Date(),
      },
      update: {
        emergencyClosureActive: true,
        emergencyClosureReason: 'DEMO: Technical Issues',
        emergencyClosureMessage: 'DEMO MODE: Restaurant temporarily closed due to simulated emergency',
        emergencyClosureUntil: new Date(Date.now() + DEMO_EXPIRATION_MINUTES * 60 * 1000),
        emergencyClosureActivatedBy: auth.userId,
        emergencyClosureActivatedAt: new Date(),
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/demo');
    revalidatePath('/admin/settings');

    return {
      success: true,
      message: `Emergency closure activated for ${DEMO_EXPIRATION_MINUTES} minutes`,
    };
  } catch (error) {
    console.error('Demo emergency closure error:', error);
    return { success: false, error: 'Failed to activate emergency closure' };
  }
}
