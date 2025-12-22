'use client';

import { Category } from '@prisma/client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Pencil, Check, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { DeleteCategoryButton } from './DeleteCategoryButton';
import { CategoryEditFields } from './CategoryEditFields';
import {  FormProvider } from 'react-hook-form';
import { useCategoryForm } from '../_hooks/useCategoryForm';

interface Props {
  category: Category;
  onUpdate: () => void;
}

type CategoryTranslations = { en?: { name?: string }; he?: { name?: string } } | null;

export const CategoryItem: React.FC<Props> = ({ category, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { form, onSubmit } = useCategoryForm(category, () => {
    setIsEditing(false);
    onUpdate();
  });

  // Reset form with current category data when entering edit mode
  useEffect(() => {
    if (isEditing) {
      const translations = category.translations as CategoryTranslations;
      form.reset({
        name_en: translations?.en?.name || '',
        name_he: translations?.he?.name || '',
      });
    }
  }, [isEditing, category, form]);

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isEditing) {
    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pz-flex pz-items-center pz-bg-white pz-p-4 pz-rounded-lg pz-shadow-sm pz-gap-2">
            <CategoryEditFields />
            <Button size="icon" variant="ghost" type="submit" loading={form.formState.isSubmitting}><Check className="pz-text-green-500" /></Button>
            <Button size="icon" variant="ghost" type="button" onClick={() => setIsEditing(false)}><X /></Button>
        </form>
      </FormProvider>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className="pz-flex pz-items-center pz-bg-white pz-p-4 pz-rounded-lg pz-shadow-sm">
      <button {...attributes} {...listeners} className="pz-cursor-grab pz-mr-4 pz-touch-none">
        <GripVertical />
      </button>
      <span className="pz-font-medium pz-flex-1">{(category.translations as { en?: { name?: string } } | null)?.en?.name || category.name}</span>
      <div className="pz-ml-auto pz-flex pz-items-center pz-gap-2">
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}><Pencil size={16} /></Button>
        <DeleteCategoryButton categoryId={category.id} onUpdate={onUpdate} />
      </div>
    </div>
  );
};