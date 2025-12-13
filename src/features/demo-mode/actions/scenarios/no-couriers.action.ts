'use server';

import { prisma } from '../../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';
import { checkAdminAuth, generateDemoToken } from '../../lib/demo-helpers';

export async function simulateNoCouriersAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    const products = await prisma.product.findMany({
      take: 3,
      include: { items: true },
    });

    const ordersData = [
      { name: '[DEMO] Waiting Customer 1', phone: '+972500000001', address: 'Demo St 1' },
      { name: '[DEMO] Waiting Customer 2', phone: '+972500000002', address: 'Demo St 2' },
      { name: '[DEMO] Waiting Customer 3', phone: '+972500000003', address: 'Demo St 3' },
    ];

    const createdOrders = [];

    for (const data of ordersData) {
      const product = products[Math.floor(Math.random() * products.length)];
      const item = product?.items[0];
      const price = item?.price || 79;

      const order = await prisma.order.create({
        data: {
          fullName: data.name,
          email: 'demo-nocourier@example.com',
          phone: data.phone,
          address: data.address,
          totalAmount: price,
          status: OrderStatus.READY,
          token: generateDemoToken('no-couriers'),
          items: JSON.stringify([{
            id: item?.id || 1,
            name: product?.name || 'Pizza',
            quantity: 1,
            price,
            imageUrl: product?.imageUrl || '',
          }]),
          comment: 'DEMO: Order ready but no courier available',
          statusHistory: JSON.stringify([
            { status: 'PENDING', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
            { status: 'CONFIRMED', timestamp: new Date(Date.now() - 28 * 60000).toISOString() },
            { status: 'PREPARING', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
            { status: 'READY', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
          ]),
          prepStartedAt: new Date(Date.now() - 20 * 60000),
          prepEstimatedMinutes: 15,
          isDemo: true,
          demoCreatedAt: new Date(),
          demoScenario: 'no-couriers',
        },
      });
      createdOrders.push(order);
    }

    revalidatePath('/admin/orders');
    revalidatePath('/admin/demo');
    revalidatePath('/courier');

    return {
      success: true,
      orderIds: createdOrders.map(o => o.id),
      message: `Created ${createdOrders.length} orders stuck in READY status`,
    };
  } catch (error) {
    console.error('Demo no couriers error:', error);
    return { success: false, error: 'Failed to create demo stuck orders' };
  }
}
