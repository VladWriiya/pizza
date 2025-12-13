import { SimpleProductForm } from '@/features/admin/SimpleProductForm';
import { getCategoriesAction } from '@/features/category/actions/get-categories.query';
import { Heading } from '@/shared/Heading';
import React from 'react';


export default async function AddSimpleProductPage() {
  const allCategories = await getCategoriesAction();
  const filteredCategories = allCategories.filter((c) => c.name.toLowerCase() !== 'pizza');

  return (
    <div>
      <Heading level="1">Add Simple Product</Heading>
      <SimpleProductForm categories={filteredCategories} />
    </div>
  );
}
