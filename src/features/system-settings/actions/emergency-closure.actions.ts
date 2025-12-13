'use server';

import { prisma } from '../../../../prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getSystemSettingsAction } from './get-settings.action';

export async function isEmergencyClosureActiveAction() {
  try {
    const result = await getSystemSettingsAction();
    if (!result.success || !result.settings) {
      return { success: true, isActive: false };
    }

    return {
      success: true,
      isActive: result.settings.emergencyClosureActive,
      reason: result.settings.emergencyClosureReason,
      message: result.settings.emergencyClosureMessage,
      until: result.settings.emergencyClosureUntil
    };
  } catch {
    return { success: false, error: 'Failed to check emergency status' };
  }
}

export async function activateEmergencyClosureAction(data: {
  reason: string;
  message: string;
  until?: Date;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const userId = typeof session.user.id === 'string'
      ? parseInt(session.user.id, 10)
      : session.user.id;

    const settings = await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        emergencyClosureActive: true,
        emergencyClosureReason: data.reason,
        emergencyClosureMessage: data.message,
        emergencyClosureUntil: data.until || null,
        emergencyClosureActivatedBy: userId,
        emergencyClosureActivatedAt: new Date(),
      },
      update: {
        emergencyClosureActive: true,
        emergencyClosureReason: data.reason,
        emergencyClosureMessage: data.message,
        emergencyClosureUntil: data.until || null,
        emergencyClosureActivatedBy: userId,
        emergencyClosureActivatedAt: new Date(),
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, settings };
  } catch (error) {
    console.error('Failed to activate emergency closure:', error);
    return { success: false, error: 'Failed to activate emergency closure' };
  }
}

export async function deactivateEmergencyClosureAction() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const settings = await prisma.systemSettings.update({
      where: { id: 1 },
      data: {
        emergencyClosureActive: false,
        emergencyClosureReason: null,
        emergencyClosureMessage: null,
        emergencyClosureUntil: null,
        emergencyClosureActivatedBy: null,
        emergencyClosureActivatedAt: null,
      },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, settings };
  } catch (error) {
    console.error('Failed to deactivate emergency closure:', error);
    return { success: false, error: 'Failed to deactivate emergency closure' };
  }
}

/**
 * Auto-activate emergency closure due to system conditions (no auth required)
 * Used for automatic responses like critical load
 */
export async function autoActivateEmergencyClosureAction(data: {
  reason: string;
  message: string;
  until?: Date;
}) {
  try {
    // Check if already active to avoid overwriting manual closures
    const current = await prisma.systemSettings.findUnique({ where: { id: 1 } });
    if (current?.emergencyClosureActive) {
      return { success: true, alreadyActive: true };
    }

    await prisma.systemSettings.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        emergencyClosureActive: true,
        emergencyClosureReason: data.reason,
        emergencyClosureMessage: data.message,
        emergencyClosureUntil: data.until || null,
        emergencyClosureActivatedAt: new Date(),
      },
      update: {
        emergencyClosureActive: true,
        emergencyClosureReason: data.reason,
        emergencyClosureMessage: data.message,
        emergencyClosureUntil: data.until || null,
        emergencyClosureActivatedAt: new Date(),
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to auto-activate emergency closure:', error);
    return { success: false, error: 'Failed to activate' };
  }
}

export async function extendEmergencyClosureAction(minutes: number = 30) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized' };
    }

    const current = await prisma.systemSettings.findUnique({ where: { id: 1 } });
    if (!current?.emergencyClosureActive) {
      return { success: false, error: 'No active emergency closure' };
    }

    const baseTime = current.emergencyClosureUntil || new Date();
    const newUntil = new Date(baseTime.getTime() + minutes * 60 * 1000);

    const settings = await prisma.systemSettings.update({
      where: { id: 1 },
      data: { emergencyClosureUntil: newUntil },
    });

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    return { success: true, settings, newUntil };
  } catch (error) {
    console.error('Failed to extend emergency closure:', error);
    return { success: false, error: 'Failed to extend emergency closure' };
  }
}
