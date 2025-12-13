'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { checkAdminAuth } from '../lib/demo-helpers';

export async function getDemoStatsAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    const demoOrders = await prisma.order.count({ where: { isDemo: true } });
    const demoUsers = await prisma.user.count({ where: { isDemo: true } });

    const settings = await prisma.systemSettings.findFirst({ where: { id: 1 } });
    const isEmergencyDemo = settings?.emergencyClosureReason?.startsWith('DEMO:') || false;

    const ordersByScenario = await prisma.order.groupBy({
      by: ['demoScenario'],
      where: { isDemo: true },
      _count: true,
    });

    return {
      success: true,
      stats: {
        totalDemoOrders: demoOrders,
        totalDemoUsers: demoUsers,
        isEmergencyClosureDemo: isEmergencyDemo,
        emergencyClosureActive: settings?.emergencyClosureActive || false,
        ordersByScenario: ordersByScenario.reduce((acc, item) => {
          if (item.demoScenario) {
            acc[item.demoScenario] = item._count;
          }
          return acc;
        }, {} as Record<string, number>),
      },
    };
  } catch (error) {
    console.error('Demo stats error:', error);
    return { success: false, error: 'Failed to get demo stats' };
  }
}
