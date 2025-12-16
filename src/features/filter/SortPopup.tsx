'use client';

import React from 'react';
import { useFilters } from './hooks/use-filters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { ArrowUpDown } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { useTranslations } from 'next-intl';

export const SortPopup = () => {
  const tOptions = useTranslations('HomePage.sortOptions');
  const { sortBy, setSortBy, isReady } = useFilters();

  const sortOptions = [
    { value: 'newest', label: tOptions('newest') },
    { value: 'price_asc', label: tOptions('price_asc') },
    { value: 'price_desc', label: tOptions('price_desc') },
  ];

  if (!isReady) {
    return (
      <Skeleton className="pz-inline-flex pz-items-center pz-h-11 pz-rounded-lg pz-bg-secondary pz-w-[180px]" />
    );
  }

  const activeLabel = sortOptions.find((opt) => opt.value === (sortBy || 'newest'))?.label;

  return (
    <Select value={sortBy || 'newest'} onValueChange={setSortBy}>
      <SelectTrigger className="pz-w-[180px] pz-h-11 pz-px-3 pz-bg-card pz-rounded-lg pz-border pz-border-border focus:pz-ring-2 focus:pz-ring-primary">
        <div className="pz-flex pz-items-center pz-gap-2">
          <ArrowUpDown size={16} className="pz-text-muted-foreground pz-shrink-0" />
          <SelectValue asChild>
            <span className="pz-font-medium pz-text-foreground pz-truncate">{activeLabel}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};