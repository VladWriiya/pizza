import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCustomerDetailsAction } from '@/app/[locale]/actions/customer';
import { CustomerHeader } from './_components/CustomerHeader';
import { CustomerStats } from './_components/CustomerStats';
import { CustomerOrderHistory } from './_components/CustomerOrderHistory';

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
      <CustomerStats customer={customer} />
      <CustomerOrderHistory orders={customer.orders} />
    </div>
  );
}
