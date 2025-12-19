import { Link } from '@/i18n/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Button } from '@/shared/ui';
import { SortableHeader } from './SortableHeader';
import { Gift } from 'lucide-react';
import type { CustomerListItem } from '@/app/[locale]/actions/customer';

interface CustomerTableProps {
  customers: CustomerListItem[];
}

export function CustomerTable({ customers }: CustomerTableProps) {
  if (customers.length === 0) {
    return (
      <div className="pz-text-center pz-py-12 pz-text-gray-500">
        No customers found
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <SortableHeader field="name" label="Name" />
          </TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>
            <SortableHeader field="orderCount" label="Orders" />
          </TableHead>
          <TableHead>
            <SortableHeader field="totalSpent" label="Total Spent" />
          </TableHead>
          <TableHead>
            <div className="pz-flex pz-items-center pz-gap-1">
              <Gift size={14} className="pz-text-purple-600" />
              Points
            </div>
          </TableHead>
          <TableHead>
            <SortableHeader field="lastOrder" label="Last Order" />
          </TableHead>
          <TableHead className="pz-text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="pz-font-medium">{customer.fullName}</TableCell>
            <TableCell className="pz-text-gray-600">{customer.email}</TableCell>
            <TableCell className="pz-text-gray-600">{customer.phone || '—'}</TableCell>
            <TableCell>
              <span className="pz-px-2 pz-py-1 pz-bg-blue-100 pz-text-blue-800 pz-rounded-full pz-text-sm pz-font-medium">
                {customer.orderCount}
              </span>
            </TableCell>
            <TableCell className="pz-font-medium">{customer.totalSpent} ILS</TableCell>
            <TableCell>
              {customer.loyaltyPoints > 0 ? (
                <span className="pz-px-2 pz-py-1 pz-bg-purple-100 pz-text-purple-800 pz-rounded-full pz-text-sm pz-font-medium">
                  {customer.loyaltyPoints}
                </span>
              ) : (
                <span className="pz-text-gray-400">0</span>
              )}
            </TableCell>
            <TableCell className="pz-text-gray-600">
              {customer.lastOrderDate
                ? new Date(customer.lastOrderDate).toLocaleDateString()
                : '—'}
            </TableCell>
            <TableCell className="pz-text-right">
              <Link href={`/admin/customers/${customer.id}`}>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
