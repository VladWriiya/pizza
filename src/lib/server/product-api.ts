
import { Prisma, AvailabilityStatus } from '@prisma/client';
import {
  withPrice,
  withPizzaDetails,
  withIngredients,
  withQuery,
  withCategory,
  withSort,
  SearchParams,
} from './filter-builders';
import { prisma } from '../../../prisma/prisma-client';

export async function findProductsByCategory(params: SearchParams) {
  const productWhere: Prisma.ProductWhereInput = {
    availabilityStatus: {
      not: AvailabilityStatus.HIDDEN,
    },
    AND: [
      withPrice(params),
      withPizzaDetails(params),
      withIngredients(params),
      withQuery(params),
      withCategory(params),
    ],
  };

  const orderBy = withSort(params);

  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      translations: true,
      sortIndex: true,
      createdAt: true,
      updatedAt: true,
      products: {
        where: productWhere,
        orderBy,
        select: {
          id: true,
          name: true,
          imageUrl: true,
          description: true,
          marketingDescription: true,
          minPrice: true,
          availabilityStatus: true,
          translations: true,
          isNew: true,
          isPopular: true,
          discountPercent: true,
          categoryId: true,
          createdAt: true,
          updatedAt: true,
          items: {
            orderBy: {
              price: 'asc',
            },
          },
          ingredients: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              isAvailable: true,
              translations: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          baseIngredients: {
            select: {
              id: true,
              name: true,
              price: true,
              imageUrl: true,
              isAvailable: true,
              translations: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      },
    },
    orderBy: {
      sortIndex: 'asc',
    },
  });

  const nonEmptyCategories = categories.filter((category) => category.products.length > 0);
  return nonEmptyCategories;
}

export async function searchProductsByName(query: string) {
  if (!query) {
    return [];
  }
  return prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
      availabilityStatus: {
        not: AvailabilityStatus.HIDDEN,
      },
    },
    take: 5,
  });
}