'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/shared/container';
import { CategoryFilter } from '@/features/filter/CategoryFilter';
import { SortPopup } from '@/features/filter/SortPopup';
import { MobileFilters } from './MobileFilters';
import { ProductFiltersClient } from './ProductFiltersClient';
import type { Category, Ingredient } from '@prisma/client';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface ProductToolbarProps {
  categories: Category[];
  ingredients?: Ingredient[];
  className?: string;
}

export const ProductToolbar = ({ categories, ingredients = [], className }: ProductToolbarProps) => {
  const locale = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const translatedCategories = categories.map((category) => {
    const translations = category.translations as { [key: string]: { name?: string } } | null;
    return {
      id: category.id,
      internalName: category.name,
      displayName: translations?.[locale]?.name || category.name,
    };
  });

  return (
    <div className={cn('pz-sticky pz-top-0 pz-bg-card pz-py-2 md:pz-py-5 pz-shadow-lg pz-shadow-black/5 pz-z-10', className)}>
      <Container className="pz-flex pz-flex-col md:pz-flex-row pz-items-stretch md:pz-items-center pz-justify-between pz-gap-2">
        {/* Row 1: Logo + Categories (scrollable on mobile) */}
        <div className="pz-flex pz-items-center pz-gap-2 md:pz-gap-4 pz-min-w-0">
          <Link
            href="/"
            className={cn(
              'pz-flex pz-items-center pz-overflow-hidden pz-transition-all pz-duration-300 pz-shrink-0',
              isScrolled ? 'pz-w-[40px] md:pz-w-[50px] pz-opacity-100' : 'pz-w-0 pz-opacity-0'
            )}
          >
            <Image
              src="/logo.webp"
              alt="Collibri Pizza"
              width={50}
              height={50}
              className="pz-min-w-[40px] md:pz-min-w-[50px] pz-w-[40px] md:pz-w-[50px]"
            />
          </Link>
          <div className="pz-overflow-x-auto pz-scrollbar-hide pz-flex-1">
            <CategoryFilter items={translatedCategories} />
          </div>
        </div>

        {/* Row 2 on mobile: Filters + Sort */}
        <div className="pz-flex pz-items-center pz-justify-between md:pz-justify-end pz-gap-2 pz-shrink-0">
          <MobileFilters>
            <ProductFiltersClient ingredients={ingredients} />
          </MobileFilters>
          <SortPopup />
        </div>
      </Container>
    </div>
  );
};