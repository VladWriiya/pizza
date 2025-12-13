import {
  getAvailableDeliveriesAction,
  getMyActiveDeliveriesAction,
  getCourierStatsAction,
} from '@/features/order-management';
import { CourierPageClient } from './_components/CourierPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CourierPage() {
  const [activeResult, availableResult, statsResult] = await Promise.all([
    getMyActiveDeliveriesAction(),
    getAvailableDeliveriesAction(),
    getCourierStatsAction(),
  ]);

  if (!activeResult.success || !availableResult.success) {
    return (
      <div className="pz-text-center pz-py-10">
        <p className="pz-text-red-500">Error loading orders</p>
      </div>
    );
  }

  const activeDeliveries = activeResult.orders;
  const availableOrders = availableResult.orders;
  const stats = statsResult.success ? statsResult.stats ?? null : null;

  return (
    <CourierPageClient
      initialActiveDeliveries={activeDeliveries}
      initialAvailableOrders={availableOrders}
      initialStats={stats}
    />
  );
}
