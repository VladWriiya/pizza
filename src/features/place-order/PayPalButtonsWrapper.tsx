'use client';

import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { OrderFormValues } from '@/lib/schemas/order-form-schema';
import { useRouter } from '@/i18n/navigation';
import toast from 'react-hot-toast';
import React from 'react';
import type { OnApproveData } from '@paypal/paypal-js';
import Cookies from 'js-cookie';
import { useCartStore } from '@/store/cart.store';

interface Props {
  getFormData: () => OrderFormValues;
  isFormValid: boolean;
  appliedPoints?: number;
}

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  currency: 'ILS',
  intent: 'capture',
};

export const PayPalButtonsWrapper: React.FC<Props> = ({ getFormData, isFormValid, appliedPoints = 0 }) => {
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);

  const createOrder = async (): Promise<string> => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appliedPoints }),
      });
      const orderData = await response.json();
      if (orderData.orderId) {
        return orderData.orderId;
      } else {
        throw new Error(orderData.error || 'Failed to create order ID.');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Could not initiate PayPal Checkout...${error}`);
      throw error;
    }
  };

  const onApprove = async (data: OnApproveData) => {
    try {
      const formData = getFormData();
      const cartToken = Cookies.get('cartToken');

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: data.orderID,
          formData: formData,
          cartToken: cartToken,
          appliedPoints: appliedPoints,
        }),
      });

      const orderData = await response.json();
      if (orderData.success) {
        toast.success('Payment successful! Redirecting to order tracking...');
        clearCart();
        // Redirect to order tracking page with token for guest access
        const trackingUrl = orderData.token
          ? `/orders/${orderData.orderId}?token=${orderData.token}`
          : `/orders/${orderData.orderId}`;
        router.push(trackingUrl);
      } else {
        throw new Error(orderData.error || 'Payment capture failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  if (!isFormValid) {
    return (
      <div className="pz-text-center pz-p-4 pz-bg-gray-100 pz-rounded-lg pz-text-gray-500">
        Please fill in your details to proceed to payment.
      </div>
    );
  }

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};
