'use server';

import { OrderStatus } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';

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
