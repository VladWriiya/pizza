'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import qs from 'qs';

interface PriceRange {
  priceFrom?: number;
  priceTo?: number;
}

export interface Filters {
  prices: PriceRange;
  pizzaTypes: Set<string>;
  sizes: Set<string>;
  selectedIngredients: Set<string>;
  category: string | null;
  sortBy: string | null;
  isReady: boolean;
  setPrices: (name: keyof PriceRange, value: number) => void;
  togglePizzaType: (value: string) => void;
  toggleSize: (value: string) => void;
  toggleIngredient: (value: string) => void;
  setCategory: (id: string | null) => void;
  setSortBy: (value: string) => void;
}

const getUrlSet = (searchParams: URLSearchParams, key: string): Set<string> => {
  const value = searchParams.get(key);
  return new Set(value ? value.split(',') : []);
};

export const useFilters = (): Filters => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [prices, setPrices] = useState<PriceRange>({});
  const [pizzaTypes, setPizzaTypes] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setPrices({
      priceFrom: searchParams.has('priceFrom') ? Number(searchParams.get('priceFrom')) : undefined,
      priceTo: searchParams.has('priceTo') ? Number(searchParams.get('priceTo')) : undefined,
    });
    setPizzaTypes(getUrlSet(searchParams, 'pizzaTypes'));
    setSizes(getUrlSet(searchParams, 'sizes'));
    setSelectedIngredients(getUrlSet(searchParams, 'ingredients'));
    setCategory(searchParams.get('category'));
    setSortBy(searchParams.get('sortBy'));
    setIsReady(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isReady) return;

    const params = {
      ...prices,
      pizzaTypes: Array.from(pizzaTypes),
      sizes: Array.from(sizes),
      ingredients: Array.from(selectedIngredients),
      category: category,
      sortBy: sortBy,
    };
    const queryString = qs.stringify(params, { arrayFormat: 'comma', skipNulls: true });
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [prices, pizzaTypes, sizes, selectedIngredients, category, sortBy, pathname, router, isReady]);

  const updateSet = (updater: React.Dispatch<React.SetStateAction<Set<string>>>, value: string) => {
    updater((prevSet) => {
      const newSet = new Set(prevSet);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const updatePrice = useCallback((name: keyof PriceRange, value: number) => {
    setPrices((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    prices,
    pizzaTypes,
    sizes,
    selectedIngredients,
    category,
    sortBy,
    isReady,
    setPrices: updatePrice,
    togglePizzaType: (value) => updateSet(setPizzaTypes, value),
    toggleSize: (value) => updateSet(setSizes, value),
    toggleIngredient: (value) => updateSet(setSelectedIngredients, value),
    setCategory,
    setSortBy,
  };
};
