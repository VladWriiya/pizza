'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { OrderStatus } from '@prisma/client';

export type SortField = 'name' | 'orderCount' | 'totalSpent' | 'lastOrder';
export type SortOrder = 'asc' | 'desc';

export interface CustomerListItem {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  createdAt: Date;
}

/**
 * Get all customers with aggregated order stats
 */
export async function getCustomersAction(
  search?: string,
  sortBy: SortField = 'lastOrder',
  sortOrder: SortOrder = 'desc'
): Promise<CustomerListItem[]> {
  try {
    // Get all USER role users
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        isDemo: false,
        ...(search && {
          OR: [
            { fullName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        orders: {
          where: { isDemo: false },
          select: {
            totalAmount: true,
            status: true,
            createdAt: true,
            phone: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Transform to CustomerListItem with aggregations
    const customers: CustomerListItem[] = users.map((user) => {
      const completedOrders = user.orders.filter(
        (o) => o.status === OrderStatus.DELIVERED
      );
      const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const lastOrder = user.orders[0];

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: lastOrder?.phone || null,
        orderCount: user.orders.length,
        totalSpent,
        lastOrderDate: lastOrder?.createdAt || null,
        createdAt: user.createdAt,
      };
    });

    // Sort
    customers.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.fullName.localeCompare(b.fullName);
          break;
        case 'orderCount':
          comparison = a.orderCount - b.orderCount;
          break;
        case 'totalSpent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'lastOrder':
          const aDate = a.lastOrderDate?.getTime() || 0;
          const bDate = b.lastOrderDate?.getTime() || 0;
          comparison = aDate - bDate;
          break;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return customers;
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return [];
  }
}

export interface CustomerDetail {
  id: number;
  fullName: string;
  email: string;
  createdAt: Date;
  orderCount: number;
  totalSpent: number;
  averageOrder: number;
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  itemsCount: number;
}

/**
 * Get customer details with order history
 */
export async function getCustomerDetailsAction(userId: number): Promise<CustomerDetail | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        orders: {
          where: { isDemo: false },
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            items: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) return null;

    const completedOrders = user.orders.filter(
      (o) => o.status === OrderStatus.DELIVERED
    );
    const totalSpent = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      orderCount: user.orders.length,
      totalSpent,
      averageOrder: completedOrders.length > 0 ? Math.round(totalSpent / completedOrders.length) : 0,
      orders: user.orders.map((order) => {
        const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
        return {
          id: order.id,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
          itemsCount: Array.isArray(items) ? items.length : 0,
        };
      }),
    };
  } catch (error) {
    console.error('Failed to fetch customer details:', error);
    return null;
  }
}
