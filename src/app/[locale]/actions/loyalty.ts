'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { prisma } from '../../../../prisma/prisma-client';
import { LoyaltyTransactionType } from '@prisma/client';
import { LOYALTY_CONFIG } from '@/lib/loyalty-config';

// Points configuration (from config)
const POINTS_PER_ILS = LOYALTY_CONFIG.POINTS_PER_ILS;
const ILS_PER_POINT = LOYALTY_CONFIG.ILS_PER_POINT;
const MIN_POINTS_TO_REDEEM = LOYALTY_CONFIG.MIN_POINTS_TO_REDEEM;

export interface LoyaltyInfo {
  points: number;
  pointsValue: number; // Value in ILS
  canRedeem: boolean;
  minPointsToRedeem: number;
  recentTransactions: {
    id: number;
    points: number;
    type: LoyaltyTransactionType;
    description: string | null;
    createdAt: Date;
  }[];
}

/**
 * Get current user's loyalty info
 */
export async function getLoyaltyInfoAction(): Promise<{ success: boolean; data?: LoyaltyInfo; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const userId = Number(session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        loyaltyPoints: true,
        loyaltyTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            points: true,
            type: true,
            description: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return {
      success: true,
      data: {
        points: user.loyaltyPoints,
        pointsValue: user.loyaltyPoints * ILS_PER_POINT,
        canRedeem: user.loyaltyPoints >= MIN_POINTS_TO_REDEEM,
        minPointsToRedeem: MIN_POINTS_TO_REDEEM,
        recentTransactions: user.loyaltyTransactions,
      },
    };
  } catch (error) {
    console.error('Error fetching loyalty info:', error);
    return { success: false, error: 'Failed to fetch loyalty info' };
  }
}

/**
 * Calculate how many points will be earned for an order
 */
function calculatePointsForOrder(orderTotal: number): number {
  return Math.floor(orderTotal * POINTS_PER_ILS);
}

/**
 * Calculate discount value for given points
 */
function calculatePointsDiscount(points: number): number {
  return points * ILS_PER_POINT;
}

/**
 * Award points to user after order completion
 * Called from capture-order or order status update
 */
export async function awardOrderPointsAction(
  userId: number,
  orderId: number,
  orderTotal: number
): Promise<{ success: boolean; pointsAwarded?: number; error?: string }> {
  try {
    const pointsToAward = calculatePointsForOrder(orderTotal);

    if (pointsToAward <= 0) {
      return { success: true, pointsAwarded: 0 };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { loyaltyPoints: { increment: pointsToAward } },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          userId,
          points: pointsToAward,
          type: 'EARNED_ORDER',
          description: `Order #${orderId}`,
          orderId,
        },
      }),
    ]);

    return { success: true, pointsAwarded: pointsToAward };
  } catch (error) {
    console.error('Error awarding order points:', error);
    return { success: false, error: 'Failed to award points' };
  }
}

/**
 * Spend points for discount at checkout
 */
export async function spendPointsAction(
  pointsToSpend: number
): Promise<{ success: boolean; discount?: number; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const userId = Number(session.user.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { loyaltyPoints: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (pointsToSpend < MIN_POINTS_TO_REDEEM) {
      return { success: false, error: `Minimum ${MIN_POINTS_TO_REDEEM} points required` };
    }

    if (user.loyaltyPoints < pointsToSpend) {
      return { success: false, error: 'Insufficient points' };
    }

    const discount = calculatePointsDiscount(pointsToSpend);

    // We'll actually deduct points when order is confirmed
    // For now, just validate and return the discount amount
    return { success: true, discount };
  } catch (error) {
    console.error('Error spending points:', error);
    return { success: false, error: 'Failed to process points' };
  }
}

/**
 * Deduct points after successful order (called from capture-order)
 */
export async function deductPointsForOrderAction(
  userId: number,
  orderId: number,
  pointsToDeduct: number
): Promise<{ success: boolean; error?: string }> {
  if (pointsToDeduct <= 0) {
    return { success: true };
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { loyaltyPoints: { decrement: pointsToDeduct } },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          userId,
          points: -pointsToDeduct,
          type: 'SPENT_DISCOUNT',
          description: `Discount on Order #${orderId}`,
          orderId,
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error deducting points:', error);
    return { success: false, error: 'Failed to deduct points' };
  }
}

/**
 * Admin: Adjust user points manually
 */
export async function adminAdjustPointsAction(
  targetUserId: number,
  points: number,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { loyaltyPoints: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Prevent negative balance
    if (user.loyaltyPoints + points < 0) {
      return { success: false, error: 'Would result in negative balance' };
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: targetUserId },
        data: { loyaltyPoints: { increment: points } },
      }),
      prisma.loyaltyTransaction.create({
        data: {
          userId: targetUserId,
          points,
          type: points > 0 ? 'BONUS' : 'ADMIN_ADJUSTMENT',
          description: reason,
        },
      }),
    ]);

    revalidatePath('/admin/customers');
    return { success: true };
  } catch (error) {
    console.error('Error adjusting points:', error);
    return { success: false, error: 'Failed to adjust points' };
  }
}

/**
 * Get loyalty transaction history for admin
 */
export async function getAdminLoyaltyHistoryAction(userId: number) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized', transactions: [] };
  }

  try {
    const transactions = await prisma.loyaltyTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, transactions };
  } catch (error) {
    console.error('Error fetching loyalty history:', error);
    return { success: false, error: 'Failed to fetch history', transactions: [] };
  }
}

// Constants are exported from @/lib/loyalty-config
