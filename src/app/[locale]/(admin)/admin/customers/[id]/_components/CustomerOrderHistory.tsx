import { Link } from '@/i18n/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui';
import type { CustomerOrder } from '@/app/[locale]/actions/customer';

interface CustomerOrderHistoryProps {
  orders: CustomerOrder[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'pz-bg-yellow-100 pz-text-yellow-800',
  CONFIRMED: 'pz-bg-blue-100 pz-text-blue-800',
  PREPARING: 'pz-bg-orange-100 pz-text-orange-800',
  READY: 'pz-bg-purple-100 pz-text-purple-800',
  DELIVERING: 'pz-bg-indigo-100 pz-text-indigo-800',
  DELIVERED: 'pz-bg-green-100 pz-text-green-800',
  SUCCEEDED: 'pz-bg-green-100 pz-text-green-800',
  CANCELLED: 'pz-bg-red-100 pz-text-red-800',
};

export function CustomerOrderHistory({ orders }: CustomerOrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
        <h3 className="pz-text-lg pz-font-semibold pz-mb-4">Order History</h3>
        <p className="pz-text-gray-500 pz-text-center pz-py-8">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="pz-bg-white pz-rounded-xl pz-shadow-sm pz-p-6">
      <h3 className="pz-text-lg pz-font-semibold pz-mb-4">Order History ({orders.length})</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="pz-text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="pz-font-medium">#{order.id}</TableCell>
              <TableCell className="pz-text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{order.itemsCount} items</TableCell>
              <TableCell className="pz-font-medium">{order.totalAmount} ILS</TableCell>
              <TableCell>
                <Badge className={STATUS_COLORS[order.status] || ''}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="pz-text-right">
                <Link href={`/admin/orders/${order.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
