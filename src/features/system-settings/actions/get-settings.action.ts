'use server';

import { prisma } from '../../../../prisma/prisma-client';

// Get or create system settings (singleton pattern)
export async function getSystemSettingsAction() {
  try {
    let settings = await prisma.systemSettings.findFirst();

    if (!settings) {
      settings = await prisma.systemSettings.create({
        data: { id: 1 }
      });
    }

    return { success: true, settings };
  } catch (error) {
    console.error('Failed to get system settings:', error);
    return { success: false, error: 'Failed to load settings' };
  }
}
