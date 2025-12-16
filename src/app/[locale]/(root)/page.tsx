import React from 'react';
import { Container } from '@/shared/container';
import { ProductToolbar } from '@/widgets/ProductToolbar';
import { ProductFilters } from '@/widgets/ProductFilters';
import { ProductGrid } from '@/widgets/ProductGrid';
import { ProductsSection } from '@/widgets/ProductsSection';
import { HeroPromos } from '@/widgets/HeroPromos';
import { EmptyFilterResults } from '@/shared/EmptyFilterResults';
import type { SearchParams } from '@/lib/server/filter-builders';
import { getTranslations, getLocale } from 'next-intl/server';
import { prisma } from '../../../../prisma/prisma-client';
import { findProductsByCategory } from '@/lib/server/product-api';
import { getIngredientsAction } from '@/features/product/actions/product.queries';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const t = await getTranslations('HomePage');
  const locale = await getLocale();
  const categoriesWithProducts = await findProductsByCategory(searchParams);
  const [allCategories, promoCards, rawIngredients] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortIndex: 'asc' } }),
    prisma.promoCard.findMany({ where: { isActive: true }, orderBy: { sortIndex: 'asc' } }),
    getIngredientsAction(),
  ]);

  const ingredients = rawIngredients.map((ingredient) => {
    const translations = ingredient.translations as { [key: string]: { name?: string } } | null;
    return {
      ...ingredient,
      name: translations?.[locale]?.name || ingredient.name,
    };
  });

  return (
    <>
      <div className="pz-mt-6 pz-mb-8">
        <HeroPromos promoCards={promoCards} />
      </div>

      <ProductToolbar categories={allCategories} ingredients={ingredients} />

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
              <EmptyFilterResults message={t('noProductsFound')} />
            )}
          </div>
        </ProductsSection>
      </Container>
    </>
  );
}