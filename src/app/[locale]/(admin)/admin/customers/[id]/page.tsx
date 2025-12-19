import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCustomerDetailsAction } from '@/app/[locale]/actions/customer';
import { CustomerHeader } from './_components/CustomerHeader';
import { CustomerStats } from './_components/CustomerStats';
import { CustomerOrderHistory } from './_components/CustomerOrderHistory';
import { LoyaltyManagement } from './_components/LoyaltyManagement';

interface Props {
  params: { id: string };
}

export default async function CustomerDetailPage({ params }: Props) {
  const customerId = parseInt(params.id, 10);

  if (isNaN(customerId)) {
    notFound();
  }

  const customer = await getCustomerDetailsAction(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/customers"
        className="pz-inline-flex pz-items-center pz-gap-2 pz-text-gray-600 hover:pz-text-gray-900 pz-mb-4"
      >
        <ArrowLeft className="pz-w-4 pz-h-4" />
        Back to Customers
      </Link>

      <CustomerHeader customer={customer} />

      <div className="pz-grid pz-grid-cols-1 lg:pz-grid-cols-3 pz-gap-6 pz-mt-6">
        <div className="lg:pz-col-span-2">
          <CustomerStats customer={customer} />
          <CustomerOrderHistory orders={customer.orders} />
        </div>
        <div className="lg:pz-col-span-1">
          <LoyaltyManagement userId={customer.id} currentPoints={customer.loyaltyPoints} />
        </div>
      </div>
    </div>
  );
}
