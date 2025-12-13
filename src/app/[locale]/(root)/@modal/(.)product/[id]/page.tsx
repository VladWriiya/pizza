import React from 'react';

import { notFound } from 'next/navigation';
import { ChooseProductModal } from '@/shared/modal/ChooseProductModal';
import { prisma } from '../../../../../../../prisma/prisma-client';

export default async function ProductModalPage({ params: { id } }: { params: { id: string } }) {
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
  return <ChooseProductModal product={product} />;
}
