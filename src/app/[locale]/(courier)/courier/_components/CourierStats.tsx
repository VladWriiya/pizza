import { Package, Truck } from 'lucide-react';

interface CourierStatsProps {
  stats: {
    deliveriesToday: number;
    activeDeliveries: number;
  };
}

export function CourierStats({ stats }: CourierStatsProps) {
  return (
    <div className="pz-grid pz-grid-cols-2 pz-gap-4">
      <div className="pz-bg-white pz-rounded-xl pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-4">
        <div className="pz-bg-green-100 pz-p-3 pz-rounded-lg">
          <Package className="pz-text-green-600" size={24} />
        </div>
        <div>
          <p className="pz-text-sm pz-text-gray-500">Delivered Today</p>
          <p className="pz-text-2xl pz-font-bold">{stats.deliveriesToday}</p>
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-p-4 pz-shadow-sm pz-flex pz-items-center pz-gap-4">
        <div className="pz-bg-blue-100 pz-p-3 pz-rounded-lg">
          <Truck className="pz-text-blue-600" size={24} />
        </div>
        <div>
          <p className="pz-text-sm pz-text-gray-500">Active Deliveries</p>
          <p className="pz-text-2xl pz-font-bold">{stats.activeDeliveries}</p>
        </div>
      </div>
    </div>
  );
}
