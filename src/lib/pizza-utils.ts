import type { ProductItem } from "@prisma/client";
import type { Variant } from "@/shared/VariantSelector";
import { PizzaDoughType } from "../constants/pizza-options";


export const getAvailableSizes = (
  selectedDough: PizzaDoughType,
  productItems: ProductItem[],
  sizesData: Variant[] 
): Variant[] => {
  const availableItemsForDough = productItems.filter(item => item.pizzaType === selectedDough);
  return sizesData.map(size => ({
    ...size,
    disabled: !availableItemsForDough.some(item => String(item.size) === size.value),
  }));
};