import { getOrderForTrackingAction } from '@/features/order-management';
import { Container } from '@/shared/container';
import { Heading } from '@/shared/Heading';
import { OrderStatusTimeline } from './_components/OrderStatusTimeline';
import { OrderDetails } from './_components/OrderDetails';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderTrackingPage({ params, searchParams }: PageProps) {
  const { orderId } = await params;
  const { token } = await searchParams;

  const orderIdNum = parseInt(orderId, 10);
  if (isNaN(orderIdNum)) {
    notFound();
  }

  const result = await getOrderForTrackingAction(orderIdNum, token);

  if (!result.success || !result.order) {
    notFound();
  }

  const order = result.order;

  // Get status message based on current status
  const statusMessages: Record<string, string> = {
    PENDING: 'Order is being processed...',
    CONFIRMED: 'Order confirmed! Sent to kitchen.',
    PREPARING: 'Your order is being prepared with care 👨‍🍳',
    READY: 'Your order is ready and waiting for pickup!',
    DELIVERING: 'Your order is on the way! 🚗',
    DELIVERED: 'Order delivered! Enjoy your meal! 🎉',
    SUCCEEDED: 'Order completed successfully! 🎉',
    CANCELLED: 'Order was cancelled.',
  };

  return (
    <Container className="pz-py-10">
      <div className="pz-max-w-2xl pz-mx-auto">
        {/* Header */}
        <div className="pz-text-center pz-mb-8">
          <Heading level="1" className="pz-mb-2">
            Order #{order.id}
          </Heading>
          <p className="pz-text-xl pz-text-gray-600">
            {statusMessages[order.status] || 'Processing...'}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="pz-bg-white pz-rounded-2xl pz-shadow-md pz-p-6 pz-mb-6">
          <OrderStatusTimeline
            status={order.status}
            prepStartedAt={order.prepStartedAt}
            prepEstimatedMinutes={order.prepEstimatedMinutes}
            deliveryStartedAt={order.deliveryStartedAt}
            deliveryEstimatedMinutes={order.deliveryEstimatedMinutes}
          />
        </div>

        {/* Order Details */}
        <OrderDetails order={order} />

        {/* Auto-refresh notice */}
        <p className="pz-text-center pz-text-sm pz-text-gray-400 pz-mt-6">
          This page updates automatically every 30 seconds
        </p>

        {/* Auto-refresh script */}
        <AutoRefresh />
      </div>
    </Container>
  );
}

function AutoRefresh() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          setTimeout(function() {
            window.location.reload();
          }, 30000);
        `,
      }}
    />
  );
}
