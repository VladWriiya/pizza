import React from 'react';
import { Link } from '@/i18n/navigation';
import { cn, getPriceDisplay } from '@/lib/utils';
import { Heading } from '@/shared/Heading';
import { Button } from '@/shared/ui/button';
import { Plus } from 'lucide-react';
import type { ProductWithDetails } from '@/lib/prisma-types';
import { AvailabilityStatus } from '@prisma/client';
import { getTranslations } from 'next-intl/server';

export interface ProductCardProps {
  product: ProductWithDetails;
  className?: string;
  locale: string;
}

export const ProductCard = async ({ product, className, locale }: ProductCardProps) => {
  const t = await getTranslations('ProductCard');
  const minPrice = Math.min(...product.items.map((item) => item.price));
  const hasMultipleVariants = product.items.length > 1;
  const priceInfo = getPriceDisplay(minPrice, product.discountPercent);

  type TranslationsType = { [key: string]: { name?: string } } | null;
  const productTranslations = product.translations as TranslationsType;
  const translatedName = productTranslations?.[locale]?.name || product.name;

  // Use marketing description if available, otherwise fall back to ingredient list
  const marketingDesc = product.marketingDescription as { en?: string; he?: string } | null;
  const translatedDescription = marketingDesc?.[locale as 'en' | 'he']
    || product.ingredients
        .map((ing) => {
          const ingTranslations = ing.translations as TranslationsType;
          return ingTranslations?.[locale]?.name || ing.name;
        })
        .join(', ');

  const isAvailable = product.availabilityStatus === AvailabilityStatus.AVAILABLE;
  const isTemporarilyUnavailable = product.availabilityStatus === AvailabilityStatus.TEMPORARILY_UNAVAILABLE;

  return (
    <div
      data-testid="product-card"
      className={cn(
        'pz-flex pz-flex-col pz-transition-opacity',
        !isAvailable && 'pz-opacity-50',
        className
      )}
    >
      <Link
        href={`/product/${product.id}`}
        scroll={false}
        className={cn(
          'pz-flex pz-justify-center pz-items-center pz-bg-secondary pz-rounded-lg pz-h-[260px] pz-relative',
          !isAvailable && 'pz-pointer-events-none'
        )}
      >
        {/* Discount badge */}
        {priceInfo.hasDiscount && (
          <span className="pz-absolute pz-top-3 pz-start-3 pz-bg-red-500 pz-text-white pz-text-xs pz-font-bold pz-px-2 pz-py-1 pz-rounded pz-z-10">
            -{priceInfo.discountPercent}%
          </span>
        )}
        {isTemporarilyUnavailable && (
          <div className="pz-absolute pz-inset-0 pz-bg-black/30 pz-flex pz-items-center pz-justify-center pz-rounded-lg pz-z-10">
            <span className="pz-text-white pz-font-bold pz-text-xl pz-bg-black/50 pz-px-4 pz-py-2 pz-rounded-md">
              Temporarily Unavailable
            </span>
          </div>
        )}
        <img
          className="pz-w-full pz-h-full pz-object-contain"
          src={product.imageUrl}
          alt={translatedName}
        />
      </Link>

      <div className="pz-flex-grow pz-flex pz-flex-col pz-mt-3">
        <Link
          href={`/product/${product.id}`}
          scroll={false}
          className={cn('pz-flex-grow', !isAvailable && 'pz-pointer-events-none')}
        >
          <Heading level="4" className="pz-font-bold pz-mb-1">
            {translatedName}
          </Heading>
          <p className="pz-text-base pz-text-gray-600 pz-italic pz-leading-snug">{translatedDescription}</p>
        </Link>
        <div className="pz-flex pz-justify-between pz-items-center pz-mt-4">
          <span className="pz-text-[20px]" data-testid="product-price">
            {hasMultipleVariants ? `${t('from')} ` : ''}
            {priceInfo.hasDiscount ? (
              <>
                <span className="pz-line-through pz-text-gray-400 pz-text-sm pz-me-2">
                  {priceInfo.original} ₪
                </span>
                <b className="pz-text-primary">{priceInfo.discounted} ₪</b>
              </>
            ) : (
              <b>{minPrice} ₪</b>
            )}
          </span>
          <Link
            href={`/product/${product.id}`}
            scroll={false}
            className={cn(!isAvailable && 'pz-pointer-events-none')}
          >
            <Button variant="outline" className="pz-text-base pz-font-bold" disabled={!isAvailable}>
              <Plus className="pz-w-5 pz-h-5 pz-mr-1" />
              {t('add')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};