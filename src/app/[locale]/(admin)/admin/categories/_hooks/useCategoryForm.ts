'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createCategoryAction } from '@/features/category/actions/create-category.action';
import { updateCategoryAction } from '@/features/category/actions/update-category.action';
import toast from 'react-hot-toast';
import { Category } from '@prisma/client';
import { categoryFormSchema, CategoryFormValues } from '@/lib/schemas/category.schema';

type CategoryTranslations = { en?: { name?: string }; he?: { name?: string } } | null;

export const useCategoryForm = (
  initialValues?: Category,
  onSuccess?: () => void
) => {
  const isEditMode = !!initialValues;
  const translations = initialValues?.translations as CategoryTranslations;

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name_en: translations?.en?.name || '',
      name_he: translations?.he?.name || '',
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    const formData = new FormData();
    formData.append('name_en', data.name_en);
    formData.append('name_he', data.name_he);

    const action = isEditMode
      ? updateCategoryAction(initialValues.id, formData)
      : createCategoryAction(formData);
    
    const result = await action;

    if (result?.success) {
      toast.success(isEditMode ? 'Category updated!' : 'Category created!');
      onSuccess?.();
    } else {
        const error = result.error;
        if (typeof error === 'object') {
            if (error.name_en) toast.error(error.name_en[0]);
            if (error.name_he) toast.error(error.name_he[0]);
        } else if (typeof error === 'string') {
            toast.error(error);
        } else {
            toast.error('An unknown error occurred.');
        }
    }
  };

  return {
    form,
    onSubmit,
  };
};