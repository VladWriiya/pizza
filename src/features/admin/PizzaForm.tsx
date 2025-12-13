'use client';

import React from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pizzaFormSchema, PizzaFormValues } from '@/lib/schemas/product-schema';
import { Ingredient, Product, ProductItem, AvailabilityStatus } from '@prisma/client';
import toast from 'react-hot-toast';
import { ProductDetailsForm } from './ProductDetailsForm';
import { ProductVariationsForm } from './ProductVariationsForm';
import { IngredientsPicker } from './IngredientsPicker';
import { Button } from '@/shared/ui/button';
import { ProductAvailabilityForm } from './form/ProductAvailabilityForm';
import { ProductDiscountForm } from './form/ProductDiscountForm';
import { updatePizzaAction } from '../product/actions/update-product.action';
import { createPizzaAction } from '../product/actions/create-product.action';

type ProductTranslations = { en?: { name?: string }; he?: { name?: string } } | null;

type InitialValues = Product & {
  items: ProductItem[];
  ingredients: Ingredient[];
};

interface Props {
  ingredients: Ingredient[];
  initialValues?: InitialValues;
}

export const PizzaForm: React.FC<Props> = ({ ingredients, initialValues }) => {
  const router = useRouter();
  const isEditMode = !!initialValues;
  const translations = initialValues?.translations as ProductTranslations;

  const form = useForm<PizzaFormValues>({
    resolver: zodResolver(pizzaFormSchema),
    defaultValues: {

      imageUrl: initialValues?.imageUrl || '',
      availabilityStatus: initialValues?.availabilityStatus || AvailabilityStatus.AVAILABLE,
      name_en: translations?.en?.name || '',
      name_he: translations?.he?.name || '',
      ingredients: initialValues?.ingredients.map((i) => i.id) || [],
      items: initialValues?.items.length
        ? initialValues.items
        : [{ price: undefined, size: 20, pizzaType: 1 }],
      discountPercent: initialValues?.discountPercent || null,
    },
  });

  // Watch items for min price calculation (for discount preview)
  const watchedItems = form.watch('items');
  const minPrice = watchedItems?.length
    ? Math.min(...watchedItems.filter(i => i.price).map(i => i.price as number))
    : 0;

  const onSubmit = async (data: PizzaFormValues) => {
    try {
      if (isEditMode) {
        await updatePizzaAction(initialValues.id, data);
        toast.success('Pizza updated successfully!');
      } else {
        await createPizzaAction(data);
        toast.success('Pizza created successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save pizza.');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pz-mt-8 pz-max-w-4xl pz-space-y-8">
        <ProductDetailsForm />
        <IngredientsPicker ingredients={ingredients} />
        <ProductVariationsForm />

        <div className="pz-border-t pz-pt-8">
          <h3 className="pz-font-medium pz-mb-4">Discount</h3>
          <ProductDiscountForm minPrice={minPrice} />
        </div>

        <div className="pz-border-t pz-pt-8">
          <ProductAvailabilityForm />
        </div>

        <div className="pz-flex pz-gap-4">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Pizza'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};