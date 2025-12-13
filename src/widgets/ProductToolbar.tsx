'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Container } from '@/shared/container';
import { CategoryFilter } from '@/features/filter/CategoryFilter';
import { SortPopup } from '@/features/filter/SortPopup';
import type { Category } from '@prisma/client';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';

interface ProductToolbarProps {
  categories: Category[];
  className?: string;
}

export const ProductToolbar = ({ categories, className }: ProductToolbarProps) => {
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
    <div className={cn('pz-sticky pz-top-0 pz-bg-card pz-py-5 pz-shadow-lg pz-shadow-black/5 pz-z-10', className)}>
      <Container className="pz-flex pz-items-center pz-justify-between">
        <div className="pz-flex pz-items-center pz-gap-4">
          <Link
            href="/"
            className={cn(
              'pz-flex pz-items-center pz-overflow-hidden pz-transition-all pz-duration-300',
              isScrolled ? 'pz-w-[50px] pz-opacity-100' : 'pz-w-0 pz-opacity-0'
            )}
          >
            <Image
              src="/logo.webp"
              alt="Collibri Pizza"
              width={50}
              height={50}
              className="pz-min-w-[50px]"
            />
          </Link>
          <CategoryFilter items={translatedCategories} />
        </div>
        <SortPopup />
      </Container>
    </div>
  );
};