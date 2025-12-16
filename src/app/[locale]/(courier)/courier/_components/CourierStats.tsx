import { Package, Truck } from 'lucide-react';

interface CourierStatsProps {
  stats: {
    deliveriesToday: number;
    activeDeliveries: number;
  };
}

export function CourierStats({ stats }: CourierStatsProps) {
  return (
    <div className="pz-grid pz-grid-cols-2 pz-gap-2 sm:pz-gap-4">
      <div className="pz-bg-white pz-rounded-xl pz-p-3 sm:pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-2 sm:pz-gap-4">
        <div className="pz-bg-green-100 pz-p-2 sm:pz-p-3 pz-rounded-lg">
          <Package className="pz-text-green-600 pz-w-5 pz-h-5 sm:pz-w-6 sm:pz-h-6" />
        </div>
        <div>
          <p className="pz-text-xs sm:pz-text-sm pz-text-gray-500">Today</p>
          <p className="pz-text-xl sm:pz-text-2xl pz-font-bold">{stats.deliveriesToday}</p>
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-p-3 sm:pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-2 sm:pz-gap-4">
        <div className="pz-bg-blue-100 pz-p-2 sm:pz-p-3 pz-rounded-lg">
          <Truck className="pz-text-blue-600 pz-w-5 pz-h-5 sm:pz-w-6 sm:pz-h-6" />
        </div>
        <div>
          <p className="pz-text-xs sm:pz-text-sm pz-text-gray-500">Active</p>
          <p className="pz-text-xl sm:pz-text-2xl pz-font-bold">{stats.activeDeliveries}</p>
        </div>
      </div>
    </div>
  );
}
