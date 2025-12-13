// import { prisma } from '@/prisma/prisma-client';

// import { sendEmail } from '@/lib/email';
// import { CartItemWithRelations } from '@/components/types/cart';
// import { OrderStatus } from '@prisma/client';
// import { NextRequest, NextResponse } from 'next/server';
// import { OrderSuccessTemplate } from '@/components/shared/email-templates/OrderSuccessTemplate';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
//       const orderId = Number(body.resource.purchase_units[0].custom_id);

//       const order = await prisma.order.findUnique({
//         where: { id: orderId },
//       });

//       if (!order) {
//         return NextResponse.json({ error: 'Order not found' }, { status: 404 });
//       }

//       await prisma.order.update({
//         where: { id: order.id },
//         data: { status: OrderStatus.SUCCEEDED },
//       });

//       const items = JSON.parse(order.items as string) as CartItemWithRelations[];

//       await sendEmail(
//         order.email,
//         `Your order #${order.id} has been paid successfully! 🎉`,
//         OrderSuccessTemplate({ orderId: order.id, items: items })
//       );
//     }

//     return NextResponse.json({ status: 'ok' });
//   } catch (error) {
//     console.error('[PAYPAL_WEBHOOK] Error:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }

'use server';


import { sendEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';
import { OrderSuccessTemplate } from '@/shared/email-templates/OrderSuccessTemplate';
import { OrderItem } from '@/lib/schemas/order-form-schema';
import { prisma } from '../../../../../prisma/prisma-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = Number(body.resource.purchase_units[0].custom_id);

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Payment confirmed - order stays PENDING waiting for kitchen confirmation
      // Note: Order is already PENDING when created, so no status change needed here
      // Just send confirmation email

      const itemsFromOrder = JSON.parse(order.items as string) as OrderItem[];

      await sendEmail(
        order.email,
        `Your order #${order.id} has been paid successfully! 🎉`,
        OrderSuccessTemplate({ orderId: order.id, items: itemsFromOrder })
      );
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[PAYPAL_WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
