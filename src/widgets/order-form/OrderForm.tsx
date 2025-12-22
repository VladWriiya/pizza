'use client';

import { FormProvider } from 'react-hook-form';
import React from 'react';
import { CheckoutSidebar, PriceDetails } from '@/entities/order/CheckoutSidebar';
import { ShippingForm } from '@/features/fill-shipping-form/ShippingForm';
import { OrderItemsList } from '@/entities/order/OrderItemsList';
import { PayPalButtonsWrapper } from '@/features/place-order/PayPalButtonsWrapper';
import { UsePointsSection } from '@/features/loyalty/UsePointsSection';
import { useTranslations } from 'next-intl';
import { CartWithRelations } from '@/lib/prisma-types';
import { useOrderForm } from './useOrderForm';

interface Props {
  cart: CartWithRelations;
  initialPriceDetails: PriceDetails;
}

export const OrderForm: React.FC<Props> = (props) => {
  const t = useTranslations('CheckoutForm');
  const {
    form,
    cartItems,
    priceDetails,
    handleUpdateQuantity,
    handleRemoveItem,
    appliedPoints,
    handlePointsApply,
    maxPointsDiscount,
    isAuthenticated,
  } = useOrderForm(props);

  const isFormValid = form.formState.isValid;
  const getFormData = () => form.getValues();

  return (
    <FormProvider {...form}>
      <div className="pz-grid lg:pz-grid-cols-3 pz-gap-10">
        <div className="lg:pz-col-span-2 pz-space-y-8">
          <OrderItemsList
            items={cartItems}
            onClickCountButton={(id, quantity, type) =>
              handleUpdateQuantity(id, type === 'plus' ? quantity + 1 : quantity - 1)
            }
            onClickRemove={handleRemoveItem}
            title={t('yourCart')}
          />

          {isAuthenticated && (
            <UsePointsSection
              onPointsApply={handlePointsApply}
              appliedPoints={appliedPoints}
              maxDiscount={maxPointsDiscount}
            />
          )}

          <ShippingForm />
        </div>
        <div className="lg:pz-col-span-1">
          <CheckoutSidebar priceDetails={priceDetails}>
            <PayPalButtonsWrapper
              getFormData={getFormData}
              isFormValid={isFormValid}
              appliedPoints={appliedPoints}
            />
          </CheckoutSidebar>
        </div>
      </div>
    </FormProvider>
  );
};