'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orderFormSchema, OrderFormValues } from '@/lib/schemas/order-form-schema';
import React, { useEffect, useMemo } from 'react';
import { CheckoutSidebar, PriceDetails } from '@/entities/order/CheckoutSidebar';
import { ShippingForm } from '@/features/fill-shipping-form/ShippingForm';
import { OrderItemsList } from '@/entities/order/OrderItemsList';
import { PayPalButtonsWrapper } from '@/features/place-order/PayPalButtonsWrapper';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { useCart } from '@/features/cart/hooks/use-cart';

const VAT_PERCENT = 18;
const DELIVERY_PRICE = 10;

export const OrderForm: React.FC = () => {
  const t = useTranslations('CheckoutForm');
  const { data: session } = useSession();
  const { items: cartItems, totalAmount, couponCode, updateItemQuantity, removeCartItem } = useCart();

  // Вычисляем priceDetails динамически на основе данных из store
  // totalAmount из store уже включает скидку купона (если применён)
  const priceDetails = useMemo<PriceDetails>(() => {
    // Вычисляем subtotal из items (без скидки)
    const itemsSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Если есть купон, разница между itemsSubtotal и totalAmount = discount
    const discount = couponCode ? Math.max(0, itemsSubtotal - totalAmount) : 0;

    // Используем totalAmount (уже со скидкой) как базу для VAT и финальной суммы
    const subtotalAfterDiscount = totalAmount;
    const vat = (subtotalAfterDiscount * VAT_PERCENT) / 100;
    const delivery = DELIVERY_PRICE;
    const finalAmount = subtotalAfterDiscount + delivery + vat;

    return {
      subtotal: itemsSubtotal,
      discount: discount > 0 ? discount : undefined,
      couponCode: couponCode || undefined,
      vat,
      delivery,
      finalAmount,
    };
  }, [cartItems, totalAmount, couponCode]);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onTouched',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      apartment: '',
      comment: '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      const [firstName, ...lastNameParts] = session.user.name?.split(' ') || [];
      const lastName = lastNameParts.join(' ');

      form.reset({
        ...form.getValues(),
        firstName: firstName,
        lastName: lastName,
        email: session.user.email || '',
      });
    }
  }, [session, form]);

  const handleUpdateQuantity = async (id: number, quantity: number) => {
    try {
      if (quantity === 0) {
        await removeCartItem(id);
      } else {
        await updateItemQuantity(id, quantity);
      }
    } catch {
      toast.error('Failed to update item.');
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await removeCartItem(id);
    } catch {
      toast.error('Failed to remove item.');
    }
  };

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
          <ShippingForm />
        </div>
        <div className="lg:pz-col-span-1">
          <CheckoutSidebar priceDetails={priceDetails}>
            <PayPalButtonsWrapper getFormData={getFormData} isFormValid={isFormValid} />
          </CheckoutSidebar>
        </div>
      </div>
    </FormProvider>
  );
};