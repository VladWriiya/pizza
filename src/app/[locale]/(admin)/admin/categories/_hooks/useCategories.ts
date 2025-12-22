'use client';

import { getCategoriesAction } from '@/features/category/actions/get-categories.query';
import { Category } from '@prisma/client';
import { useCallback, useEffect, useState } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const data = await getCategoriesAction();
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    setCategories,
    loading,
    fetchCategories,
  };
};