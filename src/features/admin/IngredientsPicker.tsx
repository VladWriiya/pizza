'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

import type { Ingredient } from '@prisma/client';
import { Heading } from '@/shared/Heading';
import { Checkbox } from '@/shared/ui/checkbox';

interface Props {
  ingredients: Ingredient[];
}

export const IngredientsPicker: React.FC<Props> = ({ ingredients }) => {
  const { control } = useFormContext();

  return (
    <div>
      <Heading level="3">Ingredients</Heading>
      <Controller
        control={control}
        name="ingredients"
        render={({ field, fieldState }) => (
          <>
            <div className="pz-grid pz-grid-cols-4 pz-gap-4 pz-mt-4">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="pz-flex pz-items-center pz-space-x-2">
                  <Checkbox
                    id={`ingredient-${ingredient.id}`}
                    checked={field.value?.includes(ingredient.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...(field.value || []), ingredient.id])
                        : field.onChange((field.value || []).filter((id: number) => id !== ingredient.id));
                    }}
                  />
                  <label
                    htmlFor={`ingredient-${ingredient.id}`}
                    className="pz-text-sm pz-font-medium pz-leading-none peer-disabled:pz-cursor-not-allowed peer-disabled:pz-opacity-70"
                  >
                    {ingredient.name}
                  </label>
                </div>
              ))}
            </div>
            {fieldState.error && <p className="pz-text-red-500 pz-text-sm pz-mt-2">{fieldState.error.message}</p>}
          </>
        )}
      />
    </div>
  );
};
