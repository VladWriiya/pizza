'use client';

import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useClickAway, useDebounce } from 'react-use';
import type { Product } from '@prisma/client';
import { ProductSearchInput } from './ProductSearchInput';
import { ProductSearchResults } from './ProductSearchResults';
import { useTranslations } from 'next-intl';
import { searchProductsAction } from '../product/actions/product.queries';

interface ProductSearchProps {
  className?: string;
}

export const ProductSearch = ({ className }: ProductSearchProps) => {
  const t = useTranslations('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const ref = useRef(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(
    async () => {
      try {
        const response = await searchProductsAction(searchQuery);
        setProducts(response);
      } catch (error) {
        console.error(error);
      }
    },
    300,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery('');
    setProducts([]);
  };

  return (
    <>
      {focused && <div className="pz-fixed pz-top-0 pz-left-0 pz-bottom-0 pz-right-0 pz-bg-black/50 pz-z-30" />}

      <div
        ref={ref}
        className={cn('pz-flex pz-rounded-2xl pz-flex-1 pz-relative pz-z-30', className)}
      >
        <ProductSearchInput
          placeholder={t('searchPlaceholder')}
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <ProductSearchResults
          products={products}
          onItemClick={onClickItem}
          className={cn(
            focused && products.length > 0 && 'pz-visible pz-opacity-100 pz-top-12'
          )}
        />
      </div>
    </>
  );
};