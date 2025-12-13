'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { checkAdminAuth, DEMO_EXPIRATION_MINUTES } from '../lib/demo-helpers';

export async function resetAllDemoDataAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    const deletedOrders = await prisma.order.deleteMany({
      where: { isDemo: true },
    });

    const deletedUsers = await prisma.user.deleteMany({
      where: { isDemo: true },
    });

    const settings = await prisma.systemSettings.findFirst({ where: { id: 1 } });
    if (settings?.emergencyClosureReason?.startsWith('DEMO:')) {
      await prisma.systemSettings.update({
        where: { id: 1 },
        data: {
          emergencyClosureActive: false,
          emergencyClosureReason: null,
          emergencyClosureMessage: null,
          emergencyClosureUntil: null,
          emergencyClosureActivatedBy: null,
          emergencyClosureActivatedAt: null,
        },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/demo');
    revalidatePath('/admin/settings');

    return {
      success: true,
      deletedOrders: deletedOrders.count,
      deletedUsers: deletedUsers.count,
      message: `Cleaned up ${deletedOrders.count} demo orders and ${deletedUsers.count} demo users`,
    };
  } catch (error) {
    console.error('Demo cleanup error:', error);
    return { success: false, error: 'Failed to clean up demo data' };
  }
}

export async function cleanupExpiredDemoDataAction() {
  try {
    const expirationTime = new Date(Date.now() - DEMO_EXPIRATION_MINUTES * 60 * 1000);

    const deletedOrders = await prisma.order.deleteMany({
      where: {
        isDemo: true,
        demoCreatedAt: { lt: expirationTime },
      },
    });

    const deletedUsers = await prisma.user.deleteMany({
      where: {
        isDemo: true,
        demoCreatedAt: { lt: expirationTime },
      },
    });

    const settings = await prisma.systemSettings.findFirst({ where: { id: 1 } });
    if (
      settings?.emergencyClosureActive &&
      settings?.emergencyClosureReason?.startsWith('DEMO:') &&
      settings?.emergencyClosureUntil &&
      new Date(settings.emergencyClosureUntil) < new Date()
    ) {
      await prisma.systemSettings.update({
        where: { id: 1 },
        data: {
          emergencyClosureActive: false,
          emergencyClosureReason: null,
          emergencyClosureMessage: null,
          emergencyClosureUntil: null,
          emergencyClosureActivatedBy: null,
          emergencyClosureActivatedAt: null,
        },
      });
    }

    return {
      success: true,
      deletedOrders: deletedOrders.count,
      deletedUsers: deletedUsers.count,
    };
  } catch (error) {
    console.error('Demo auto-cleanup error:', error);
    return { success: false, error: 'Failed to clean up expired demo data' };
  }
}
