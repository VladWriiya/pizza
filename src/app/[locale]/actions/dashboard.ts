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

// ============ ANALYTICS FUNCTIONS ============

export interface DailyOrderData {
  date: string;
  orders: number;
  revenue: number;
}

/**
 * Get orders per day for the last N days
 */
export async function getOrdersPerDayAction(days: number = 7): Promise<DailyOrderData[]> {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        isDemo: false,
        status: { not: OrderStatus.CANCELLED },
      },
      select: {
        createdAt: true,
        totalAmount: true,
        status: true,
      },
    });

    // Group by date
    const byDate: Record<string, { orders: number; revenue: number }> = {};

    // Initialize all days with zeros
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      byDate[dateKey] = { orders: 0, revenue: 0 };
    }

    // Aggregate data
    orders.forEach((order) => {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (byDate[dateKey]) {
        byDate[dateKey].orders++;
        if (order.status === OrderStatus.DELIVERED) {
          byDate[dateKey].revenue += order.totalAmount;
        }
      }
    });

    // Convert to array sorted by date
    return Object.entries(byDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue,
      }));
  } catch (error) {
    console.error('Failed to fetch orders per day:', error);
    return [];
  }
}

export interface PopularProductData {
  name: string;
  count: number;
}

/**
 * Get most popular products by order frequency
 */
export async function getPopularProductsAction(limit: number = 5): Promise<PopularProductData[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: OrderStatus.DELIVERED,
        isDemo: false,
      },
      select: { items: true },
    });

    // Count product occurrences
    const productCounts: Record<string, number> = {};

    orders.forEach((order) => {
      const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(items)) {
        items.forEach((item: { name: string; quantity?: number }) => {
          const name = item.name;
          const qty = item.quantity || 1;
          productCounts[name] = (productCounts[name] || 0) + qty;
        });
      }
    });

    // Sort and take top N
    return Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  } catch (error) {
    console.error('Failed to fetch popular products:', error);
    return [];
  }
}

export interface PeakHourData {
  hour: number;
  count: number;
}

/**
 * Get order distribution by hour of day
 */
export async function getPeakHoursAction(): Promise<PeakHourData[]> {
  try {
    const orders = await prisma.order.findMany({
      where: {
        isDemo: false,
        status: { not: OrderStatus.CANCELLED },
      },
      select: { createdAt: true },
    });

    // Initialize all hours with zeros
    const hourCounts: number[] = new Array(24).fill(0);

    orders.forEach((order) => {
      const hour = order.createdAt.getHours();
      hourCounts[hour]++;
    });

    return hourCounts.map((count, hour) => ({ hour, count }));
  } catch (error) {
    console.error('Failed to fetch peak hours:', error);
    return [];
  }
}