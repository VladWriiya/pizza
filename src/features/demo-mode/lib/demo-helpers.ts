import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const DEMO_EXPIRATION_MINUTES = 5;

export type ActionResult<T = unknown> =
  | { success: true; message: string } & T
  | { success: false; error: string };

export async function checkAdminAuth(): Promise<
  | { authorized: true; userId: number }
  | { authorized: false; error: string }
> {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== 'ADMIN') {
    return { authorized: false, error: 'Unauthorized' };
  }

  const userId = typeof session.user.id === 'string'
    ? parseInt(session.user.id, 10)
    : session.user.id;

  return { authorized: true, userId };
}

export function generateDemoToken(scenario: string): string {
  return `demo-${scenario}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
