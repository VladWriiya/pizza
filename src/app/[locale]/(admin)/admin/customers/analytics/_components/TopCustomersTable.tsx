import { Link } from '@/i18n/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Crown } from 'lucide-react';
import type { TopCustomer } from '@/app/[locale]/actions/customer';

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

export function TopCustomersTable({ customers }: TopCustomersTableProps) {
  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
      <h3 className="pz-text-lg pz-font-semibold pz-text-gray-800 pz-mb-4 pz-flex pz-items-center pz-gap-2">
        <Crown size={20} className="pz-text-yellow-500" />
        Top 10 Customers by Revenue
      </h3>
      <div className="pz-overflow-auto pz-max-h-64">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pz-w-10">#</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="pz-text-right">Orders</TableHead>
              <TableHead className="pz-text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="pz-font-medium">
                    {index < 3 ? (
                      <span className={`pz-inline-flex pz-items-center pz-justify-center pz-w-6 pz-h-6 pz-rounded-full pz-text-xs pz-font-bold ${
                        index === 0 ? 'pz-bg-yellow-100 pz-text-yellow-700' :
                        index === 1 ? 'pz-bg-gray-100 pz-text-gray-700' :
                        'pz-bg-orange-100 pz-text-orange-700'
                      }`}>
                        {index + 1}
                      </span>
                    ) : (
                      <span className="pz-text-gray-400">{index + 1}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/customers/${customer.id}`} className="hover:pz-text-primary">
                      <div className="pz-font-medium">{customer.fullName}</div>
                      <div className="pz-text-xs pz-text-gray-500">{customer.email}</div>
                    </Link>
                  </TableCell>
                  <TableCell className="pz-text-right">{customer.orderCount}</TableCell>
                  <TableCell className="pz-text-right pz-font-semibold">
                    {customer.totalSpent} ₪
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="pz-text-center pz-text-gray-500 pz-py-8">
                  No customer data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
