import { prisma } from '../../../../prisma/prisma-client';
import { buildTranslations } from './translation.service';
import { Prisma } from '@prisma/client';

export async function updateProductMinPrice(productId: number) {
  const productItems = await prisma.productItem.findMany({ where: { productId } });
  if (productItems.length === 0) {
    await prisma.product.update({ where: { id: productId }, data: { minPrice: 0 } });
    return;
  }
  const minPrice = Math.min(...productItems.map((item) => item.price));
  await prisma.product.update({ where: { id: productId }, data: { minPrice } });
}

type WithTranslationNames = {
  name_en: string;
  name_he: string;
};

type WithDescriptions = {
  marketingDescription_en?: string;
  marketingDescription_he?: string;
  description_en?: string;
  description_he?: string;
};

type PreparedProductData = {
  name: string;
  translations: Prisma.JsonObject;
  marketingDescription?: Prisma.JsonObject;
  description?: Prisma.JsonObject;
};

export function prepareProductData<T extends WithTranslationNames & Partial<WithDescriptions>>(
  data: T
): Omit<T, keyof WithTranslationNames | keyof WithDescriptions> & PreparedProductData {
  const {
    name_en,
    name_he,
    marketingDescription_en,
    marketingDescription_he,
    description_en,
    description_he,
    ...rest
  } = data;

  const translations = buildTranslations(name_en, name_he);

  // Build marketing description if provided
  const marketingDescription =
    marketingDescription_en || marketingDescription_he
      ? { en: marketingDescription_en || '', he: marketingDescription_he || '' }
      : undefined;

  // Build technical description (ingredients) if provided
  const description =
    description_en || description_he
      ? { en: description_en || '', he: description_he || '' }
      : undefined;

  return {
    ...rest,
    name: name_en,
    translations,
    ...(marketingDescription && { marketingDescription }),
    ...(description && { description }),
  } as Omit<T, keyof WithTranslationNames | keyof WithDescriptions> & PreparedProductData;
}