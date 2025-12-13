'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Ingredient } from '@prisma/client';
import {  IngredientFormValues } from '@/lib/schemas/ingredient.schema';
import { createIngredientAction, updateIngredientAction } from '@/features/ingredient/actions/ingredient.mutations';

interface IngredientTranslations {
  en?: { name?: string };
  he?: { name?: string };
}

export const useIngredientForm = (
  initialValues?: Ingredient,
  onSuccess?: () => void
) => {
  const isEditMode = !!initialValues;
  const translations = initialValues?.translations as IngredientTranslations | undefined;

  const form = useForm<IngredientFormValues>({
    defaultValues: {
      name_en: translations?.en?.name || '',
      name_he: translations?.he?.name || '',
      price: initialValues?.price,
      imageUrl: initialValues?.imageUrl || '',
    },
  });

  const handleFormSubmit = async (data: IngredientFormValues) => {
    const formData = new FormData();
    formData.append('name_en', data.name_en);
    formData.append('name_he', data.name_he);
    formData.append('price', String(data.price));
    formData.append('imageUrl', data.imageUrl);

    const action = isEditMode
      ? updateIngredientAction(initialValues.id, formData)
      : createIngredientAction(formData);

    const result = await action;

    if (result?.success) {
      toast.success(isEditMode ? 'Ingredient updated!' : 'Ingredient created!');
      form.reset();
      onSuccess?.();
    } else {
      const error = result.error;
      if (typeof error === 'object') {
        Object.entries(error).forEach(([key, value]) => {
          if (value && Array.isArray(value)) {
            form.setError(key as keyof IngredientFormValues, { type: 'manual', message: value[0] });
            toast.error(`${key}: ${value[0]}`);
          }
        });
      } else if (typeof error === 'string') {
        toast.error(error);
      }
    }
  };

  return {
    form,
    handleFormSubmit,
  };
};