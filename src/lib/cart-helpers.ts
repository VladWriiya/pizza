import { type PizzaDoughType, type PizzaSize } from '@/constants/pizza-options';
import { CartWithRelations, CartItemWithRelations } from '@/lib/prisma-types';

export type TransformedCartItem = {
  id: number;
  quantity: number;
  name: string;
  imageUrl: string;
  price: number;
  details: string;
  disabled?: boolean;
};

export interface TransformedCartData {
  items: TransformedCartItem[];
  totalAmount: number;
  couponCode: string | null;
}

const calculateItemPrice = (item: CartItemWithRelations): number => {
  const ingredientsPrice = item.ingredients.reduce((acc: number, ing) => acc + ing.price, 0);
  return ingredientsPrice + item.productItem.price;
};

type TranslationsType = { [key: string]: { name?: string } } | null;

const formatItemDetails = (
  item: CartItemWithRelations,
  locale: string,
  tDoughs: (key: string) => string,
): string => {
  const details = [];
  const pizzaType = item.productItem.pizzaType as PizzaDoughType | null;
  const pizzaSize = item.productItem.size as PizzaSize | null;

  if (pizzaSize && pizzaType) {
    const doughName = tDoughs(String(pizzaType) as '1' | '2');
    details.push(`${pizzaSize} см, ${doughName}`);
  }

  // Added ingredients (extras)
  if (item.ingredients.length > 0) {
    details.push(`+ ${item.ingredients.map((ing) => {
        const translations = ing.translations as TranslationsType;
        return translations?.[locale]?.name || ing.name;
    }).join(', ')}`);
  }

  // Removed ingredients (from baseIngredients)
  const removedIds = (item.removedIngredientIds as number[]) || [];
  if (removedIds.length > 0) {
    const baseIngredients = item.productItem.product.baseIngredients || [];
    const removedNames = removedIds
      .map((id) => {
        const ing = baseIngredients.find((bi) => bi.id === id);
        if (!ing) return null;
        const translations = ing.translations as TranslationsType;
        return translations?.[locale]?.name || ing.name;
      })
      .filter(Boolean);

    if (removedNames.length > 0) {
      details.push(`- ${removedNames.join(', ')}`);
    }
  }

  return details.join(' | ');
};

export const transformCartData = (
  data: CartWithRelations | null,
  locale: string,
  tDoughs: (key: string) => string,
): TransformedCartData => {
  if (!data || !data.items) {
    return { items: [], totalAmount: 0, couponCode: null };
  }

  const items: TransformedCartItem[] = data.items.map((item) => {
    const productTranslations = item.productItem.product.translations as TranslationsType;
    const translatedName = productTranslations?.[locale]?.name || item.productItem.product.name;
    
    return {
        id: item.id,
        quantity: item.quantity,
        name: translatedName,
        imageUrl: item.productItem.product.imageUrl,
        price: calculateItemPrice(item),
        disabled: false,
        details: formatItemDetails(item, locale, tDoughs),
    };
  });

  return { items, totalAmount: data.totalAmount, couponCode: data.couponCode || null };
};