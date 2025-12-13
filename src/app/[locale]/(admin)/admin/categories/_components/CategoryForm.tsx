'use client';

import { Button } from '@/shared/ui/button';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useCategoryForm } from '../_hooks/useCategoryForm';
import { CategoryEditFields } from './CategoryEditFields';

export const CategoryForm = ({ onCategoryCreated }: { onCategoryCreated: () => void }) => {
  const { form, onSubmit } = useCategoryForm(undefined, () => {
    form.reset();
    onCategoryCreated();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pz-space-y-4 pz-p-4 pz-bg-gray-50 pz-rounded-lg">
        <h2 className="pz-text-lg pz-font-semibold">Add New Category</h2>
        <CategoryEditFields />
        <Button type="submit" loading={form.formState.isSubmitting}>Create</Button>
      </form>
    </FormProvider>
  );
};