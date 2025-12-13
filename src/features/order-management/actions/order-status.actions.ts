'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';

// Helper to add entry to status history
function addStatusHistoryEntry(
  currentHistory: unknown,
  status: OrderStatus,
  userId?: number,
  note?: string
): Prisma.InputJsonValue {
  const history = Array.isArray(currentHistory) ? currentHistory : [];
  return [
    ...history,
    {
      status,
      timestamp: new Date().toISOString(),
      userId,
      note,
    },
  ] as Prisma.InputJsonValue;
}

// Valid status transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERING', 'PREPARING', 'CANCELLED'], // PREPARING for remake
  DELIVERING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Terminal state
  SUCCEEDED: ['DELIVERED'], // Legacy - can migrate to DELIVERED
  CANCELLED: [], // Terminal state
};

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return validTransitions[from]?.includes(to) || false;
}

// ============ KITCHEN ACTIONS ============

/**
 * Kitchen staff starts preparing an order
 * Transitions: CONFIRMED -> PREPARING
 */
export async function startPreparingOrderAction(
  orderId: number,
  estimatedMinutes: number = 25
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['KITCHEN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (!canTransition(order.status, 'PREPARING')) {
      return { success: false, error: `Cannot start preparing order in ${order.status} status` };
    }

    const userId = Number(session.user.id);
    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'PREPARING',
      userId,
      'Kitchen started preparation'
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PREPARING',
        kitchenUserId: userId,
        prepStartedAt: new Date(),
        prepEstimatedMinutes: estimatedMinutes,
        statusHistory,
      },
    });

    revalidatePath('/kitchen');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error starting order preparation:', error);
    return { success: false, error: 'Failed to start preparation' };
  }
}

/**
 * Kitchen staff marks order as ready for pickup
 * Transitions: PREPARING -> READY
 */
export async function markOrderReadyAction(orderId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['KITCHEN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (!canTransition(order.status, 'READY')) {
      return { success: false, error: `Cannot mark as ready from ${order.status} status` };
    }

    const userId = Number(session.user.id);
    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'READY',
      userId,
      'Order ready for pickup'
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'READY',
        statusHistory,
      },
    });

    revalidatePath('/kitchen');
    revalidatePath('/courier');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error marking order ready:', error);
    return { success: false, error: 'Failed to mark order ready' };
  }
}

/**
 * Update preparation time estimate
 */
export async function updatePrepTimeAction(orderId: number, newEstimatedMinutes: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['KITCHEN', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'PREPARING') {
      return { success: false, error: 'Order not in preparing status' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { prepEstimatedMinutes: newEstimatedMinutes },
    });

    revalidatePath('/kitchen');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating prep time:', error);
    return { success: false, error: 'Failed to update time' };
  }
}

// ============ COURIER ACTIONS ============

/**
 * Courier accepts a delivery
 * Transitions: READY -> DELIVERING
 */
export async function acceptDeliveryAction(
  orderId: number,
  estimatedMinutes: number = 30
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    // Use transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId } });
      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'READY') {
        throw new Error(`Order is not ready for delivery (current status: ${order.status})`);
      }

      if (order.courierUserId) {
        throw new Error('Order already assigned to another courier');
      }

      const userId = Number(session.user.id);
      const statusHistory = addStatusHistoryEntry(
        order.statusHistory,
        'DELIVERING',
        userId,
        'Courier accepted delivery'
      );

      return tx.order.update({
        where: { id: orderId },
        data: {
          status: 'DELIVERING',
          courierUserId: userId,
          deliveryStartedAt: new Date(),
          deliveryEstimatedMinutes: estimatedMinutes,
          statusHistory,
        },
      });
    });

    revalidatePath('/courier');
    revalidatePath('/kitchen');
    revalidatePath(`/orders/${orderId}`);
    return { success: true, order: result };
  } catch (error) {
    console.error('Error accepting delivery:', error);
    const message = error instanceof Error ? error.message : 'Failed to accept delivery';
    return { success: false, error: message };
  }
}

/**
 * Courier marks delivery as completed
 * Transitions: DELIVERING -> DELIVERED
 */
export async function markDeliveredAction(orderId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status !== 'DELIVERING') {
      return { success: false, error: `Order is not in delivering status` };
    }

    const userId = Number(session.user.id);
    // Only the assigned courier or admin can mark as delivered
    if (session.user.role !== 'ADMIN' && order.courierUserId !== userId) {
      return { success: false, error: 'You are not assigned to this delivery' };
    }

    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'DELIVERED',
      userId,
      'Order delivered successfully'
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'DELIVERED',
        statusHistory,
      },
    });

    revalidatePath('/courier');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error marking order delivered:', error);
    return { success: false, error: 'Failed to mark order delivered' };
  }
}

/**
 * Update delivery time estimate
 */
export async function updateDeliveryTimeAction(orderId: number, newEstimatedMinutes: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !['COURIER', 'ADMIN'].includes(session.user.role)) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== 'DELIVERING') {
      return { success: false, error: 'Order not in delivering status' };
    }

    const userId = Number(session.user.id);
    // Only the assigned courier or admin can update time
    if (session.user.role !== 'ADMIN' && order.courierUserId !== userId) {
      return { success: false, error: 'You are not assigned to this delivery' };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { deliveryEstimatedMinutes: newEstimatedMinutes },
    });

    revalidatePath('/courier');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error updating delivery time:', error);
    return { success: false, error: 'Failed to update time' };
  }
}

// ============ ADMIN/SYSTEM ACTIONS ============

/**
 * Confirm order after payment (called by PayPal success handler)
 * Transitions: PENDING -> CONFIRMED
 */
export async function confirmOrderAction(orderId: number) {
  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (order.status !== 'PENDING') {
      return { success: false, error: 'Order is not pending' };
    }

    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'CONFIRMED',
      undefined,
      'Payment confirmed'
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        statusHistory,
      },
    });

    revalidatePath('/kitchen');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error confirming order:', error);
    return { success: false, error: 'Failed to confirm order' };
  }
}

/**
 * Cancel order (admin only for most states)
 */
export async function cancelOrderAction(orderId: number, reason?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized - Admin only' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (['DELIVERED', 'CANCELLED'].includes(order.status)) {
      return { success: false, error: 'Cannot cancel completed or already cancelled order' };
    }

    const userId = Number(session.user.id);
    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'CANCELLED',
      userId,
      reason || 'Order cancelled by admin'
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        statusHistory,
      },
    });

    revalidatePath('/kitchen');
    revalidatePath('/courier');
    revalidatePath('/admin/orders');
    revalidatePath(`/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error cancelling order:', error);
    return { success: false, error: 'Failed to cancel order' };
  }
}
