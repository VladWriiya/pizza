'use server';

import { NextRequest, NextResponse } from 'next/server';

import { OrderStatus } from '@prisma/client';
import { OrderFormValues, OrderItem } from '@/lib/schemas/order-form-schema';
import { sendEmail } from '@/lib/email';
import { OrderSuccessTemplate } from '@/shared/email-templates/OrderSuccessTemplate';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { capturePayPalOrder } from '@//lib/paypal-sdk';
import { prisma } from '../../../../../prisma/prisma-client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body?.orderId || !body?.formData) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { orderId, formData, cartToken } = body as { orderId: string; formData: OrderFormValues; cartToken?: string };
    const session = await getServerSession(authOptions);

    const captureResult = await capturePayPalOrder(orderId);

    if (!captureResult.success || captureResult.data?.status !== 'COMPLETED') {
      return NextResponse.json({ error: 'Payment could not be completed.' }, { status: 400 });
    }

    let cart;
    const includeCartItems = {
      items: {
        include: {
          productItem: { include: { product: { include: { baseIngredients: true } } } },
          ingredients: true,
        },
      },
    };

    if (session?.user?.id) {
      cart = await prisma.cart.findFirst({
        where: { userId: Number(session.user.id) },
        include: includeCartItems,
      });
    }

    if (!cart && cartToken) {
      cart = await prisma.cart.findFirst({
        where: { token: cartToken },
        include: includeCartItems,
      });
    }

    if (!cart) {
      throw new Error('Cart not found during capture process.');
    }

    const fullAddress = [formData.address, formData.apartment].filter(Boolean).join(', ');
    const userId = session?.user?.id ? Number(session.user.id) : undefined;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || undefined;

    const itemsForOrder: OrderItem[] = cart.items.map((item) => {
      const details: string[] = [];
      const pizzaSize = item.productItem.size;
      const pizzaType = item.productItem.pizzaType;

      // Pizza size and dough type
      if (pizzaSize && pizzaType) {
        const doughName = pizzaType === 1 ? 'Traditional' : 'Thin';
        details.push(`${pizzaSize} cm, ${doughName}`);
      }

      // Added ingredients (extras)
      if (item.ingredients.length > 0) {
        details.push(`+ ${item.ingredients.map((ing) => ing.name).join(', ')}`);
      }

      // Removed base ingredients
      const removedIds = (item.removedIngredientIds as number[]) || [];
      if (removedIds.length > 0) {
        const product = item.productItem.product as { baseIngredients?: { id: number; name: string }[] };
        const baseIngredients = product.baseIngredients || [];
        const removedNames = removedIds
          .map((id) => baseIngredients.find((bi) => bi.id === id)?.name)
          .filter(Boolean);
        if (removedNames.length > 0) {
          details.push(`- ${removedNames.join(', ')}`);
        }
      }

      return {
        id: item.id,
        name: item.productItem.product.name,
        price: item.productItem.price,
        quantity: item.quantity,
        imageUrl: item.productItem.product.imageUrl,
        details: details.length > 0 ? details.join(' | ') : undefined,
      };
    });

    // Create status history for the new order flow
    const now = new Date();
    const statusHistory = [
      { status: 'PENDING', timestamp: new Date(now.getTime() - 1000).toISOString() },
      { status: 'CONFIRMED', timestamp: now.toISOString() },
    ];

    const orderData = {
      userId,
      token: cart.token,
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: fullAddress,
      comment: formData.comment,
      totalAmount: cart.totalAmount,
      status: OrderStatus.CONFIRMED, // Start as CONFIRMED, kitchen will process
      paymentId: captureResult.data.id,
      items: JSON.stringify(itemsForOrder),
      statusHistory: JSON.stringify(statusHistory),
      ipAddress,
    };

    const order = await prisma.order.create({ data: orderData });
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({ where: { id: cart.id }, data: { totalAmount: 0 } });

    try {
      await sendEmail(
        order.email,
        `Your order #${order.id} has been confirmed! 🎉`,
        OrderSuccessTemplate({ orderId: order.id, items: itemsForOrder })
      );
    } catch (emailError) {
      console.error('Failed to send confirmation email, but order was processed:', emailError);
    }

    // Return orderId and token for tracking page
    return NextResponse.json({ success: true, orderId: order.id, token: cart.token });
  } catch (error) {
    console.error('[PAYPAL_CAPTURE_ORDER] CRITICAL ERROR:', error);
    return NextResponse.json({ error: 'Failed to capture order' }, { status: 500 });
  }
}
