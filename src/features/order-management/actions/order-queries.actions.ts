'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '../../../../prisma/prisma-client';

// ============ KITCHEN QUERIES ============

/**
 * Get orders for kitchen dashboard
 * Returns: CONFIRMED, PREPARING, READY orders
 */
export async function getKitchenOrdersAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['KITCHEN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized', orders: [] };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'PREPARING', 'READY'],
        },
      },
      include: {
        kitchenUser: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching kitchen orders:', error);
    return { success: false, error: 'Failed to fetch orders', orders: [] };
  }
}

/**
 * Get kitchen statistics for today
 */
export async function getKitchenStatsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['KITCHEN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalToday, activeOrders, completedToday] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          status: { not: 'PENDING' },
        },
      }),
      prisma.order.count({
        where: {
          status: { in: ['CONFIRMED', 'PREPARING'] },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: today },
          status: { in: ['READY', 'DELIVERING', 'DELIVERED'] },
        },
      }),
    ]);

    return {
      success: true,
      stats: {
        totalToday,
        activeOrders,
        completedToday,
      },
    };
  } catch (error) {
    console.error('Error fetching kitchen stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

// ============ COURIER QUERIES ============

/**
 * Get available orders for courier (READY status, no courier assigned)
 */
export async function getAvailableDeliveriesAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized', orders: [] };
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        status: 'READY',
        courierUserId: null,
      },
      orderBy: { createdAt: 'asc' },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching available deliveries:', error);
    return { success: false, error: 'Failed to fetch orders', orders: [] };
  }
}

/**
 * Get courier's active deliveries (assigned to current user)
 */
export async function getMyActiveDeliveriesAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized', orders: [] };
  }

  try {
    const userId = Number(session.user.id);
    const orders = await prisma.order.findMany({
      where: {
        status: 'DELIVERING',
        courierUserId: userId,
      },
      orderBy: { deliveryStartedAt: 'asc' },
    });

    return { success: true, orders };
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    return { success: false, error: 'Failed to fetch orders', orders: [] };
  }
}

/**
 * Get courier statistics for today
 */
export async function getCourierStatsAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userId = Number(session.user.id);
    const [deliveriesToday, activeDeliveries] = await Promise.all([
      prisma.order.count({
        where: {
          courierUserId: userId,
          status: 'DELIVERED',
          updatedAt: { gte: today },
        },
      }),
      prisma.order.count({
        where: {
          courierUserId: userId,
          status: 'DELIVERING',
        },
      }),
    ]);

    return {
      success: true,
      stats: {
        deliveriesToday,
        activeDeliveries,
      },
    };
  } catch (error) {
    console.error('Error fetching courier stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

// ============ CUSTOMER QUERIES ============

/**
 * Get order details for tracking page
 */
export async function getOrderForTrackingAction(orderId: number, token?: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        kitchenUser: {
          select: { fullName: true },
        },
        courierUser: {
          select: { fullName: true },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // For public tracking, verify token matches
    const session = await getServerSession(authOptions);
    const sessionUserId = session?.user?.id ? Number(session.user.id) : null;
    const isOwner = sessionUserId === order.userId;
    const isStaff = session?.user && ['ADMIN', 'KITCHEN', 'COURIER'].includes(session.user.role);
    const tokenMatches = token && order.token === token;

    if (!isOwner && !isStaff && !tokenMatches) {
      return { success: false, error: 'Unauthorized to view this order' };
    }

    // Remove sensitive data for non-staff
    if (!isStaff) {
      return {
        success: true,
        order: {
          id: order.id,
          status: order.status,
          items: order.items,
          totalAmount: order.totalAmount,
          fullName: order.fullName,
          address: order.address,
          phone: order.phone,
          scheduledFor: order.scheduledFor,
          prepStartedAt: order.prepStartedAt,
          prepEstimatedMinutes: order.prepEstimatedMinutes,
          deliveryStartedAt: order.deliveryStartedAt,
          deliveryEstimatedMinutes: order.deliveryEstimatedMinutes,
          statusHistory: order.statusHistory,
          createdAt: order.createdAt,
        },
      };
    }

    return { success: true, order };
  } catch (error) {
    console.error('Error fetching order for tracking:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}
