import { ClipboardList, Clock, CheckCircle } from 'lucide-react';

interface KitchenStatsProps {
  stats: {
    totalToday: number;
    activeOrders: number;
    completedToday: number;
  };
}

export function KitchenStats({ stats }: KitchenStatsProps) {
  return (
    <div className="pz-grid pz-grid-cols-3 pz-gap-4">
      <div className="pz-bg-white pz-rounded-xl pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-4">
        <div className="pz-bg-blue-100 pz-p-3 pz-rounded-lg">
          <ClipboardList className="pz-text-blue-600" size={24} />
        </div>
        <div>
          <p className="pz-text-sm pz-text-gray-500">Today&apos;s Orders</p>
          <p className="pz-text-2xl pz-font-bold">{stats.totalToday}</p>
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-4">
        <div className="pz-bg-orange-100 pz-p-3 pz-rounded-lg">
          <Clock className="pz-text-orange-600" size={24} />
        </div>
        <div>
          <p className="pz-text-sm pz-text-gray-500">Active Orders</p>
          <p className="pz-text-2xl pz-font-bold">{stats.activeOrders}</p>
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-4">
        <div className="pz-bg-green-100 pz-p-3 pz-rounded-lg">
          <CheckCircle className="pz-text-green-600" size={24} />
        </div>
        <div>
          <p className="pz-text-sm pz-text-gray-500">Completed Today</p>
          <p className="pz-text-2xl pz-font-bold">{stats.completedToday}</p>
        </div>
      </div>
    </div>
  );
}
