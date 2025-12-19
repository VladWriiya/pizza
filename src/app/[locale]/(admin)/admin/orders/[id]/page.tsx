import { Heading } from '@/shared/Heading';
import { notFound } from 'next/navigation';
import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { OrderItemList, OrderItemData } from '@/shared/ui';
import { UpdateStatusForm } from './_components/UpdateStatusForm';
import { LargeOrderApprovalPanel } from './_components/LargeOrderApprovalPanel';
import { NoCourierPanel } from './_components/NoCourierPanel';
import { RefundPanel } from './_components/RefundPanel';
import { CancelOrderPanel } from './_components/CancelOrderPanel';
import { prisma } from '../../../../../../../prisma/prisma-client';


interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const orderId = Number(params.id);
  if (isNaN(orderId)) {
    return notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    return notFound();
  }

  const items = JSON.parse(order.items as string) as OrderItemData[];

  return (
    <div>
      <div className="pz-flex pz-items-center pz-gap-3">
        <Heading level="1">Order #{order.id}</Heading>
        {order.isDemo && (
          <span className="pz-px-3 pz-py-1 pz-bg-purple-200 pz-text-purple-800 pz-rounded-full pz-text-sm pz-font-semibold">
            DEMO
          </span>
        )}
      </div>

      {/* Demo scenario panels */}
      <div className="pz-mt-6">
        <LargeOrderApprovalPanel
          orderId={order.id}
          demoScenario={order.demoScenario}
          status={order.status}
          itemsCount={items.length}
        />
        <NoCourierPanel
          orderId={order.id}
          status={order.status}
          courierUserId={order.courierUserId}
          prepStartedAt={order.prepStartedAt}
        />
      </div>

      <div className="pz-mt-8 pz-grid pz-grid-cols-3 pz-gap-8">
        <div className="pz-col-span-2 pz-space-y-6">
          <div className="pz-bg-white pz-p-6 pz-rounded-lg">
            <h2 className="pz-text-lg pz-font-semibold pz-mb-4">Order Items</h2>
            <OrderItemList items={items} />
          </div>
        </div>

        <div className="pz-col-span-1 pz-space-y-6">
          <div className="pz-bg-white pz-p-6 pz-rounded-lg">
            <h2 className="pz-text-lg pz-font-semibold">Manage Order</h2>
            <div className="pz-mt-4 pz-space-y-2">
              <div className="pz-flex pz-justify-between"><span className="pz-text-gray-500">Current Status:</span> <Badge>{order.status}</Badge></div>
              <UpdateStatusForm orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
          <div className="pz-bg-white pz-p-6 pz-rounded-lg">
            <h2 className="pz-text-lg pz-font-semibold">Customer Details</h2>
            <div className="pz-mt-4 pz-space-y-2">
              <div className="pz-flex pz-justify-between"><span className="pz-text-gray-500">Full Name:</span> <b>{order.fullName}</b></div>
              <div className="pz-flex pz-justify-between"><span className="pz-text-gray-500">Email:</span> <span>{order.email}</span></div>
              <div className="pz-flex pz-justify-between"><span className="pz-text-gray-500">Phone:</span> <span>{order.phone}</span></div>
              <div>
                <p className="pz-text-gray-500">Address:</p>
                <p>{order.address}</p>
              </div>
            </div>
          </div>

          <RefundPanel
            orderId={order.id}
            totalAmount={order.totalAmount}
            refundedAmount={order.refundedAmount}
            paymentId={order.paymentId}
            isDemo={order.isDemo}
            status={order.status}
          />

          <CancelOrderPanel
            orderId={order.id}
            status={order.status}
          />
        </div>
      </div>
    </div>
  );
}