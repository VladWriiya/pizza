'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { addStatusHistoryEntry } from './order-status-utils';
import { sendOrderStatusEmail } from '@/lib/send-order-status-email';

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

    // Send email notification
    await sendOrderStatusEmail({
      orderId: order.id,
      email: order.email,
      fullName: order.fullName,
      status: 'CONFIRMED',
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

    // Send email notification
    await sendOrderStatusEmail({
      orderId: order.id,
      email: order.email,
      fullName: order.fullName,
      status: 'CANCELLED',
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
