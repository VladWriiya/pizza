import { Heading } from '@/shared/Heading';
import { getCustomersAction, type SortField, type SortOrder } from '@/app/[locale]/actions/customer';
import { CustomerSearch } from './_components/CustomerSearch';
import { CustomerTable } from './_components/CustomerTable';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { BarChart3 } from 'lucide-react';

interface Props {
  searchParams?: {
    query?: string;
    sortBy?: string;
    order?: string;
  };
}

export default async function CustomersPage({ searchParams }: Props) {
  const query = searchParams?.query || '';
  const sortBy = (searchParams?.sortBy as SortField) || 'lastOrder';
  const sortOrder = (searchParams?.order as SortOrder) || 'desc';

  const customers = await getCustomersAction(query, sortBy, sortOrder);

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-6">
        <Heading level="1">Customers ({customers.length})</Heading>
        <div className="pz-flex pz-items-center pz-gap-3">
          <Link href="/admin/customers/analytics">
            <Button variant="outline" className="pz-gap-2">
              <BarChart3 size={16} />
              Analytics
            </Button>
          </Link>
          <CustomerSearch />
        </div>
      </div>

      <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
