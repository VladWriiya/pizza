import { NextResponse } from 'next/server';
import { cleanupExpiredDemoDataAction } from '@/features/demo-mode';

// This route can be called by a cron job (e.g., Vercel Cron, or external cron service)
// to automatically clean up expired demo data
export async function GET() {
  try {
    const result = await cleanupExpiredDemoDataAction();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Cleaned up ${result.deletedOrders} orders and ${result.deletedUsers} users`,
        deletedOrders: result.deletedOrders,
        deletedUsers: result.deletedUsers,
      });
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  } catch (error) {
    console.error('Demo cleanup API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method for manual trigger
export async function POST() {
  return GET();
}
