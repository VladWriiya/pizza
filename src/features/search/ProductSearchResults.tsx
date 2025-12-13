import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import type { Product } from '@prisma/client';

interface ProductSearchResultsProps {
  products: Product[];
  onItemClick?: () => void;
  className?: string;
}

export const ProductSearchResults = ({ products, onItemClick, className }: ProductSearchResultsProps) => {
  return (
    <div
      className={cn(
        'pz-absolute pz-w-full pz-bg-white pz-rounded-xl pz-py-2 pz-top-14 pz-shadow-md pz-transition-all pz-duration-200 invisible pz-opacity-0 z-30',
        className
      )}
    >
      {products.map((product) => (
        <Link
          onClick={onItemClick}
          key={product.id}
          className="pz-flex pz-items-center pz-gap-3 pz-w-full pz-px-3 pz-py-2 hover:pz-bg-primary/10"
          href={`/product/${product.id}`}
        >
          <img className="pz-rounded-sm pz-w-8 pz-h-8" src={product.imageUrl} alt={product.name} />
          <span>{product.name}</span>
        </Link>
      ))}
    </div>
  );
};
