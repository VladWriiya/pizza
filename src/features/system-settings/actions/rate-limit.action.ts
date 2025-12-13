'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { getSystemSettingsAction } from './get-settings.action';

const DEFAULT_MAX_ORDERS_PER_HOUR = 5;

export async function checkOrderRateLimitAction(userId?: number, ipAddress?: string) {
  try {
    const result = await getSystemSettingsAction();
    const maxOrdersPerHour = result.success && result.settings
      ? result.settings.maxOrdersPerHour ?? DEFAULT_MAX_ORDERS_PER_HOUR
      : DEFAULT_MAX_ORDERS_PER_HOUR;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const whereConditions: { userId?: number; ipAddress?: string }[] = [];
    if (userId) whereConditions.push({ userId });
    if (ipAddress) whereConditions.push({ ipAddress });

    if (whereConditions.length === 0) {
      return { success: true, allowed: true };
    }

    const recentOrders = await prisma.order.count({
      where: {
        createdAt: { gte: oneHourAgo },
        OR: whereConditions,
      },
    });

    if (recentOrders >= maxOrdersPerHour) {
      return {
        success: true,
        allowed: false,
        message: `Maximum ${maxOrdersPerHour} orders per hour. Please try again later.`,
        recentOrders,
        maxOrdersPerHour,
      };
    }

    return { success: true, allowed: true, recentOrders, maxOrdersPerHour };
  } catch (error) {
    console.error('Failed to check rate limit:', error);
    return { success: true, allowed: true };
  }
}
