'use client';

import { getCategoriesAction } from '@/features/category/actions/get-categories.query';
import { Category } from '@prisma/client';
import { useEffect, useState } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    getCategoriesAction().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    setCategories,
    loading,
    fetchCategories,
  };
};