import { ShoppingCart, CreditCard, TrendingUp } from 'lucide-react';
import type { CustomerDetail } from '@/app/[locale]/actions/customer';

interface CustomerStatsProps {
  customer: CustomerDetail;
}

export function CustomerStats({ customer }: CustomerStatsProps) {
  const stats = [
    {
      label: 'Total Orders',
      value: customer.orderCount,
      icon: ShoppingCart,
      color: 'pz-bg-blue-100 pz-text-blue-600',
    },
    {
      label: 'Total Spent',
      value: `${customer.totalSpent} ILS`,
      icon: CreditCard,
      color: 'pz-bg-green-100 pz-text-green-600',
    },
    {
      label: 'Average Order',
      value: `${customer.averageOrder} ILS`,
      icon: TrendingUp,
      color: 'pz-bg-orange-100 pz-text-orange-600',
    },
  ];

  return (
    <div className="pz-grid pz-grid-cols-1 md:pz-grid-cols-3 pz-gap-4 pz-mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6 pz-flex pz-items-center pz-gap-4"
        >
          <div className={`pz-p-3 pz-rounded-lg ${stat.color}`}>
            <stat.icon className="pz-w-6 pz-h-6" />
          </div>
          <div>
            <p className="pz-text-sm pz-text-gray-500">{stat.label}</p>
            <p className="pz-text-2xl pz-font-bold pz-text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
