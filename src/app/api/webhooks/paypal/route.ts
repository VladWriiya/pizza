import { sendEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';
import { OrderSuccessTemplate } from '@/shared/email-templates/OrderSuccessTemplate';
import { OrderItem } from '@/lib/schemas/order-form-schema';
import { verifyPayPalWebhook } from '@/lib/paypal-sdk';
import { prisma } from '../../../../../prisma/prisma-client';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}

function safeParseOrderItems(items: unknown): OrderItem[] {
  try {
    if (typeof items === 'string') {
      return JSON.parse(items) as OrderItem[];
    }
    if (Array.isArray(items)) {
      return items as OrderItem[];
    }
    return [];
  } catch {
    console.error('[PAYPAL_WEBHOOK] Failed to parse order items');
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const webhookHeaders = {
      transmissionId: req.headers.get('paypal-transmission-id'),
      transmissionTime: req.headers.get('paypal-transmission-time'),
      certUrl: req.headers.get('paypal-cert-url'),
      transmissionSig: req.headers.get('paypal-transmission-sig'),
      authAlgo: req.headers.get('paypal-auth-algo'),
    };

    const verification = await verifyPayPalWebhook(webhookHeaders, body);

    if (!verification.success) {
      console.error('[PAYPAL_WEBHOOK] Verification failed:', verification.error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const event = body as { event_type?: string; resource?: { purchase_units?: Array<{ custom_id?: string }> } };

    if (event.event_type === 'CHECKOUT.ORDER.APPROVED') {
      const customId = event.resource?.purchase_units?.[0]?.custom_id;

      if (!customId) {
        return NextResponse.json({ error: 'Missing order ID' }, { status: 400 });
      }

      const orderId = Number(customId);

      if (isNaN(orderId)) {
        return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      const itemsFromOrder = safeParseOrderItems(order.items);

      if (itemsFromOrder.length > 0) {
        await sendEmail(
          order.email,
          `Your order #${order.id} has been paid successfully!`,
          OrderSuccessTemplate({ orderId: order.id, items: itemsFromOrder })
        );
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('[PAYPAL_WEBHOOK] Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
