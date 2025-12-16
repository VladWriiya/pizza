'use client';

import React from 'react';
import { VariantSelector } from '@/shared/VariantSelector';
import type { Variant } from '@/shared/VariantSelector';
import { useTranslations } from 'next-intl';
import { IngredientCard } from '@/entities/product/IngredientCard';
import { Ingredient } from '@prisma/client';
import { PizzaSize, PizzaDoughType } from '@/constants/pizza-options';

interface Props {
  locale: string;
  ingredients: Ingredient[];
  availableSizes: Variant[];
  doughOptions: Variant[];
  selectedIngredients: Set<number>;
  size: PizzaSize;
  doughType: PizzaDoughType;
  onSizeChange: (size: PizzaSize) => void;
  onDoughChange: (doughType: PizzaDoughType) => void;
  onToggleIngredient: (id: number) => void;
}

export const PizzaOptions: React.FC<Props> = ({
  locale,
  ingredients,
  availableSizes,
  doughOptions,
  selectedIngredients,
  size,
  doughType,
  onSizeChange,
  onDoughChange,
  onToggleIngredient,
}) => {
  const t = useTranslations('ProductModal');

  return (
    <>
      <div className="pz-flex pz-flex-col pz-gap-4 pz-mt-4">
        <VariantSelector
          items={availableSizes}
          value={String(size)}
          onClick={(value) => onSizeChange(Number(value) as PizzaSize)}
        />
        <VariantSelector
          items={doughOptions}
          value={String(doughType)}
          onClick={(value) => onDoughChange(Number(value) as PizzaDoughType)}
        />
      </div>

      {/* Extra ingredients (addable) */}
      <p className="pz-mt-5 pz-font-bold">{t('ingredients')}</p>
      <div className="pz-bg-gray-50 pz-p-3 sm:pz-p-5 pz-rounded-md pz-max-h-[250px] sm:pz-max-h-[320px] pz-overflow-auto scrollbar pz-mt-2">
        <div className="pz-grid pz-grid-cols-2 sm:pz-grid-cols-3 pz-gap-2 sm:pz-gap-3">
          {ingredients.map((ingredient) => {
            const translations = ingredient.translations as { [key: string]: { name?: string } } | null;
            const translatedIngredientName =
              translations?.[locale]?.name || ingredient.name;
            return (
              <IngredientCard
                key={ingredient.id}
                name={translatedIngredientName}
                price={ingredient.price}
                imageUrl={ingredient.imageUrl}
                onClick={() => onToggleIngredient(ingredient.id)}
                isActive={selectedIngredients.has(ingredient.id)}
                isAvailable={ingredient.isAvailable}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};