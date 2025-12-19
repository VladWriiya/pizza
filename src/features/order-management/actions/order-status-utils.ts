'use server';

import { OrderStatus, Prisma } from '@prisma/client';

/**
 * Add entry to order status history
 */
export function addStatusHistoryEntry(
  currentHistory: unknown,
  status: OrderStatus,
  userId?: number,
  note?: string
): Prisma.InputJsonValue {
  const history = Array.isArray(currentHistory) ? currentHistory : [];
  return [
    ...history,
    {
      status,
      timestamp: new Date().toISOString(),
      userId,
      note,
    },
  ] as Prisma.InputJsonValue;
}

/**
 * Valid status transitions map
 */
export const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['DELIVERING', 'PREPARING', 'CANCELLED'], // PREPARING for remake
  DELIVERING: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Terminal state
  SUCCEEDED: ['DELIVERED'], // Legacy - can migrate to DELIVERED
  CANCELLED: [], // Terminal state
};

/**
 * Check if transition from one status to another is valid
 */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return validTransitions[from]?.includes(to) || false;
}
