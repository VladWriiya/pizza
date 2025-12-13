'use client';

import React from 'react';
import { WhiteBlock } from '@/shared/WhiteBlock';
import { LucideIcon, Package, Percent, Truck, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ApplyCouponForm } from '@/features/cart/ApplyCouponForm';


interface CheckoutDetailRowProps {
  title: string;
  value: string | React.ReactNode;
  icon: LucideIcon;
  className?: string;
}

const CheckoutDetailRow: React.FC<CheckoutDetailRowProps> = ({ title, value, icon: Icon, className }) => (
  <div className={cn("pz-flex pz-my-4", className)}>
    <span className="pz-flex pz-flex-1 pz-items-center pz-text-lg pz-text-neutral-500">
      <Icon size={18} className="pz-mr-2 pz-text-gray-400" />
      {title}
      <div className="pz-flex-1 pz-border-b pz-border-dashed pz-border-neutral-200 pz-relative -pz-top-1 pz-mx-2" />
    </span>
    <span className="pz-font-bold pz-text-lg">{value}</span>
  </div>
);

export interface PriceDetails {
  finalAmount: number;
  subtotal: number;
  vat: number;
  delivery: number;
  discount?: number;
  couponCode?: string;
}

interface Props {
  priceDetails: PriceDetails;
  className?: string;
  children: React.ReactNode;
}

export const CheckoutSidebar: React.FC<Props> = ({ priceDetails, className, children }) => {
  const t = useTranslations('CheckoutForm');

  return (
    <div className={cn('pz-sticky pz-top-10', className)}>
      <WhiteBlock className="pz-p-6">
        <div className="pz-flex pz-flex-col pz-gap-1">
          <span className="pz-text-xl">{t('sidebarTitle')}</span>
          <span className="pz-text-[34px] pz-font-extrabold">{priceDetails.finalAmount.toFixed(2)} ILS</span>
        </div>

        <CheckoutDetailRow title={t('cartValue')} value={`${priceDetails.subtotal.toFixed(2)} ILS`} icon={Package} />
        
        {priceDetails.couponCode && priceDetails.discount && (
            <CheckoutDetailRow 
                title={`${t('coupon')}: ${priceDetails.couponCode}`}
                value={`- ${priceDetails.discount.toFixed(2)} ILS`}
                icon={Ticket}
                className="pz-text-green-600"
            />
        )}
        
        <CheckoutDetailRow title={t('vat')} value={`${priceDetails.vat.toFixed(2)} ILS`} icon={Percent} />
        <CheckoutDetailRow title={t('delivery')} value={`${priceDetails.delivery.toFixed(2)} ILS`} icon={Truck} />

        <div className="pz-mt-6 pz-border-t pz-pt-6">
            {!priceDetails.couponCode && <ApplyCouponForm />}
        </div>

        <div className="pz-mt-6">{children}</div>
      </WhiteBlock>
    </div>
  );
};