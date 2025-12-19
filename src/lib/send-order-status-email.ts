'use server';

import { sendEmail } from './email';
import { OrderStatusEmail } from './email-templates';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

// Only send emails for these status changes
const EMAIL_STATUSES: OrderStatus[] = ['CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'];

interface OrderEmailData {
  orderId: number;
  email: string;
  fullName: string;
  status: OrderStatus;
}

/**
 * Send order status update email
 * Only sends for specific status changes to avoid spamming
 */
export async function sendOrderStatusEmail(data: OrderEmailData): Promise<void> {
  // Only send for specific statuses
  if (!EMAIL_STATUSES.includes(data.status)) {
    return;
  }

  try {
    const orderLink = `${APP_URL}/orders/${data.orderId}`;

    await sendEmail(
      data.email,
      `Order #${data.orderId} - ${formatStatusForSubject(data.status)}`,
      OrderStatusEmail({
        fullName: data.fullName,
        orderId: data.orderId,
        status: data.status,
        orderLink,
      })
    );
  } catch (error) {
    // Log but don't throw - email failure shouldn't break order flow
    console.error('Failed to send order status email:', error);
  }
}

function formatStatusForSubject(status: OrderStatus): string {
  switch (status) {
    case 'CONFIRMED':
      return 'Order Confirmed';
    case 'PREPARING':
      return 'Being Prepared';
    case 'DELIVERING':
      return 'On Its Way';
    case 'DELIVERED':
      return 'Delivered';
    case 'CANCELLED':
      return 'Cancelled';
    default:
      return status;
  }
}
