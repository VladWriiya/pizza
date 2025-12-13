import React from 'react';

import { notFound, redirect } from 'next/navigation';
import { Container } from '@/shared/container';
import { Heading } from '@/shared/Heading';

import { Link } from '@/i18n/navigation';
import { CheckCircle } from 'lucide-react';
import { prisma } from '../../../../../../prisma/prisma-client';
import { Button } from '@/shared/ui';

interface Props {
  searchParams: {
    orderId?: string;
  };
}

async function getOrderData(orderId: string) {
  if (!orderId) return null;

  try {
    const id = Number(orderId);
    if (isNaN(id)) return null;

    const order = await prisma.order.findUnique({
      where: { id },
    });
    return order;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return null;
  }
}

export default async function PurchaseSuccessPage({ searchParams }: Props) {
  if (!searchParams.orderId) {
    return redirect('/');
  }

  const order = await getOrderData(searchParams.orderId);

  if (!order) {
    return notFound();
  }

  return (
    <Container className="pz-mt-10 pz-mb-20">
      <div className="pz-flex pz-flex-col pz-items-center pz-text-center">
        <CheckCircle className="pz-w-24 pz-h-24 pz-text-green-500" />

        <Heading level="1" className="pz-font-extrabold pz-my-8">
          Thank You for Your Order!
        </Heading>

        <p className="pz-text-lg pz-text-neutral-600">Your order #{order.id} has been placed.</p>
        <p className="pz-text-neutral-500 pz-mt-2">
          A confirmation email will be sent to <b>{order.email}</b> shortly.
        </p>

        <div className="pz-mt-10">
          <Link href="/">
            <Button size="lg" variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
