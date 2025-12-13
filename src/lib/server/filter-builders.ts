import { Prisma } from '@prisma/client';

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export function withPrice(params: SearchParams): Prisma.ProductWhereInput {
  const minPrice = Number(params.priceFrom) || 0;
  const maxPrice = Number(params.priceTo) || 1000;

  return {
    items: {
      some: {
        price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    },
  };
}

export function withPizzaDetails(params: SearchParams): Prisma.ProductWhereInput {
  const sizes = (params.sizes as string)?.split(',').map(Number);
  const pizzaTypes = (params.pizzaTypes as string)?.split(',').map(Number);

  if ((!sizes || sizes.length === 0) && (!pizzaTypes || pizzaTypes.length === 0)) {
    return {};
  }

  return {
    items: {
      some: {
        AND: [
          sizes && sizes.length > 0 ? { size: { in: sizes } } : {},
          pizzaTypes && pizzaTypes.length > 0 ? { pizzaType: { in: pizzaTypes } } : {},
        ],
      },
    },
  };
}

export function withIngredients(params: SearchParams): Prisma.ProductWhereInput {
  const ingredientIds = (params.ingredients as string)?.split(',').map(Number);
  if (!ingredientIds || ingredientIds.length === 0) return {};

  return {
    ingredients: {
      some: {
        id: { in: ingredientIds },
      },
    },
  };
}

export function withQuery(params: SearchParams): Prisma.ProductWhereInput {
  const query = params.query as string;
  if (!query) return {};

  return {
    name: {
      contains: query,
      mode: 'insensitive',
    },
  };
}

export function withCategory(params: SearchParams): Prisma.ProductWhereInput {
  const categoryId = Number(params.category);
  if (!categoryId) return {};

  return {
    categoryId: categoryId,
  };
}

export function withSort(params: SearchParams): Prisma.ProductOrderByWithRelationInput {
  const sortBy = params.sortBy as string;

  switch (sortBy) {
    case 'newest':
      return { createdAt: 'desc' };
    case 'price_asc':
      return { minPrice: 'asc' };
    case 'price_desc':
      return { minPrice: 'desc' };
    case 'popular':
    default:
      return { id: 'asc' };
  }
}
