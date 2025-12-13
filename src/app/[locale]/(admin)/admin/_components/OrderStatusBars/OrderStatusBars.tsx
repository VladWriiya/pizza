import { StatusBar } from './StatusBar';

interface OrderStatusBarsProps {
  ordersByStatus: Record<string, number>;
}

const STATUS_CONFIG = [
  { key: 'PENDING', label: 'Pending', color: 'pz-bg-yellow-500' },
  { key: 'CONFIRMED', label: 'Confirmed', color: 'pz-bg-blue-500' },
  { key: 'PREPARING', label: 'Preparing', color: 'pz-bg-orange-500' },
  { key: 'READY', label: 'Ready', color: 'pz-bg-green-500' },
  { key: 'DELIVERING', label: 'Delivering', color: 'pz-bg-purple-500' },
];

export function OrderStatusBars({ ordersByStatus }: OrderStatusBarsProps) {
  const maxCount = Math.max(...Object.values(ordersByStatus), 1);
  const totalActive = Object.values(ordersByStatus).reduce((sum, count) => sum + count, 0);

  if (totalActive === 0) {
    return null;
  }

  return (
    <div className="pz-bg-white pz-p-6 pz-rounded-lg pz-shadow-sm pz-mt-6">
      <h2 className="pz-text-lg pz-font-semibold pz-mb-4">
        Active Orders by Status
        <span className="pz-text-sm pz-font-normal pz-text-gray-500 pz-ms-2">
          ({totalActive} total)
        </span>
      </h2>
      <div className="pz-space-y-3">
        {STATUS_CONFIG.map(({ key, label, color }) => (
          <StatusBar
            key={key}
            label={label}
            count={ordersByStatus[key] || 0}
            color={color}
            maxCount={maxCount}
          />
        ))}
      </div>
    </div>
  );
}
