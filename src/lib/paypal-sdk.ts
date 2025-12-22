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
    console.log('[PAYPAL_SDK] Capturing order:', orderId);
    const { body } = await ordersController.captureOrder({
      id: orderId,
    });
    const parsed = JSON.parse(body as string);
    console.log('[PAYPAL_SDK] Capture response:', parsed);
    return { success: true, data: parsed };
  } catch (error) {
    console.error('[PAYPAL_SDK] Failed to capture PayPal order:', error);
    if (error instanceof ApiError) {
      console.error('[PAYPAL_SDK] ApiError details:', {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body,
      });
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred.' };
  }
}

interface WebhookHeaders {
  transmissionId: string | null;
  transmissionTime: string | null;
  certUrl: string | null;
  transmissionSig: string | null;
  authAlgo: string | null;
}

interface VerifyWebhookResult {
  success: boolean;
  error?: string;
}

export async function verifyPayPalWebhook(
  headers: WebhookHeaders,
  webhookEvent: unknown
): Promise<VerifyWebhookResult> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId) {
    console.error('PAYPAL_WEBHOOK_ID is not configured');
    return { success: false, error: 'Webhook ID not configured' };
  }

  const { transmissionId, transmissionTime, certUrl, transmissionSig, authAlgo } = headers;

  if (!transmissionId || !transmissionTime || !certUrl || !transmissionSig || !authAlgo) {
    return { success: false, error: 'Missing required PayPal headers' };
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: webhookEvent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal webhook verification failed:', errorText);
      return { success: false, error: 'Verification request failed' };
    }

    const result = await response.json();

    if (result.verification_status === 'SUCCESS') {
      return { success: true };
    }

    return { success: false, error: 'Signature verification failed' };
  } catch (error) {
    console.error('Error verifying PayPal webhook:', error);
    return { success: false, error: 'Verification error' };
  }
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  error?: string;
}

/**
 * Refund a captured PayPal payment
 * @param captureId - The PayPal capture ID (stored as paymentId in Order)
 * @param amount - Optional amount for partial refund. If not provided, full refund.
 */
export async function refundPayPalPayment(
  captureId: string,
  amount?: number
): Promise<RefundResult> {
  try {
    const accessToken = await getAccessToken();

    const body: Record<string, unknown> = {};
    if (amount !== undefined) {
      body.amount = {
        value: amount.toFixed(2),
        currency_code: 'ILS',
      };
    }

    const response = await fetch(
      `${process.env.PAYPAL_API_URL}/v2/payments/captures/${captureId}/refund`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('PayPal refund failed:', errorData);

      // Handle specific PayPal errors
      if (errorData.name === 'UNPROCESSABLE_ENTITY') {
        const issue = errorData.details?.[0]?.issue;
        if (issue === 'CAPTURE_FULLY_REFUNDED') {
          return { success: false, error: 'This payment has already been fully refunded' };
        }
        if (issue === 'REFUND_AMOUNT_EXCEEDED') {
          return { success: false, error: 'Refund amount exceeds available balance' };
        }
      }

      return { success: false, error: errorData.message || 'Refund failed' };
    }

    const result = await response.json();
    return { success: true, refundId: result.id };
  } catch (error) {
    console.error('Error processing PayPal refund:', error);
    return { success: false, error: 'Failed to process refund' };
  }
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
}
