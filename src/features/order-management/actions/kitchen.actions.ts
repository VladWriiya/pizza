'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { addStatusHistoryEntry, canTransition } from './order-status-utils';
import { sendOrderStatusEmail } from '@/lib/send-order-status-email';

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

    // Send email notification
    await sendOrderStatusEmail({
      orderId: order.id,
      email: order.email,
      fullName: order.fullName,
      status: 'PREPARING',
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
