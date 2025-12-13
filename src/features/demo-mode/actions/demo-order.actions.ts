'use server';

import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '../../../../prisma/prisma-client';
import { OrderStatus } from '@prisma/client';

type ActionResult = { success: true; message: string } | { success: false; error: string };

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return null;
  }
  return session.user;
}

// Scenario 1: Large Catering - Approve/Reject
export async function approveLargeCateringAction(orderId: number): Promise<ActionResult> {
  if (!(await checkAdmin())) return { success: false, error: 'Unauthorized' };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CONFIRMED },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, message: 'Large order approved' };
}

export async function rejectLargeCateringAction(orderId: number): Promise<ActionResult> {
  if (!(await checkAdmin())) return { success: false, error: 'Unauthorized' };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.CANCELLED },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, message: 'Large order rejected' };
}

// Scenario 3: No Couriers - Self Pickup / Mark Delivered
export async function offerSelfPickupAction(orderId: number): Promise<ActionResult> {
  if (!(await checkAdmin())) return { success: false, error: 'Unauthorized' };

  await prisma.order.update({
    where: { id: orderId },
    data: { comment: 'Customer notified: Self-pickup available' },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, message: 'Customer notified about self-pickup option' };
}

export async function markDeliveredByOwnerAction(orderId: number): Promise<ActionResult> {
  if (!(await checkAdmin())) return { success: false, error: 'Unauthorized' };

  await prisma.order.update({
    where: { id: orderId },
    data: { status: OrderStatus.DELIVERED },
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true, message: 'Order marked as delivered' };
}

