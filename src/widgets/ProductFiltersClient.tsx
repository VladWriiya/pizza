'use client';

import React from 'react';
import type { Ingredient } from '@prisma/client';
import { Heading } from '@/shared/Heading';
import { PriceRangeFilter } from '@/features/filter/PriceRangeFilter';
import { CheckboxGroupFilter } from '@/features/filter/CheckboxGroupFilter';
import { Skeleton } from '@/shared/ui/skeleton';
import { useFilters } from '@/features/filter/hooks/use-filters';
import { useTranslations } from 'next-intl';

interface ProductFiltersClientProps {
  ingredients: Ingredient[];
}

export const ProductFiltersClient = ({ ingredients }: ProductFiltersClientProps) => {
  const t = useTranslations('HomePage');
  const tCrust = useTranslations('HomePage.crustOptions');
  const tSize = useTranslations('HomePage.sizeOptions');
  const filters = useFilters();

  if (!filters.isReady) {
    return (
      <div>
        <Heading level="3" className="pz-mb-5 pz-font-bold">
          {t('filters')}
        </Heading>

        <div className="pz-mb-5">
          <Skeleton className="pz-h-5 pz-w-32 pz-mb-3" />
          <div className="pz-flex pz-flex-col pz-gap-3 pz-mt-3">
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
          </div>
        </div>

        <div className="pz-mb-5">
          <Skeleton className="pz-h-5 pz-w-32 pz-mb-3" />
          <div className="pz-flex pz-flex-col pz-gap-3 pz-mt-3">
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
          </div>
        </div>

        <div className="pz-mt-5 pz-border-y pz-border-neutral-100 pz-py-6 pz-pb-7">
          <Skeleton className="pz-h-5 pz-w-32 pz-mb-5" />
          <div className="pz-flex pz-gap-3 pz-mb-5">
            <Skeleton className="pz-h-10 pz-w-full" />
            <Skeleton className="pz-h-10 pz-w-full" />
          </div>
          <Skeleton className="pz-h-2 pz-w-full" />
        </div>

        <div className="pz-mt-5">
          <Skeleton className="pz-h-5 pz-w-32 pz-mb-3" />
          <div className="pz-flex pz-flex-col pz-gap-3 pz-mt-3">
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
            <Skeleton className="pz-h-6 pz-w-full pz-rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Heading level="3" className="pz-mb-5 pz-font-bold">
        {t('filters')}
      </Heading>

      <CheckboxGroupFilter
        title={t('crustType')}
        items={[
          { text: tCrust('thin'), value: '2' },
          { text: tCrust('traditional'), value: '1' },
        ]}
        selectedValues={filters.pizzaTypes}
        onSelect={filters.togglePizzaType}
        className="pz-mb-5"
      />

      <CheckboxGroupFilter
        title={t('sizes')}
        items={[
          { text: tSize('small'), value: '20' },
          { text: tSize('medium'), value: '30' },
          { text: tSize('large'), value: '40' },
        ]}
        selectedValues={filters.sizes}
        onSelect={filters.toggleSize}
        className="pz-mb-5"
      />

      <PriceRangeFilter />

      <CheckboxGroupFilter
        title={t('ingredients')}
        items={ingredients.map((item) => ({ value: String(item.id), text: item.name }))}
        selectedValues={filters.selectedIngredients}
        onSelect={filters.toggleIngredient}
        className="pz-mt-5"
        limit={6}
      />
    </div>
  );
};