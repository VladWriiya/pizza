import { PizzaForm } from '@/features/admin/PizzaForm';

import { getCategoriesAction } from '@/features/category/actions/get-categories.query';
import { getIngredientsAction } from '@/features/product/actions/product.queries';
import { Heading } from '@/shared/Heading';
import React from 'react';


export default async function AddPizzaPage() {
  const [, ingredients] = await Promise.all([getCategoriesAction(), getIngredientsAction()]);

  return (
    <div>
      <Heading level="1">Add Pizza</Heading>
      <PizzaForm ingredients={ingredients} />
    </div>
  );
}
