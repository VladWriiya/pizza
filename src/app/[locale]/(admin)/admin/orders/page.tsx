import React from 'react';

import { Link } from '@/i18n/navigation';
import { OrdersSearch } from './[id]/_components/OrdersSearch';
import { getOrdersAction, getOrderCountsByStatusAction } from '@/app/[locale]/actions/order';
import { Heading } from '@/shared/Heading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui';
import { OrderStatusFilter } from './_components/OrderStatusFilter';
import { OrderStatus } from '@prisma/client';


interface Props {
  searchParams?: {
    query?: string;
    status?: string;
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const query = searchParams?.query || '';
  const statusParam = searchParams?.status as OrderStatus | 'ALL' | undefined;

  const [orders, counts] = await Promise.all([
    getOrdersAction(query, statusParam),
    getOrderCountsByStatusAction(),
  ]);

  const displayedCount = orders.length;
  const statusLabel = statusParam && statusParam !== 'ALL' ? statusParam : 'All';

  return (
    <div>
      <div className="pz-flex pz-items-center pz-justify-between pz-mb-6">
        <Heading level="1">
          Orders ({displayedCount}{statusLabel !== 'All' ? ` ${statusLabel}` : ''})
        </Heading>
        <OrdersSearch />
      </div>

      <OrderStatusFilter counts={counts} />

      <div className="pz-mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pz-text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} className={order.isDemo ? 'pz-bg-purple-50' : ''}>
                <TableCell className="pz-font-medium">
                  <span className="pz-flex pz-items-center pz-gap-2">
                    #{order.id}
                    {order.isDemo && (
                      <span className="pz-px-1.5 pz-py-0.5 pz-bg-purple-200 pz-text-purple-800 pz-rounded pz-text-xs pz-font-semibold">
                        DEMO
                      </span>
                    )}
                  </span>
                </TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.totalAmount} ILS</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
                <TableCell className="pz-text-right pz-space-x-2">
                  <Link href={`/admin/orders/${order.id}`} passHref legacyBehavior>
                    <a>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </a>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}