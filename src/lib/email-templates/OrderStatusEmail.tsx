import * as React from 'react';

type OrderStatus = 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';

interface OrderStatusEmailProps {
  fullName: string;
  orderId: number;
  status: OrderStatus;
  orderLink: string;
}

const statusMessages: Record<OrderStatus, { title: string; message: string; emoji: string }> = {
  CONFIRMED: {
    title: 'Order Confirmed!',
    message: 'Your order has been confirmed and will be prepared shortly.',
    emoji: '✅',
  },
  PREPARING: {
    title: 'Your Order is Being Prepared',
    message: 'Our chefs are now preparing your delicious pizza!',
    emoji: '👨‍🍳',
  },
  READY: {
    title: 'Order Ready for Delivery',
    message: 'Your order is ready and waiting for a courier.',
    emoji: '📦',
  },
  DELIVERING: {
    title: 'Order On Its Way!',
    message: 'A courier has picked up your order and is heading to you.',
    emoji: '🚗',
  },
  DELIVERED: {
    title: 'Order Delivered!',
    message: 'Your order has been delivered. Enjoy your meal!',
    emoji: '🎉',
  },
  CANCELLED: {
    title: 'Order Cancelled',
    message: 'Your order has been cancelled. If you have questions, please contact us.',
    emoji: '❌',
  },
};

export const OrderStatusEmail: React.FC<OrderStatusEmailProps> = ({
  fullName,
  orderId,
  status,
  orderLink,
}) => {
  const statusInfo = statusMessages[status];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f97316', padding: '20px', textAlign: 'center' as const }}>
        <h1 style={{ color: 'white', margin: 0 }}>Collibri Pizza</h1>
      </div>

      <div style={{ padding: '30px', backgroundColor: '#ffffff' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: '20px' }}>
          <span style={{ fontSize: '48px' }}>{statusInfo.emoji}</span>
        </div>

        <h2 style={{ color: '#333', marginBottom: '10px', textAlign: 'center' as const }}>
          {statusInfo.title}
        </h2>

        <p style={{ color: '#666', lineHeight: '1.6', textAlign: 'center' as const }}>
          Hello {fullName},
        </p>

        <p style={{ color: '#666', lineHeight: '1.6', textAlign: 'center' as const }}>
          {statusInfo.message}
        </p>

        <div
          style={{
            backgroundColor: '#f5f5f5',
            padding: '15px',
            borderRadius: '8px',
            textAlign: 'center' as const,
            margin: '20px 0',
          }}
        >
          <p style={{ margin: 0, color: '#666' }}>
            Order Number: <strong style={{ color: '#333' }}>#{orderId}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'center' as const, margin: '30px 0' }}>
          <a
            href={orderLink}
            style={{
              backgroundColor: '#f97316',
              color: 'white',
              padding: '14px 30px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block',
            }}
          >
            Track Your Order
          </a>
        </div>
      </div>

      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' as const }}>
        <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
          Collibri Pizza - Delicious pizza delivered to your door
        </p>
      </div>
    </div>
  );
};
