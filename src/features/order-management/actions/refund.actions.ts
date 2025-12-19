'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { refundPayPalPayment } from '@/lib/paypal-sdk';
import { addStatusHistoryEntry } from './order-status-utils';

interface RefundOrderResult {
  success: boolean;
  error?: string;
}

/**
 * Process a full refund for an order
 * Admin only
 */
export async function refundOrderAction(orderId: number): Promise<RefundOrderResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized - Admin only' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    // Check if already refunded
    if (order.refundId) {
      return { success: false, error: 'Order has already been refunded' };
    }

    // Check if order has payment ID
    if (!order.paymentId) {
      return { success: false, error: 'No payment ID found for this order' };
    }

    // Demo orders can't be refunded via PayPal
    if (order.isDemo) {
      return { success: false, error: 'Demo orders cannot be refunded' };
    }

    // Process refund via PayPal
    const refundResult = await refundPayPalPayment(order.paymentId);

    if (!refundResult.success) {
      return { success: false, error: refundResult.error || 'Refund failed' };
    }

    // Update order in database
    const userId = Number(session.user.id);
    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      'CANCELLED',
      userId,
      `Full refund processed: ${refundResult.refundId}`
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        refundId: refundResult.refundId,
        refundedAmount: order.totalAmount,
        refundedAt: new Date(),
        statusHistory,
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error processing refund:', error);
    return { success: false, error: 'Failed to process refund' };
  }
}

/**
 * Process a partial refund for an order
 * Admin only
 */
export async function partialRefundOrderAction(
  orderId: number,
  amount: number
): Promise<RefundOrderResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized - Admin only' };
  }

  try {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    if (!order.paymentId) {
      return { success: false, error: 'No payment ID found for this order' };
    }

    if (order.isDemo) {
      return { success: false, error: 'Demo orders cannot be refunded' };
    }

    // Validate amount
    const alreadyRefunded = order.refundedAmount || 0;
    const maxRefundable = order.totalAmount - alreadyRefunded;

    if (amount <= 0) {
      return { success: false, error: 'Refund amount must be positive' };
    }

    if (amount > maxRefundable) {
      return { success: false, error: `Maximum refundable amount is ${maxRefundable} ILS` };
    }

    // Process refund via PayPal
    const refundResult = await refundPayPalPayment(order.paymentId, amount);

    if (!refundResult.success) {
      return { success: false, error: refundResult.error || 'Refund failed' };
    }

    // Update order in database
    const userId = Number(session.user.id);
    const newRefundedAmount = alreadyRefunded + amount;
    const isFullyRefunded = newRefundedAmount >= order.totalAmount;

    const statusHistory = addStatusHistoryEntry(
      order.statusHistory,
      isFullyRefunded ? 'CANCELLED' : order.status,
      userId,
      `Partial refund: ${amount} ILS (Refund ID: ${refundResult.refundId})`
    );

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: isFullyRefunded ? 'CANCELLED' : order.status,
        refundId: refundResult.refundId, // Store latest refund ID
        refundedAmount: newRefundedAmount,
        refundedAt: new Date(),
        statusHistory,
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error('Error processing partial refund:', error);
    return { success: false, error: 'Failed to process refund' };
  }
}
