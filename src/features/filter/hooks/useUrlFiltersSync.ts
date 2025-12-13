'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import qs from 'qs';
import type { Filters } from './use-filters';

export const useUrlFiltersSync = (filters: Filters) => {
  const router = useRouter();
  const pathname = usePathname();

  const queryString = useMemo(() => {
    const params = {
      ...filters.prices,
      pizzaTypes: Array.from(filters.pizzaTypes),
      sizes: Array.from(filters.sizes),
      ingredients: Array.from(filters.selectedIngredients),
    };

    return qs.stringify(params, {
      arrayFormat: 'comma',
      skipNulls: true,
    });
  }, [filters.prices, filters.pizzaTypes, filters.sizes, filters.selectedIngredients]);

  useEffect(() => {
    if (!filters.isReady) return;

    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newUrl, { scroll: false });
  }, [queryString, pathname, router, filters.isReady]);
};
