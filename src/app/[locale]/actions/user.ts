'use server';


import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { Order } from '@prisma/client';
import { prisma } from '../../../../prisma/prisma-client';

export async function getMyOrders(): Promise<Order[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(session.user.id) },
      orderBy: { createdAt: 'desc' },
    });
    return orders;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return [];
  }
}
