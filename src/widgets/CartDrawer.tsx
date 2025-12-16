'use client';

import React from 'react';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/ui/sheet';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, ArrowRight, PackageOpen } from 'lucide-react';
import { CartItem } from '@/entities/cart/CartItem';
import { useCart } from '@/features/cart/hooks/use-cart';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { Skeleton } from '@/shared/ui/skeleton';
import { Heading } from '@/shared/Heading';
import { useTranslations } from 'next-intl';
import { TransformedCartItem } from '@/lib/cart-helpers';

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const t = useTranslations('Cart');
  const tGeneral = useTranslations('General');
  const { items, totalAmount, loading, updateItemQuantity, removeCartItem, cartLimitError, clearCartLimitError } = useCart();
  const totalQuantity = items.reduce((acc: number, item: TransformedCartItem) => acc + item.quantity, 0);

  // Show toast when cart limit error occurs
  React.useEffect(() => {
    if (cartLimitError) {
      toast.error(cartLimitError);
      clearCartLimitError();
    }
  }, [cartLimitError, clearCartLimitError]);

  const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
    const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="pz-flex pz-flex-col pz-justify-between pz-pb-0 pz-bg-[#F4F1EE]" data-testid="cart-drawer">
        <div className={cn('pz-flex pz-flex-col pz-h-full', !totalAmount && !loading && 'pz-justify-center')}>
          {totalQuantity > 0 && !loading && (
            <SheetHeader className="pz-p-4">
              <SheetTitle>
                {t('inCart')} <span className="pz-font-bold">{totalQuantity} {t('items')}</span>
              </SheetTitle>
            </SheetHeader>
          )}

          {loading && (
            <div className="pz-p-6">
              <Skeleton className="pz-w-1/2 pz-h-8 pz-mb-10" />
              <Skeleton className="pz-w-full pz-h-[145px] pz-rounded-xl pz-mb-4" />
              <Skeleton className="pz-w-full pz-h-[145px] pz-rounded-xl" />
            </div>
          )}

          {!loading && totalQuantity === 0 && (
            <div className="pz-flex pz-flex-col pz-items-center pz-justify-center pz-w-72 pz-mx-auto" data-testid="cart-empty">
              <div className="pz-w-28 pz-h-28 pz-rounded-full pz-bg-orange-100 pz-flex pz-items-center pz-justify-center pz-mb-5">
                <PackageOpen className="pz-w-14 pz-h-14 pz-text-orange-400" />
              </div>
              <Heading level="3" className="pz-text-center pz-font-bold pz-my-3 pz-text-orange-600">
                {t('emptyTitle')}
              </Heading>
              <p className="pz-text-center pz-text-orange-500/70 pz-mb-5">{t('emptySubtitle')}</p>
              <SheetClose asChild>
                <Button className="pz-w-56 pz-h-12 pz-text-base" size="lg">
                  <ArrowLeft className="pz-w-5 pz-mr-2" />
                  {tGeneral('goBack')}
                </Button>
              </SheetClose>
            </div>
          )}

          {!loading && totalQuantity > 0 && (
            <>
              <div className="-pz-mx-6 pz-mt-5 pz-overflow-auto pz-flex-1">
                {items.map((item: TransformedCartItem) => (
                  <div key={item.id} className="pz-mb-2">
                    <CartItem
                      {...item}
                      onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                      onClickRemove={() => removeCartItem(item.id)}
                    />
                  </div>
                ))}
              </div>

              <SheetFooter className="-pz-mx-6 pz-bg-white pz-p-8">
                <div className="pz-w-full">
                  <div className="pz-flex pz-mb-4">
                    <span className="pz-flex-1 pz-text-lg pz-text-neutral-500">
                      {tGeneral('total')}
                      <div className="pz-flex-1 pz-border-b pz-border-dashed pz-border-b-neutral-200 pz-relative -pz-top-1 pz-mx-2" />
                    </span>
                    <span className="pz-font-bold pz-text-lg" data-testid="cart-drawer-total">{totalAmount} ₪</span>
                  </div>

                  <Link href="/purchase" passHref legacyBehavior>
                    <a
                      onClick={(e) => {
                      
                        if (totalQuantity === 0) {
                          console.log('Cart is empty, preventing navigation.');
                          e.preventDefault();
                          toast.error(t('emptyTitle'));
                        } else {
                          console.log('Cart is not empty, allowing navigation to /purchase');
                        }
                      }}
                    >
                      <Button type="button" className="pz-w-full pz-h-12 pz-text-base">
                        {tGeneral('placeOrder')}
                        <ArrowRight className="pz-w-5 pz-ml-2" />
                      </Button>
                    </a>
                  </Link>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
