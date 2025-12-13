'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Heading } from '@/shared/Heading';
import { Input } from '@/shared/ui/input';
import { Slider } from '@/shared/ui/slider';
import { useFilters } from '@/features/filter/hooks/use-filters';
import { useTranslations } from 'next-intl';

export const PriceRangeFilter = ({ className }: { className?: string }) => {
  const t = useTranslations('HomePage');
  const filters = useFilters();
  const minPrice = 0;
  const maxPrice = 200;
  const priceStep = 10;

  const handlePriceChange = (newValues: number[]) => {
    filters.setPrices('priceFrom', newValues[0]);
    filters.setPrices('priceTo', newValues[1]);
  };

  const priceFrom = filters.prices.priceFrom ?? minPrice;
  const priceTo = filters.prices.priceTo ?? maxPrice;

  return (
    <div className={cn('pz-mt-5 pz-border-y pz-border-neutral-100 pz-py-6 pz-pb-7', className)}>
      <Heading level="5" className="pz-font-bold pz-mb-3">
        {t('priceRange')}
      </Heading>
      <div className="pz-flex pz-gap-3 pz-mb-5">
        <Input
          type="number"
          placeholder={String(minPrice)}
          value={String(priceFrom)}
          onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
        />
        <Input
          type="number"
          placeholder={String(maxPrice)}
          value={String(priceTo)}
          onChange={(e) => filters.setPrices('priceTo', Number(e.target.value))}
        />
      </div>
      <div className="pz-relative pz-mb-5">
        <Slider
          min={minPrice}
          max={maxPrice}
          step={priceStep}
          value={[priceFrom, priceTo]}
          onValueChange={handlePriceChange}
        />
        <div
          className="pz-absolute pz-text-sm -pz-bottom-6"
          style={{
            left: `${(priceFrom / maxPrice) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {priceFrom}
        </div>
        <div
          className="pz-absolute pz-text-sm -pz-bottom-6"
          style={{
            left: `${(priceTo / maxPrice) * 100}%`,
            transform: 'translateX(-50%)',
          }}
        >
          {priceTo}
        </div>
      </div>
    </div>
  );
};