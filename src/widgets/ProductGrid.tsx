import React from 'react';
import { cn } from '@/lib/utils';
import { Heading } from '@/shared/Heading';
import { ProductCard } from '@/entities/product/ProductCard';
import type { ProductWithDetails } from '@/lib/prisma-types';
import type { Category } from '@prisma/client';

interface ProductGridProps {
  category: Category & { products: ProductWithDetails[] };
  className?: string;
  locale: string;
  favoriteIds?: number[];
}

export const ProductGrid = ({ category, className, locale, favoriteIds = [] }: ProductGridProps) => {
  const translations = category.translations as { [key: string]: { name?: string } } | null;
  const title = translations?.[locale]?.name || category.name;

  return (
    <section className={cn(className)}>
      <Heading level="2" className="pz-font-extrabold">
        {title}
      </Heading>
      <div className={cn(
        'pz-grid pz-grid-cols-1 sm:pz-grid-cols-2 md:pz-grid-cols-3 pz-gap-4 sm:pz-gap-6 md:pz-gap-10 pz-mt-6 md:pz-mt-10',
        'pz-transition-all pz-duration-300',
        // When parent has products-expanded class, show 4 columns
        'products-grid'
      )}>
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            isFavorite={favoriteIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
};