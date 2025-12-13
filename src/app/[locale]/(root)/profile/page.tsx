'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/navigation';
import { Container } from '@/shared/container';
import { Heading } from '@/shared/Heading';
import { WhiteBlock } from '@/shared/WhiteBlock';
import { Button } from '@/shared/ui/button';
import { CircleUser, LogOut, Eye, Clock, ChefHat, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '@prisma/client';
import { getMyOrders } from '@/app/[locale]/actions/user';
import { OrderItem } from '@/lib/schemas/order-form-schema';
import { useTranslations } from 'next-intl';

// Status configuration for display
const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Processing', color: 'pz-bg-yellow-100 pz-text-yellow-700', icon: <Clock size={16} /> },
  CONFIRMED: { label: 'Confirmed', color: 'pz-bg-blue-100 pz-text-blue-700', icon: <CheckCircle size={16} /> },
  PREPARING: { label: 'Preparing', color: 'pz-bg-orange-100 pz-text-orange-700', icon: <ChefHat size={16} /> },
  READY: { label: 'Ready', color: 'pz-bg-purple-100 pz-text-purple-700', icon: <Package size={16} /> },
  DELIVERING: { label: 'On the way', color: 'pz-bg-indigo-100 pz-text-indigo-700', icon: <Truck size={16} /> },
  DELIVERED: { label: 'Delivered', color: 'pz-bg-green-100 pz-text-green-700', icon: <CheckCircle size={16} /> },
  SUCCEEDED: { label: 'Completed', color: 'pz-bg-green-100 pz-text-green-700', icon: <CheckCircle size={16} /> },
  CANCELLED: { label: 'Cancelled', color: 'pz-bg-red-100 pz-text-red-700', icon: <XCircle size={16} /> },
};

// Check if order is active (can be tracked)
function isActiveOrder(status: OrderStatus): boolean {
  return ['CONFIRMED', 'PREPARING', 'READY', 'DELIVERING'].includes(status);
}

type OrderWithParsedItems = Omit<Order, 'items'> & {
  items: OrderItem[];
};

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithParsedItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }

    if (status === 'authenticated') {
      getMyOrders().then(serverOrders => {
        const parsedOrders = serverOrders.map(order => ({
          ...order,
          items: JSON.parse(order.items as string),
        }));
        setOrders(parsedOrders);
        setLoading(false);
      });
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <Container className="pz-flex pz-items-center pz-justify-center pz-min-h-[400px]">
        <p>Loading...</p>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container className="pz-my-10">
      <Heading level="1" className="pz-font-extrabold pz-mb-8">
        {t('title')}
      </Heading>
      <div className="pz-grid pz-grid-cols-4 pz-gap-8">
        <div className="pz-col-span-1">
          <WhiteBlock className="pz-p-4">
            <div className="pz-flex pz-flex-col pz-items-center">
              <CircleUser size={60} className="pz-mb-4" />
              <p className="pz-font-bold">{session.user.name}</p>
              <p className="pz-text-sm pz-text-gray-500">{session.user.email}</p>
              <Button
                variant="outline"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="pz-w-full pz-mt-6"
              >
                <LogOut size={16} className="pz-mr-2" />
                {t('signOut')}
              </Button>
            </div>
          </WhiteBlock>
        </div>

        <div className="pz-col-span-3">
          <h2 className="pz-text-2xl pz-font-bold pz-mb-4">{t('orderHistory')}</h2>
          <div className="pz-space-y-4">
            {orders.length > 0 ? (
              orders.map(order => {
                const config = statusConfig[order.status];
                const isActive = isActiveOrder(order.status);

                return (
                  <WhiteBlock key={order.id} className="pz-p-0 pz-overflow-hidden">
                    {/* Header with status */}
                    <div className="pz-flex pz-justify-between pz-items-center pz-p-4 pz-border-b pz-border-gray-100">
                      <div>
                        <h3 className="pz-font-bold pz-text-lg">Order #{order.id}</h3>
                        <p className="pz-text-sm pz-text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} • {order.totalAmount} ILS
                        </p>
                      </div>
                      <div className={`pz-flex pz-items-center pz-gap-2 pz-px-3 pz-py-1.5 pz-rounded-full ${config.color}`}>
                        {config.icon}
                        <span className="pz-font-medium pz-text-sm">{config.label}</span>
                      </div>
                    </div>

                    {/* Order items */}
                    <div className="pz-p-4">
                      <ul className="pz-space-y-1 pz-text-sm">
                        {order.items.slice(0, 3).map((item, index) => (
                          <li key={item.id || index} className="pz-text-gray-600">
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                        {order.items.length > 3 && (
                          <li className="pz-text-gray-400">+{order.items.length - 3} more items</li>
                        )}
                      </ul>
                    </div>

                    {/* Track order button for active orders */}
                    {isActive && (
                      <div className="pz-p-4 pz-pt-0">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" className="pz-w-full">
                            <Eye size={16} className="pz-mr-2" />
                            Track Order
                          </Button>
                        </Link>
                      </div>
                    )}
                  </WhiteBlock>
                );
              })
            ) : (
              <p className="pz-text-gray-500">{t('noOrders')}</p>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}