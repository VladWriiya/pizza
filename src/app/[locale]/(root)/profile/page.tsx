'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, Link } from '@/i18n/navigation';
import { Container } from '@/shared/container';
import { Heading } from '@/shared/Heading';
import { WhiteBlock } from '@/shared/WhiteBlock';
import { Button } from '@/shared/ui/button';
import { CircleUser, LogOut, Eye, Clock, ChefHat, Package, Truck, CheckCircle, XCircle, RefreshCw, Mail, AlertTriangle, Heart, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '@prisma/client';
import { getMyOrders, reorderAction } from '@/app/[locale]/actions/user';
import { sendVerificationEmailAction } from '@/app/[locale]/actions/email-verification';
import { getFavoriteProductsAction, removeFromFavoritesAction } from '@/app/[locale]/actions/favorites';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store/cart.store';
import { useLocale } from 'next-intl';
import { OrderItem } from '@/lib/schemas/order-form-schema';
import { useTranslations } from 'next-intl';
import { LoyaltyCard } from '@/features/loyalty/LoyaltyCard';

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

type FavoriteProduct = {
  id: number;
  name: string;
  imageUrl: string;
  minPrice: number;
  categoryName: string;
  addedAt: Date;
};

export default function ProfilePage() {
  const t = useTranslations('ProfilePage');
  const { data: session, status } = useSession();
  const router = useRouter();
  const locale = useLocale();
  const fetchCartItems = useCartStore((state) => state.fetchCartItems);
  const [orders, setOrders] = useState<OrderWithParsedItems[]>([]);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const [sendingVerification, setSendingVerification] = useState(false);
  const [removingFavoriteId, setRemovingFavoriteId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites'>('orders');

  // Simple translation function for dough types (used by cart refresh)
  const tDoughs = (key: string) => key;

  const handleSendVerification = async () => {
    if (!session?.user?.id) return;
    setSendingVerification(true);
    try {
      const result = await sendVerificationEmailAction(Number(session.user.id));
      if (result.success) {
        toast.success('Verification email sent! Check your inbox.');
      } else {
        toast.error(result.error || 'Failed to send verification email');
      }
    } catch {
      toast.error('Failed to send verification email');
    } finally {
      setSendingVerification(false);
    }
  };

  const handleReorder = async (orderId: number) => {
    setReorderingId(orderId);
    try {
      const result = await reorderAction(orderId);
      if (result.success) {
        await fetchCartItems(locale, tDoughs);
        if (result.skippedCount && result.skippedCount > 0) {
          toast.success(`Added ${result.addedCount} items to cart (${result.skippedCount} unavailable)`);
        } else {
          toast.success(`Added ${result.addedCount} items to cart`);
        }
      } else {
        toast.error(result.error || 'Failed to reorder');
      }
    } catch {
      toast.error('Failed to reorder');
    } finally {
      setReorderingId(null);
    }
  };

  const handleRemoveFavorite = async (productId: number) => {
    setRemovingFavoriteId(productId);
    try {
      const result = await removeFromFavoritesAction(productId);
      if (result.success) {
        setFavorites(prev => prev.filter(f => f.id !== productId));
        toast.success(t('removedFromFavorites'));
      } else {
        toast.error(result.error || 'Failed to remove');
      }
    } catch {
      toast.error('Failed to remove');
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }

    if (status === 'authenticated') {
      Promise.all([
        getMyOrders(),
        getFavoriteProductsAction(),
      ]).then(([serverOrders, serverFavorites]) => {
        const parsedOrders = serverOrders.map(order => ({
          ...order,
          items: JSON.parse(order.items as string),
        }));
        setOrders(parsedOrders);
        setFavorites(serverFavorites);
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

          {/* Email verification banner */}
          {!session.user.verified && (
            <WhiteBlock className="pz-p-4 pz-mt-4 pz-border-2 pz-border-yellow-400 pz-bg-yellow-50">
              <div className="pz-flex pz-items-start pz-gap-3">
                <AlertTriangle size={20} className="pz-text-yellow-600 pz-mt-0.5 pz-flex-shrink-0" />
                <div className="pz-flex-1">
                  <p className="pz-font-semibold pz-text-yellow-800">{t('emailNotVerified')}</p>
                  <p className="pz-text-sm pz-text-yellow-700 pz-mt-1">{t('verifyEmailDescription')}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={sendingVerification}
                    className="pz-mt-3 pz-border-yellow-500 pz-text-yellow-700 hover:pz-bg-yellow-100"
                  >
                    <Mail size={14} className="pz-me-2" />
                    {sendingVerification ? t('sendingEmail') : t('sendVerificationEmail')}
                  </Button>
                </div>
              </div>
            </WhiteBlock>
          )}

          {/* Loyalty Card */}
          <LoyaltyCard className="pz-mt-4" />
        </div>

        <div className="pz-col-span-3">
          {/* Tabs */}
          <div className="pz-flex pz-gap-4 pz-mb-6 pz-border-b pz-border-gray-200">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pz-pb-3 pz-px-1 pz-font-semibold pz-text-lg pz-border-b-2 pz-transition-colors ${
                activeTab === 'orders'
                  ? 'pz-border-primary pz-text-primary'
                  : 'pz-border-transparent pz-text-gray-500 hover:pz-text-gray-700'
              }`}
            >
              {t('orderHistory')}
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`pz-pb-3 pz-px-1 pz-font-semibold pz-text-lg pz-border-b-2 pz-transition-colors pz-flex pz-items-center pz-gap-2 ${
                activeTab === 'favorites'
                  ? 'pz-border-primary pz-text-primary'
                  : 'pz-border-transparent pz-text-gray-500 hover:pz-text-gray-700'
              }`}
            >
              <Heart size={18} />
              {t('favorites')}
              {favorites.length > 0 && (
                <span className="pz-bg-primary pz-text-white pz-text-xs pz-px-2 pz-py-0.5 pz-rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === 'orders' && (
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

                      {/* Action buttons */}
                      <div className="pz-p-4 pz-pt-0 pz-flex pz-gap-2">
                        {isActive && (
                          <Link href={`/orders/${order.id}`} className="pz-flex-1">
                            <Button variant="outline" className="pz-w-full">
                              <Eye size={16} className="pz-me-2" />
                              Track Order
                            </Button>
                          </Link>
                        )}
                        {['DELIVERED', 'SUCCEEDED', 'CANCELLED'].includes(order.status) && (
                          <Button
                            variant="outline"
                            className="pz-flex-1"
                            onClick={() => handleReorder(order.id)}
                            disabled={reorderingId === order.id}
                          >
                            <RefreshCw size={16} className={`pz-me-2 ${reorderingId === order.id ? 'pz-animate-spin' : ''}`} />
                            {reorderingId === order.id ? 'Adding...' : 'Reorder'}
                          </Button>
                        )}
                      </div>
                    </WhiteBlock>
                  );
                })
              ) : (
                <p className="pz-text-gray-500">{t('noOrders')}</p>
              )}
            </div>
          )}

          {/* Favorites Tab */}
          {activeTab === 'favorites' && (
            <div className="pz-space-y-4">
              {favorites.length > 0 ? (
                <div className="pz-grid pz-grid-cols-1 sm:pz-grid-cols-2 pz-gap-4">
                  {favorites.map(product => (
                    <WhiteBlock key={product.id} className="pz-p-0 pz-overflow-hidden">
                      <div className="pz-flex pz-gap-4 pz-p-4">
                        <Link href={`/product/${product.id}`} className="pz-flex-shrink-0">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="pz-w-20 pz-h-20 pz-object-contain pz-bg-secondary pz-rounded-lg"
                          />
                        </Link>
                        <div className="pz-flex-1 pz-min-w-0">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="pz-font-bold pz-truncate hover:pz-text-primary">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="pz-text-sm pz-text-gray-500">{product.categoryName}</p>
                          <p className="pz-font-semibold pz-mt-1">{product.minPrice} ₪</p>
                        </div>
                        <button
                          onClick={() => handleRemoveFavorite(product.id)}
                          disabled={removingFavoriteId === product.id}
                          className="pz-p-2 pz-text-gray-400 hover:pz-text-red-500 pz-transition-colors pz-self-start"
                          aria-label={t('removeFromFavorites')}
                        >
                          <Trash2 size={18} className={removingFavoriteId === product.id ? 'pz-animate-pulse' : ''} />
                        </button>
                      </div>
                    </WhiteBlock>
                  ))}
                </div>
              ) : (
                <div className="pz-text-center pz-py-12">
                  <Heart size={48} className="pz-mx-auto pz-text-gray-300 pz-mb-4" />
                  <p className="pz-text-gray-500">{t('noFavorites')}</p>
                  <Link href="/">
                    <Button variant="outline" className="pz-mt-4">
                      {t('browseProducts')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}