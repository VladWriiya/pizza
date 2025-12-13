'use client';
    
import { Button } from '@/shared/ui/button';
import { FormInput } from '@/shared/form/FormInput';
import React from 'react';
import { FormProvider } from 'react-hook-form';
import { useIngredientForm } from '../_hooks/use-ingredient-form';

    
export const IngredientForm = () => {
  const { form, handleFormSubmit } = useIngredientForm();
    
  return (
    <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="pz-space-y-4">
            <h2 className="pz-text-lg pz-font-semibold">Add New Ingredient</h2>
            <FormInput name="name_en" label="English Name" required />
            <FormInput name="name_he" label="Hebrew Name" dir="rtl" required />
            <FormInput name="price" label="Price" type="number" required />
            <FormInput name="imageUrl" label="Image URL" required />
            <Button type="submit" loading={form.formState.isSubmitting}>Create</Button>
        </form>
    </FormProvider>
  );
};