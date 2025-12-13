'use client';

import React from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simpleProductFormSchema, SimpleProductFormValues } from '@/lib/schemas/product-schema';

import { Button } from '@/shared/ui/button';
import { FormInput } from '@/shared/form/FormInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Category, Product, ProductItem, AvailabilityStatus } from '@prisma/client';
import toast from 'react-hot-toast';
import { ProductDetailsForm } from './ProductDetailsForm';
import { ProductAvailabilityForm } from './form/ProductAvailabilityForm';
import { ProductDiscountForm } from './form/ProductDiscountForm';
import { updateSimpleProductAction } from '../product/actions/update-product.action';
import { createSimpleProductAction } from '../product/actions/create-product.action';


type ProductTranslations = { en?: { name?: string }; he?: { name?: string } } | null;

interface Props {
  categories: Category[];
  initialValues?: Product & { items: ProductItem[] };
}

export const SimpleProductForm: React.FC<Props> = ({ categories, initialValues }) => {
  const router = useRouter();
  const isEditMode = !!initialValues;

  // Extract descriptions from initialValues
  const marketingDesc = initialValues?.marketingDescription as { en?: string; he?: string } | null;
  const techDesc = initialValues?.description as { en?: string; he?: string } | null;
  const translations = initialValues?.translations as ProductTranslations;

  const form = useForm<SimpleProductFormValues>({
    resolver: zodResolver(simpleProductFormSchema),
    defaultValues: {
      imageUrl: initialValues?.imageUrl || '',
      availabilityStatus: initialValues?.availabilityStatus || AvailabilityStatus.AVAILABLE,
      name_en: translations?.en?.name || '',
      name_he: translations?.he?.name || '',
      categoryId: initialValues?.categoryId,
      price: initialValues?.items[0]?.price,
      marketingDescription_en: marketingDesc?.en || '',
      marketingDescription_he: marketingDesc?.he || '',
      description_en: techDesc?.en || '',
      description_he: techDesc?.he || '',
      discountPercent: initialValues?.discountPercent || null,
    },
  });

  // Watch price for discount preview
  const watchedPrice = form.watch('price');

  const onSubmit = async (data: SimpleProductFormValues) => {
    try {
      if (isEditMode) {
        await updateSimpleProductAction(initialValues.id, data);
        toast.success('Product updated successfully!');
      } else {
        await createSimpleProductAction(data);
        toast.success('Product created successfully!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save product.');
    }
  };

  const translatedCategories = categories.map(c => {
      const translations = c.translations as { en?: { name?: string } } | null;
      return { ...c, name: translations?.en?.name || c.name };
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pz-mt-8 pz-max-w-3xl pz-space-y-6">
        <ProductDetailsForm showDescriptions />
        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <div>
              <label className="pz-block pz-mb-2 pz-font-medium">Category</label>
              <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value || '')}>
                <SelectTrigger className="pz-h-12">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {translatedCategories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && <p className="pz-text-red-500 pz-text-sm pz-mt-1">{fieldState.error.message}</p>}
            </div>
          )}
        />
        <FormInput name="price" label="Price" type="number" step="1" required />

        <div className="pz-border-t pz-pt-6">
          <h3 className="pz-font-medium pz-mb-4">Discount</h3>
          <ProductDiscountForm price={watchedPrice} />
        </div>

        <div className="pz-border-t pz-pt-6">
          <ProductAvailabilityForm />
        </div>

        <div className="pz-flex pz-gap-4">
          <Button type="submit" loading={form.formState.isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};