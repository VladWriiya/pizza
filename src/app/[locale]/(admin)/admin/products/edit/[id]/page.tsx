import { notFound } from 'next/navigation';
import React from 'react';
import { prisma } from '../../../../../../../../prisma/prisma-client';
import { getCategoriesAction } from '@/features/category/actions/get-categories.query';

import { Heading } from '@/shared/Heading';
import { PizzaForm } from '@/features/admin/PizzaForm';
import { SimpleProductForm } from '@/features/admin/SimpleProductForm';
import { getIngredientsAction } from '@/features/product/actions/product.queries';

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = Number(params.id);
  if (isNaN(productId)) {
    return notFound();
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      items: true,
      ingredients: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const [allCategories, allIngredients] = await Promise.all([
    getCategoriesAction(),
    getIngredientsAction(),
  ]);

  const isPizza = product.items.some((item) => !!item.pizzaType);

  return (
    <div>
      <Heading level="1">Edit Product: {product.name}</Heading>
      {isPizza ? (
        <PizzaForm ingredients={allIngredients} initialValues={product} />
      ) : (
        <SimpleProductForm
          categories={allCategories.filter((c) => c.name.toLowerCase() !== 'pizza')}
          initialValues={product}
        />
      )}
    </div>
  );
}