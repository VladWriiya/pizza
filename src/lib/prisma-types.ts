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

// Optimized cart types - only fields needed for display
export type CartItemWithRelations = {
  id: number;
  quantity: number;
  removedIngredientIds: Prisma.JsonValue;
  productItem: {
    price: number;
    size: number | null;
    pizzaType: number | null;
    product: {
      name: string;
      imageUrl: string;
      translations: Prisma.JsonValue;
      baseIngredients: {
        id: number;
        name: string;
        translations: Prisma.JsonValue;
      }[];
    };
  };
  ingredients: {
    id: number;
    name: string;
    price: number;
    translations: Prisma.JsonValue;
  }[];
};

export type CartWithRelations = {
  id: number;
  token: string;
  totalAmount: number;
  couponCode: string | null;
  items: CartItemWithRelations[];
};
