import React from 'react';
import { Container } from '@/shared/container';
import { ProductToolbar } from '@/widgets/ProductToolbar';
import { ProductFilters } from '@/widgets/ProductFilters';
import { ProductGrid } from '@/widgets/ProductGrid';
import { ProductsSection } from '@/widgets/ProductsSection';
import { HeroPromos } from '@/widgets/HeroPromos';
import type { SearchParams } from '@/lib/server/filter-builders';
import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '../../../../prisma/prisma-client';
import { findProductsByCategory } from '@/lib/server/product-api';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const categoriesWithProducts = await findProductsByCategory(searchParams);
  const allCategories = await prisma.category.findMany({
    orderBy: {
      sortIndex: 'asc',
    },
  });
  const promoCards = await prisma.promoCard.findMany({
    where: { isActive: true },
    orderBy: { sortIndex: 'asc' },
  });

  return (
    <>
      <div className="pz-mt-6 pz-mb-8">
        <HeroPromos promoCards={promoCards} />
      </div>

      <ProductToolbar categories={allCategories} />

      <Container className="pz-mt-10 pz-pb-14">
        <ProductsSection filters={<ProductFilters />}>
          <div className="pz-flex pz-flex-col pz-gap-16">
            {categoriesWithProducts.length > 0 ? (
              categoriesWithProducts.map((category) => (
                <section key={category.id} id={category.name}>
                  <ProductGrid category={category} locale={locale} />
                </section>
              ))
            ) : (
              <p>{t('noProductsFound')}</p>
            )}
          </div>
        </ProductsSection>
      </Container>
    </>
  );
}