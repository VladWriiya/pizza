'use server';

import { getSystemSettingsAction } from './get-settings.action';

export async function isRestaurantOpenAction() {
  try {
    const result = await getSystemSettingsAction();
    if (!result.success || !result.settings) {
      return { success: true, isOpen: true };
    }

    const settings = result.settings;

    // Check emergency closure first
    if (settings.emergencyClosureActive) {
      return {
        success: true,
        isOpen: false,
        reason: 'emergency',
        message: settings.emergencyClosureMessage || 'Restaurant is temporarily closed',
      };
    }

    // Check operating hours (Israel timezone)
    const now = new Date();
    const israelTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' }));
    const hours = israelTime.getHours().toString().padStart(2, '0');
    const minutes = israelTime.getMinutes().toString().padStart(2, '0');
    const currentTimeStr = `${hours}:${minutes}`;

    const openTime = settings.openTime || '09:00';
    const lastOrderTime = settings.lastOrderTime || settings.closeTime || '22:00';

    if (currentTimeStr < openTime) {
      return {
        success: true,
        isOpen: false,
        reason: 'closed',
        message: `We open at ${openTime}`,
        openTime,
      };
    }

    if (currentTimeStr > lastOrderTime) {
      return {
        success: true,
        isOpen: false,
        reason: 'closed',
        message: `Last orders at ${lastOrderTime}. We open again at ${openTime}`,
        openTime,
      };
    }

    return { success: true, isOpen: true };
  } catch (error) {
    console.error('Failed to check restaurant status:', error);
    return { success: true, isOpen: true };
  }
}
