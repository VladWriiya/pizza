'use server';

import { prisma } from '../../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';
import { checkAdminAuth, generateDemoToken } from '../../lib/demo-helpers';

export async function simulateViralLoadAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    const products = await prisma.product.findMany({
      take: 10,
      include: { items: true },
    });

    if (products.length === 0) {
      return { success: false, error: 'No products found' };
    }

    const names = ['David', 'Sarah', 'Michael', 'Anna', 'Tom', 'Emma', 'Daniel', 'Rachel', 'Jake', 'Lisa'];
    const statuses = [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PREPARING];

    const orderPromises = [];

    for (let i = 0; i < 100; i++) {
      const product = products[i % products.length];
      const item = product?.items[0];
      const price = item?.price || 79;
      const name = names[i % names.length];
      const status = statuses[i % statuses.length];

      orderPromises.push(
        prisma.order.create({
          data: {
            fullName: `[DEMO] ${name} #${i + 1}`,
            email: `demo-viral-${i}@example.com`,
            phone: `+97250000${String(i).padStart(4, '0')}`,
            address: `Demo Viral Load St ${i + 1}, Tel Aviv`,
            totalAmount: price,
            status,
            token: generateDemoToken(`viral-${i}`),
            items: JSON.stringify([{
              id: item?.id || i + 1,
              name: product?.name || 'Pizza',
              quantity: 1,
              price,
              imageUrl: product?.imageUrl || '',
            }]),
            comment: `DEMO: Viral load order #${i + 1}`,
            statusHistory: JSON.stringify([{ status: 'PENDING', timestamp: new Date().toISOString() }]),
            isDemo: true,
            demoCreatedAt: new Date(),
            demoScenario: 'viral-load',
          },
        })
      );
    }

    const createdOrders = await Promise.all(orderPromises);

    revalidatePath('/admin/orders');
    revalidatePath('/admin/demo');
    revalidatePath('/admin');
    revalidatePath('/kitchen');
    revalidatePath('/courier');

    return {
      success: true,
      count: createdOrders.length,
      message: `Created ${createdOrders.length} demo orders simulating viral load`,
    };
  } catch (error) {
    console.error('Demo viral load error:', error);
    return { success: false, error: 'Failed to create viral load orders' };
  }
}
