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
  loyaltyPoints: number;
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
        loyaltyPoints: true,
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
        loyaltyPoints: user.loyaltyPoints,
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
  loyaltyPoints: number;
  orders: CustomerOrder[];
}

export interface CustomerOrder {
  id: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  itemsCount: number;
}

// ============ CUSTOMER ANALYTICS ============

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomersThisMonth: number;
  repeatCustomers: number;
  repeatRate: number;
  topCustomers: TopCustomer[];
  customersByMonth: { month: string; newCustomers: number; returningCustomers: number }[];
  averageOrderValue: number;
  averageOrdersPerCustomer: number;
}

export interface TopCustomer {
  id: number;
  fullName: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
}

/**
 * Get customer analytics data
 */
export async function getCustomerAnalyticsAction(): Promise<CustomerAnalytics> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all customers with their orders
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
        isDemo: false,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        orders: {
          where: {
            isDemo: false,
            status: 'DELIVERED',
          },
          select: {
            totalAmount: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const totalCustomers = users.length;
    const newCustomersThisMonth = users.filter(u => u.createdAt >= startOfMonth).length;

    // Customers with more than 1 order
    const customersWithMultipleOrders = users.filter(u => u.orders.length > 1);
    const repeatCustomers = customersWithMultipleOrders.length;
    const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

    // Top customers by total spent
    const topCustomers: TopCustomer[] = users
      .map(u => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        orderCount: u.orders.length,
        totalSpent: u.orders.reduce((sum, o) => sum + o.totalAmount, 0),
        lastOrderDate: u.orders[0]?.createdAt || null,
      }))
      .filter(c => c.orderCount > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    // Customers by month (last 6 months)
    const customersByMonth: { month: string; newCustomers: number; returningCustomers: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthName = monthStart.toLocaleString('en', { month: 'short' });

      const newInMonth = users.filter(u =>
        u.createdAt >= monthStart && u.createdAt <= monthEnd
      ).length;

      // Returning = made order this month but registered before
      const returningInMonth = users.filter(u =>
        u.createdAt < monthStart &&
        u.orders.some(o => o.createdAt >= monthStart && o.createdAt <= monthEnd)
      ).length;

      customersByMonth.push({
        month: monthName,
        newCustomers: newInMonth,
        returningCustomers: returningInMonth,
      });
    }

    // Average metrics
    const allOrders = users.flatMap(u => u.orders);
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const averageOrderValue = allOrders.length > 0 ? Math.round(totalRevenue / allOrders.length) : 0;

    const customersWithOrders = users.filter(u => u.orders.length > 0);
    const averageOrdersPerCustomer = customersWithOrders.length > 0
      ? Math.round((allOrders.length / customersWithOrders.length) * 10) / 10
      : 0;

    return {
      totalCustomers,
      newCustomersThisMonth,
      repeatCustomers,
      repeatRate,
      topCustomers,
      customersByMonth,
      averageOrderValue,
      averageOrdersPerCustomer,
    };
  } catch (error) {
    console.error('Failed to fetch customer analytics:', error);
    return {
      totalCustomers: 0,
      newCustomersThisMonth: 0,
      repeatCustomers: 0,
      repeatRate: 0,
      topCustomers: [],
      customersByMonth: [],
      averageOrderValue: 0,
      averageOrdersPerCustomer: 0,
    };
  }
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
        loyaltyPoints: true,
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
      loyaltyPoints: user.loyaltyPoints,
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
