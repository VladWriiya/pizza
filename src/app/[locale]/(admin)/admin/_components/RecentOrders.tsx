import { Badge } from '@/shared/ui/badge';
import { Order } from '@prisma/client';
import React from 'react';

interface RecentOrdersProps {
  orders: Order[];
}

export const RecentOrders = ({ orders }: RecentOrdersProps) => (
  <div className="pz-mt-10">
    <h2 className="pz-text-xl pz-font-semibold">Recent Orders</h2>
    <div className="pz-bg-white pz-rounded-lg pz-shadow-sm pz-mt-4">
      <ul>
        {orders.map((order, index) => (
          <li
            key={order.id}
            className={`pz-flex pz-items-center pz-justify-between pz-p-4 ${
              index !== orders.length - 1 ? 'pz-border-b' : ''
            }`}
          >
            <div>
              <p className="pz-font-semibold">
                Order #{order.id} - {order.fullName}
              </p>
              <p className="pz-text-sm pz-text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="pz-flex pz-items-center pz-gap-4">
              <span className="pz-font-bold">{order.totalAmount} ILS</span>
              <Badge>{order.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);