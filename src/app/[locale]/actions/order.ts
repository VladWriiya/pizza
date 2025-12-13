'use server';

import { OrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';

const VAT_PERCENT = 18; 
const DELIVERY_PRICE = 10;

export async function calculateFinalOrderAmountAction(token: string) {
  const cart = await prisma.cart.findFirst({ where: { token } });

  if (!cart || cart.totalAmount === 0) {
    return {
      finalAmount: 0,
      subtotal: 0,
      vat: 0,
      delivery: 0,
    };
  }

  const subtotal = cart.totalAmount;
  const vat = (subtotal * VAT_PERCENT) / 100;
  const delivery = DELIVERY_PRICE;
  const finalAmount = subtotal + delivery + vat;

  return { finalAmount, subtotal, vat, delivery };
}

export async function getOrdersAction(query?: string, status?: OrderStatus | 'ALL') {
  try {
    const searchQuery = query?.trim();
    const isNumeric = searchQuery && !isNaN(Number(searchQuery));

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          // Status filter
          status && status !== 'ALL' ? { status } : {},
          // Search filter
          searchQuery
            ? {
                OR: [
                  isNumeric ? { id: Number(searchQuery) } : {},
                  { phone: { contains: searchQuery, mode: 'insensitive' } },
                ],
              }
            : {},
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}

export async function getOrderCountsByStatusAction(): Promise<Record<string, number>> {
  try {
    const counts = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    const result: Record<string, number> = {};
    counts.forEach((item) => {
      result[item.status] = item._count;
    });
    return result;
  } catch (error) {
    console.error('Failed to fetch order counts:', error);
    return {};
  }
}

export async function updateOrderStatusAction(id: number, status: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${id}`);
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to update order status.' };
  }
}