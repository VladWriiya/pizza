'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
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

// Parse comma-separated URL param into Set
const parseUrlSet = (searchParams: URLSearchParams, key: string): Set<string> => {
  const value = searchParams.get(key);
  return new Set(value ? value.split(',') : []);
};

// Parse initial state from URL (runs once)
const parseInitialState = (searchParams: URLSearchParams) => ({
  prices: {
    priceFrom: searchParams.has('priceFrom') ? Number(searchParams.get('priceFrom')) : undefined,
    priceTo: searchParams.has('priceTo') ? Number(searchParams.get('priceTo')) : undefined,
  },
  pizzaTypes: parseUrlSet(searchParams, 'pizzaTypes'),
  sizes: parseUrlSet(searchParams, 'sizes'),
  selectedIngredients: parseUrlSet(searchParams, 'ingredients'),
  category: searchParams.get('category'),
  sortBy: searchParams.get('sortBy'),
});

// Toggle value in Set (immutable)
const toggleSetValue = (set: Set<string>, value: string): Set<string> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }
  return newSet;
};

const URL_UPDATE_DELAY = 300; // debounce delay for URL updates

export const useFilters = (): Filters => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track if initial state was loaded from URL
  const [isReady, setIsReady] = useState(false);
  const isInitialMount = useRef(true);
  const urlUpdateTimer = useRef<NodeJS.Timeout | null>(null);

  // Filter state
  const [prices, setPricesState] = useState<PriceRange>({});
  const [pizzaTypes, setPizzaTypes] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // Initialize state from URL on mount
  useEffect(() => {
    if (isInitialMount.current) {
      const initial = parseInitialState(searchParams);
      setPricesState(initial.prices);
      setPizzaTypes(initial.pizzaTypes);
      setSizes(initial.sizes);
      setSelectedIngredients(initial.selectedIngredients);
      setCategory(initial.category);
      setSortBy(initial.sortBy);
      setIsReady(true);
      isInitialMount.current = false;
    }
  }, [searchParams]);

  // Sync state to URL with debounce
  useEffect(() => {
    if (!isReady) return;

    // Clear pending update
    if (urlUpdateTimer.current) {
      clearTimeout(urlUpdateTimer.current);
    }

    urlUpdateTimer.current = setTimeout(() => {
      const params = {
        ...prices,
        pizzaTypes: Array.from(pizzaTypes),
        sizes: Array.from(sizes),
        ingredients: Array.from(selectedIngredients),
        category,
        sortBy,
      };

      const queryString = qs.stringify(params, { arrayFormat: 'comma', skipNulls: true });
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(newUrl, { scroll: false });
    }, URL_UPDATE_DELAY);

    return () => {
      if (urlUpdateTimer.current) {
        clearTimeout(urlUpdateTimer.current);
      }
    };
  }, [prices, pizzaTypes, sizes, selectedIngredients, category, sortBy, pathname, router, isReady]);

  // Memoized update functions
  const setPrices = useCallback((name: keyof PriceRange, value: number) => {
    setPricesState((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePizzaType = useCallback((value: string) => {
    setPizzaTypes((prev) => toggleSetValue(prev, value));
  }, []);

  const toggleSize = useCallback((value: string) => {
    setSizes((prev) => toggleSetValue(prev, value));
  }, []);

  const toggleIngredient = useCallback((value: string) => {
    setSelectedIngredients((prev) => toggleSetValue(prev, value));
  }, []);

  return {
    prices,
    pizzaTypes,
    sizes,
    selectedIngredients,
    category,
    sortBy,
    isReady,
    setPrices,
    togglePizzaType,
    toggleSize,
    toggleIngredient,
    setCategory,
    setSortBy,
  };
};
