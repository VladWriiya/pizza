'use server';

import { OrderStatus } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';
import type { DashboardAlert } from '../(admin)/admin/_components/AlertsPanel/types';

const ACTIVE_STATUSES = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PREPARING,
  OrderStatus.READY,
  OrderStatus.DELIVERING,
];

export async function getDashboardStatsAction() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalRevenue,
      totalOrders,
      todaysRevenue,
      todaysOrders,
      recentOrders,
      activeOrdersCount,
      ordersByStatusRaw,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.DELIVERED, isDemo: false },
      }),
      prisma.order.count({ where: { isDemo: false } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: OrderStatus.DELIVERED, createdAt: { gte: today }, isDemo: false },
      }),
      prisma.order.count({ where: { createdAt: { gte: today }, isDemo: false } }),
      prisma.order.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      // Count ALL active orders (including demo) for load alerts
      prisma.order.count({
        where: { status: { in: ACTIVE_STATUSES } },
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: true,
        where: { status: { in: ACTIVE_STATUSES } },
      }),
    ]);

    const ordersByStatus: Record<string, number> = {};
    ACTIVE_STATUSES.forEach((s) => (ordersByStatus[s] = 0));
    ordersByStatusRaw.forEach((item) => {
      ordersByStatus[item.status] = item._count;
    });

    return {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders: totalOrders || 0,
      todaysRevenue: todaysRevenue._sum.totalAmount || 0,
      todaysOrders: todaysOrders || 0,
      averageCheck: totalOrders > 0 ? (totalRevenue._sum.totalAmount || 0) / totalOrders : 0,
      recentOrders: recentOrders || [],
      activeOrdersCount: activeOrdersCount || 0,
      ordersByStatus,
    };
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return null;
  }
}

export async function getDashboardAlertsAction(): Promise<DashboardAlert[]> {
  const alerts: DashboardAlert[] = [];
  const now = new Date();

  try {
    // Note: ready_no_courier alerts are now shown via NoCourierUrgentBanner component
    // to avoid duplication and provide better UX with sound and visual prominence

    // 1. PENDING orders > 5 minutes
    const pendingTooLong = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        createdAt: { lt: new Date(now.getTime() - 5 * 60 * 1000) },
        isDemo: false,
      },
      select: { id: true, fullName: true, createdAt: true },
    });

    pendingTooLong.forEach((order) => {
      const waitingMinutes = Math.floor((now.getTime() - order.createdAt.getTime()) / 60000);
      alerts.push({
        id: `pending-${order.id}`,
        type: 'pending_too_long',
        severity: 'info',
        title: `Order #${order.id} pending ${waitingMinutes} min`,
        description: `${order.fullName} - needs confirmation`,
        orderId: order.id,
        actionUrl: `/admin/orders/${order.id}`,
        actionLabel: 'Confirm',
        createdAt: order.createdAt,
      });
    });

    // 3. Large orders (>10 items OR >500 ILS) in PENDING
    const largeOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.PENDING,
        isDemo: false,
        totalAmount: { gte: 500 },
      },
      select: { id: true, fullName: true, totalAmount: true, items: true, createdAt: true },
    });

    largeOrders.forEach((order) => {
      const items = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) as unknown[];
      const itemsCount = items?.length || 0;
      alerts.push({
        id: `large-${order.id}`,
        type: 'large_order',
        severity: 'info',
        title: `Large order #${order.id}`,
        description: `${order.totalAmount} ILS, ${itemsCount} items`,
        orderId: order.id,
        actionUrl: `/admin/orders/${order.id}`,
        actionLabel: 'Review',
        createdAt: order.createdAt,
      });
    });

    // 4. Emergency closure ending soon (< 10 min)
    const settings = await prisma.systemSettings.findFirst();
    if (settings?.emergencyClosureActive && settings.emergencyClosureUntil) {
      const minutesLeft = Math.floor(
        (settings.emergencyClosureUntil.getTime() - now.getTime()) / 60000
      );
      if (minutesLeft > 0 && minutesLeft <= 10) {
        alerts.push({
          id: 'emergency-ending',
          type: 'emergency_ending',
          severity: 'critical',
          title: `Emergency closure ends in ${minutesLeft} min`,
          description: 'Extend or prepare to reopen',
          actionUrl: '/admin/settings',
          actionLabel: 'Settings',
          createdAt: now,
        });
      }
    }

    // Sort by severity (critical first)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  } catch (error) {
    console.error('Failed to fetch dashboard alerts:', error);
    return [];
  }
}

export interface WaitingForCourierOrder {
  id: number;
  fullName: string;
  address: string;
  waitingMinutes: number;
  isDemo: boolean;
}

/**
 * Get orders that are READY but have no courier assigned
 * Lower threshold (2 min) for immediate visibility
 */
export async function getOrdersWaitingForCourierAction(): Promise<WaitingForCourierOrder[]> {
  const now = new Date();
  // Lower threshold for demo visibility - 2 minutes instead of 10
  const minWaitTime = 2 * 60 * 1000;

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.READY,
        courierUserId: null,
        updatedAt: { lt: new Date(now.getTime() - minWaitTime) },
      },
      select: {
        id: true,
        fullName: true,
        address: true,
        updatedAt: true,
        isDemo: true,
      },
      orderBy: { updatedAt: 'asc' }, // Longest waiting first
    });

    return orders.map((order) => ({
      id: order.id,
      fullName: order.fullName,
      address: order.address,
      waitingMinutes: Math.floor((now.getTime() - order.updatedAt.getTime()) / 60000),
      isDemo: order.isDemo,
    }));
  } catch (error) {
    console.error('Failed to fetch orders waiting for courier:', error);
    return [];
  }
}

// Re-export analytics actions for convenience
export {
  getOrdersPerDayAction,
  getPopularProductsAction,
  getPeakHoursAction,
  type DailyOrderData,
  type PopularProductData,
  type PeakHourData,
} from './analytics.actions';
