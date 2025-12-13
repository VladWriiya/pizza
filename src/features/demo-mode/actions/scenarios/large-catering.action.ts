'use server';

import { prisma } from '../../../../../prisma/prisma-client';
import { revalidatePath } from 'next/cache';
import { OrderStatus } from '@prisma/client';
import { checkAdminAuth, generateDemoToken } from '../../lib/demo-helpers';

export async function simulateLargeCateringOrderAction() {
  const auth = await checkAdminAuth();
  if (!auth.authorized) return { success: false, error: auth.error };

  try {
    const products = await prisma.product.findMany({
      where: { categoryId: 1 },
      take: 5,
      include: { items: true },
    });

    if (products.length === 0) {
      return { success: false, error: 'No pizza products found' };
    }

    const items = [];
    let totalAmount = 0;

    for (let i = 0; i < 50; i++) {
      const product = products[i % products.length];
      const item = product.items[0];
      const price = item?.price || 99;
      items.push({
        id: item?.id || i + 1,
        name: product.name,
        quantity: 1,
        price,
        imageUrl: product.imageUrl,
      });
      totalAmount += price;
    }

    const order = await prisma.order.create({
      data: {
        fullName: '[DEMO] Corporate Catering Inc.',
        email: 'demo-catering@example.com',
        phone: '+972500000050',
        address: 'Demo Corporate Office, 50 Business Ave, Tel Aviv',
        totalAmount,
        status: OrderStatus.PENDING,
        token: generateDemoToken('large-catering'),
        items: JSON.stringify(items),
        comment: 'DEMO: Large corporate order requiring manual approval',
        statusHistory: JSON.stringify([
          { status: 'PENDING', timestamp: new Date().toISOString(), note: 'DEMO: Awaiting approval' },
        ]),
        isDemo: true,
        demoCreatedAt: new Date(),
        demoScenario: 'large-catering',
      },
    });

    revalidatePath('/admin/orders');
    revalidatePath('/admin/demo');

    return {
      success: true,
      orderId: order.id,
      message: `Created demo order #${order.id} with 50 items totaling ₪${totalAmount}`,
    };
  } catch (error) {
    console.error('Demo large catering error:', error);
    return { success: false, error: 'Failed to create demo large order' };
  }
}
