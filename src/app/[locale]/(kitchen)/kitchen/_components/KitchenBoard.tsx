'use client';

import { Order } from '@prisma/client';
import { KitchenOrderCard } from './KitchenOrderCard';

interface KitchenBoardProps {
  newOrders: Order[];
  preparingOrders: Order[];
  readyOrders: Order[];
}

interface ColumnProps {
  title: string;
  count: number;
  orders: Order[];
  status: 'new' | 'preparing' | 'ready';
  bgColor: string;
  borderColor: string;
}

function Column({ title, count, orders, status, bgColor, borderColor }: ColumnProps) {
  return (
    <div className={`pz-flex pz-flex-col pz-rounded-xl ${bgColor} pz-p-4 pz-min-h-[600px]`}>
      <div className={`pz-flex pz-items-center pz-justify-between pz-mb-4 pz-pb-3 pz-border-b-2 ${borderColor}`}>
        <h2 className="pz-text-lg pz-font-bold">{title}</h2>
        <span className="pz-bg-white pz-px-3 pz-py-1 pz-rounded-full pz-text-sm pz-font-semibold">
          {count}
        </span>
      </div>
      <div className="pz-space-y-3 pz-overflow-y-auto pz-flex-1">
        {orders.length === 0 ? (
          <p className="pz-text-center pz-text-gray-500 pz-py-8">No orders</p>
        ) : (
          orders.map((order) => (
            <KitchenOrderCard key={order.id} order={order} status={status} />
          ))
        )}
      </div>
    </div>
  );
}

export function KitchenBoard({ newOrders, preparingOrders, readyOrders }: KitchenBoardProps) {
  return (
    <div className="pz-grid pz-grid-cols-3 pz-gap-6">
      <Column
        title="🆕 New Orders"
        count={newOrders.length}
        orders={newOrders}
        status="new"
        bgColor="pz-bg-blue-50"
        borderColor="pz-border-blue-300"
      />
      <Column
        title="🔥 Preparing"
        count={preparingOrders.length}
        orders={preparingOrders}
        status="preparing"
        bgColor="pz-bg-orange-50"
        borderColor="pz-border-orange-300"
      />
      <Column
        title="✅ Ready"
        count={readyOrders.length}
        orders={readyOrders}
        status="ready"
        bgColor="pz-bg-green-50"
        borderColor="pz-border-green-300"
      />
    </div>
  );
}
