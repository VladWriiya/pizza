'use server';

import { NextRequest, NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/paypal-sdk';
import { calculateFinalOrderAmountAction } from '@/app/[locale]/actions/order';
import { isRestaurantOpenAction, checkOrderRateLimitAction } from '@/features/system-settings';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { LOYALTY_CONFIG } from '@/lib/loyalty-config';

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

    // Get applied points from request body
    let appliedPoints = 0;
    try {
      const body = await req.json();
      appliedPoints = body?.appliedPoints || 0;
    } catch {
      // No body or invalid JSON, continue with 0 points
    }

    const { finalAmount } = await calculateFinalOrderAmountAction(cartToken);

    if (finalAmount === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate points discount
    const pointsDiscount = appliedPoints * LOYALTY_CONFIG.ILS_PER_POINT;
    const amountAfterPoints = Math.max(0, finalAmount - pointsDiscount);

    const result = await createPayPalOrder(amountAfterPoints);

    if (result.success) {
      return NextResponse.json({ orderId: result.orderId });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}