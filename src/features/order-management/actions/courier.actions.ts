'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { addStatusHistoryEntry } from './order-status-utils';
import { sendOrderStatusEmail } from '@/lib/send-order-status-email';

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

    // Send email notification
    await sendOrderStatusEmail({
      orderId: result.id,
      email: result.email,
      fullName: result.fullName,
      status: 'DELIVERING',
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

    // Send email notification
    await sendOrderStatusEmail({
      orderId: order.id,
      email: order.email,
      fullName: order.fullName,
      status: 'DELIVERED',
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
