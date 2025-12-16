'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { hashSync } from 'bcrypt';
import { prisma } from '../../../../prisma/prisma-client';

export interface StaffMember {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  _count: {
    orders: number;
    kitchenOrders: number;
    courierOrders: number;
  };
}

export interface StaffFilters {
  query?: string;
  role?: UserRole | 'ALL' | 'STAFF';
}

export async function getStaffAction(filters?: StaffFilters): Promise<StaffMember[]> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return [];
  }

  try {
    const whereClause: Record<string, unknown> = {};

    // Role filter
    if (filters?.role === 'STAFF') {
      whereClause.role = { in: ['ADMIN', 'KITCHEN', 'COURIER'] };
    } else if (filters?.role && filters.role !== 'ALL') {
      whereClause.role = filters.role;
    }

    // Search filter
    if (filters?.query) {
      whereClause.OR = [
        { fullName: { contains: filters.query, mode: 'insensitive' } },
        { email: { contains: filters.query, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            kitchenOrders: true,
            courierOrders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return users;
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    return [];
  }
}

export async function getStaffStatsAction(): Promise<{
  admins: number;
  kitchen: number;
  couriers: number;
  users: number;
  total: number;
}> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return { admins: 0, kitchen: 0, couriers: 0, users: 0, total: 0 };
  }

  try {
    const [admins, kitchen, couriers, users] = await Promise.all([
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'KITCHEN' } }),
      prisma.user.count({ where: { role: 'COURIER' } }),
      prisma.user.count({ where: { role: 'USER' } }),
    ]);

    return {
      admins,
      kitchen,
      couriers,
      users,
      total: admins + kitchen + couriers + users,
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { admins: 0, kitchen: 0, couriers: 0, users: 0, total: 0 };
  }
}

export async function updateUserRoleAction(
  userId: number,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  if (Number(session.user.id) === userId) {
    return { success: false, error: 'Cannot change your own role' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath('/admin/staff');
    return { success: true };
  } catch (error) {
    console.error('Failed to update user role:', error);
    return { success: false, error: 'Failed to update role' };
  }
}

export async function createStaffAction(data: {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<{ success: boolean; error?: string }> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== 'ADMIN') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already exists' };
    }

    await prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        password: hashSync(data.password, 10),
        role: data.role,
        verified: new Date(),
      },
    });

    revalidatePath('/admin/staff');
    return { success: true };
  } catch (error) {
    console.error('Failed to create staff:', error);
    return { success: false, error: 'Failed to create staff member' };
  }
}
