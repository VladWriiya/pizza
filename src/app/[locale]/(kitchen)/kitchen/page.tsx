import { getKitchenOrdersAction, getKitchenStatsAction } from '@/features/order-management';
import { KitchenPageClient } from './_components/KitchenPageClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function KitchenPage() {
  const [ordersResult, statsResult] = await Promise.all([
    getKitchenOrdersAction(),
    getKitchenStatsAction(),
  ]);

  if (!ordersResult.success) {
    return (
      <div className="pz-text-center pz-py-10">
        <p className="pz-text-red-500">Error loading orders: {ordersResult.error}</p>
      </div>
    );
  }

  const orders = ordersResult.orders;
  const stats = statsResult.success ? statsResult.stats ?? null : null;

  return (
    <KitchenPageClient
      initialOrders={orders}
      initialStats={stats}
    />
  );
}
