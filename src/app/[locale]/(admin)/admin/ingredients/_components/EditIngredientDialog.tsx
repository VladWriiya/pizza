'use client';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/shared/ui/dialog';
import { FormInput } from '@/shared/form/FormInput';
import { Ingredient } from '@prisma/client';
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useIngredientForm } from '../_hooks/use-ingredient-form';


interface Props {
  ingredient: Ingredient;
}

export const EditIngredientDialog: React.FC<Props> = ({ ingredient }) => {
  const [open, setOpen] = useState(false);
  const { form, handleFormSubmit } = useIngredientForm(ingredient, () => setOpen(false));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:pz-max-w-md pz-bg-white">
        <DialogHeader>
          <DialogTitle>Edit Ingredient</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="pz-space-y-4">
            <FormInput name="name_en" label="English Name" required />
            <FormInput name="name_he" label="Hebrew Name" dir="rtl" required />
            <FormInput name="price" label="Price" type="number" required />
            <FormInput name="imageUrl" label="Image URL" required />
            <div className="pz-flex pz-justify-end pz-gap-2">
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" loading={form.formState.isSubmitting}>
                Save Changes
                </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};