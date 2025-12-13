'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useFilters } from './hooks/use-filters';

interface CategoryItem {
  id: number;
  internalName: string;
  displayName: string;
}

interface Props {
  items: CategoryItem[];
  className?: string;
}

export const CategoryFilter = ({ items, className }: Props) => {
  const { category: activeCategoryName, setCategory } = useFilters();

  const handleClick = (internalName: string) => {
    if (activeCategoryName === internalName) {
      setCategory(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCategory(internalName);
      const element = document.getElementById(internalName);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className={cn('pz-inline-flex pz-gap-1 pz-bg-secondary pz-p-1 pz-rounded-2xl', className)}>
      {items.map((item) => {
        const isActive = activeCategoryName === item.internalName;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.internalName)}
            className={cn(
              'pz-flex pz-items-center pz-font-bold pz-h-12 pz-rounded-2xl pz-px-6 pz-text-base pz-transition',
              isActive
                ? 'pz-bg-card pz-shadow-md pz-shadow-black/10 pz-text-primary'
                : 'pz-text-secondary-foreground hover:pz-text-primary'
            )}
          >
            {item.displayName}
          </button>
        );
      })}
    </div>
  );
};