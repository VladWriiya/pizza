import React from 'react';
import { cn } from '@/lib/utils';
import { ProductFiltersClient } from './ProductFiltersClient';
import type { Ingredient } from '@prisma/client';
import { getLocale } from 'next-intl/server';
import { getIngredientsAction } from '@/features/product/actions/product.queries';

export const ProductFilters = async ({ className }: { className?: string }) => {
  const locale = await getLocale();
  let ingredients: Ingredient[] = [];
  let error = null;

  try {
    const rawIngredients = await getIngredientsAction();
    ingredients = rawIngredients.map((ingredient) => {
      const translations = ingredient.translations as { [key: string]: { name?: string } } | null;
      return {
        ...ingredient,
        name: translations?.[locale]?.name || ingredient.name,
      };
    });
  } catch {
    error = 'Could not load ingredients.';
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={cn(className)}>
      <ProductFiltersClient ingredients={ingredients} />
    </div>
  );
};