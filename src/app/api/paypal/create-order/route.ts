'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal-sdk';
import { calculateFinalOrderAmountAction } from '@/app/[locale]/actions/order';
import { isRestaurantOpenAction, checkOrderRateLimitAction } from '@/features/system-settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Check if restaurant is open for orders
    const restaurantStatus = await isRestaurantOpenAction();
    if (!restaurantStatus.isOpen) {
      return NextResponse.json(
        { error: restaurantStatus.message || 'Restaurant is currently closed' },
        { status: 403 }
      );
    }

    // Get user ID and IP for rate limiting
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ? parseInt(session.user.id, 10) : undefined;
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    // Check rate limit
    const rateLimit = await checkOrderRateLimitAction(userId, ipAddress !== 'unknown' ? ipAddress : undefined);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message || 'Too many orders. Please try again later.' },
        { status: 429 }
      );
    }

    const cartToken = req.cookies.get('cartToken')?.value;

    if (!cartToken) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const { finalAmount } = await calculateFinalOrderAmountAction(cartToken);

    if (finalAmount === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const result = await createPayPalOrder(finalAmount);

    if (result.success) {
      return NextResponse.json({ orderId: result.orderId });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}