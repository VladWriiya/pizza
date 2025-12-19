import { Heading } from '@/shared/Heading';
import { getCustomerAnalyticsAction } from '@/app/[locale]/actions/customer';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, Users, UserPlus, Repeat, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';
import { CustomerGrowthChart } from './_components/CustomerGrowthChart';
import { TopCustomersTable } from './_components/TopCustomersTable';

export default async function CustomerAnalyticsPage() {
  const analytics = await getCustomerAnalyticsAction();

  return (
    <div>
      <div className="pz-flex pz-items-center pz-gap-4 pz-mb-6">
        <Link href="/admin/customers">
          <Button variant="ghost" size="sm">
            <ArrowLeft size={16} className="pz-me-2" />
            Back to Customers
          </Button>
        </Link>
        <Heading level="1">Customer Analytics</Heading>
      </div>

      {/* Stats Cards */}
      <div className="pz-grid pz-grid-cols-2 md:pz-grid-cols-3 lg:pz-grid-cols-6 pz-gap-4 pz-mb-8">
        <StatCard
          title="Total Customers"
          value={analytics.totalCustomers}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="New This Month"
          value={analytics.newCustomersThisMonth}
          icon={<UserPlus size={20} />}
          color="green"
        />
        <StatCard
          title="Repeat Customers"
          value={analytics.repeatCustomers}
          icon={<Repeat size={20} />}
          color="purple"
        />
        <StatCard
          title="Repeat Rate"
          value={`${analytics.repeatRate}%`}
          icon={<TrendingUp size={20} />}
          color="orange"
        />
        <StatCard
          title="Avg Order Value"
          value={`${analytics.averageOrderValue} ₪`}
          icon={<DollarSign size={20} />}
          color="emerald"
        />
        <StatCard
          title="Avg Orders/Customer"
          value={analytics.averageOrdersPerCustomer}
          icon={<ShoppingCart size={20} />}
          color="pink"
        />
      </div>

      {/* Charts */}
      <div className="pz-grid pz-grid-cols-1 lg:pz-grid-cols-2 pz-gap-6 pz-mb-8">
        <CustomerGrowthChart data={analytics.customersByMonth} />
        <TopCustomersTable customers={analytics.topCustomers} />
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'emerald' | 'pink';
}

const colorClasses = {
  blue: 'pz-bg-blue-50 pz-text-blue-600',
  green: 'pz-bg-green-50 pz-text-green-600',
  purple: 'pz-bg-purple-50 pz-text-purple-600',
  orange: 'pz-bg-orange-50 pz-text-orange-600',
  emerald: 'pz-bg-emerald-50 pz-text-emerald-600',
  pink: 'pz-bg-pink-50 pz-text-pink-600',
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-4">
      <div className={`pz-w-10 pz-h-10 pz-rounded-lg pz-flex pz-items-center pz-justify-center pz-mb-3 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="pz-text-2xl pz-font-bold pz-text-gray-900">{value}</p>
      <p className="pz-text-sm pz-text-gray-500">{title}</p>
    </div>
  );
}
