'use server';

import { ApiError, Client, Environment, OrdersController, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  throw new Error('PayPal credentials are not configured.');
}

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  environment: Environment.Sandbox,
});

const ordersController = new OrdersController(client);

export async function createPayPalOrder(amount: number) {
  try {
    const { body } = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        purchaseUnits: [
          {
            amount: {
              currencyCode: 'ILS',
              value: amount.toFixed(2),
            },
          },
        ],
      },
    });
    const parsedBody = JSON.parse(body as string);
    return { success: true, orderId: parsedBody.id };
  } catch (error) {
    console.error('Failed to create PayPal order:', error);
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

export async function capturePayPalOrder(orderId: string) {
  try {
    const { body } = await ordersController.captureOrder({
      id: orderId,
    });
    return { success: true, data: JSON.parse(body as string) };
  } catch (error) {
    console.error('Failed to capture PayPal order:', error);
    if (error instanceof ApiError) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}
