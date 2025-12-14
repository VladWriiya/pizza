export const dynamic = 'force-dynamic';

import React from 'react';

import { notFound } from 'next/navigation';
import { Container } from '@/shared/container';
import { prisma } from '../../../../../../prisma/prisma-client';
import { ChooseProductForm } from '@/features/product/ChooseProductForm';


export default async function ProductPage({ params: { id } }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    include: {
      items: true,
      ingredients: true,
      baseIngredients: true,
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <Container className="pz-my-10">
      <ChooseProductForm product={product} />
    </Container>
  );
};