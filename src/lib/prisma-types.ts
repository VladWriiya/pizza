import { Prisma } from '@prisma/client';

type Translation = { name?: string; description?: string };

export type WithTranslations<T> = T & {
  translations?: {
    en?: Translation;
    he?: Translation;
  } | Prisma.JsonValue;
};

export type ProductWithDetails = Prisma.ProductGetPayload<{
  include: {
    items: true;
    ingredients: true;
    baseIngredients: true;
  };
}>;

export type CartItemWithRelations = Prisma.CartItemGetPayload<{
  include: {
    productItem: {
      include: {
        product: {
          include: {
            baseIngredients: true;
          };
        };
      };
    };
    ingredients: true;
  };
}>;

export type CartWithRelations = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        productItem: {
          include: {
            product: {
              include: {
                baseIngredients: true;
              };
            };
          };
        };
        ingredients: true;
      };
    };
  };
}>;
