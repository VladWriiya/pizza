import { cookies } from 'next/headers';
import { prisma } from '../../../../../prisma/prisma-client';
import { Container } from '@/shared/container';
import { Heading } from '@/shared/Heading';
import { OrderForm } from '@/widgets/OrderForm';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

async function getCartData(token: string) {
  return prisma.cart.findFirst({
    where: { token },
    include: {
      items: {
        include: {
          productItem: { include: { product: true } },
          ingredients: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
}

export default async function CheckoutPage() {
  const t = await getTranslations('CheckoutForm');
  const token = cookies().get('cartToken')?.value;

  if (!token) {
    redirect('/');
  }

  const cart = await getCartData(token);

  if (!cart || cart.items.length === 0) {
    redirect('/');
  }

  return (
    <Container className="pz-my-10 pz-max-w-screen-lg">
      <Heading level="1" className="pz-font-extrabold pz-mb-8">
        {t('title')}
      </Heading>
      <OrderForm />
    </Container>
  );
}