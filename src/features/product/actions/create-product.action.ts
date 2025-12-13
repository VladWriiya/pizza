'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SimpleProductFormValues, pizzaFormSchema, PizzaFormValues, simpleProductFormSchema } from '@/lib/schemas/product-schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '../../../../prisma/prisma-client';
import { prepareProductData, updateProductMinPrice } from '@/lib/server/services/product.service';

export async function createSimpleProductAction(data: SimpleProductFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const validation = simpleProductFormSchema.safeParse(data);
  if (!validation.success) throw new Error('Invalid product data.');

  const { price, categoryId, ...productData } = validation.data;
  const preparedData = prepareProductData(productData);

  const product = await prisma.product.create({
    data: {
      ...preparedData,
      category: { connect: { id: categoryId } },
    },
  });
  await prisma.productItem.create({ data: { price, productId: product.id } });
  await updateProductMinPrice(product.id);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}

export async function createPizzaAction(data: PizzaFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const validation = pizzaFormSchema.safeParse(data);
  if (!validation.success) throw new Error('Invalid product data.');

  const { items, ingredients, ...productData } = validation.data;
  const preparedData = prepareProductData(productData);

  const pizzaCategory = await prisma.category.findFirst({ where: { name: { equals: 'pizza', mode: 'insensitive' } } });
  if (!pizzaCategory) throw new Error('"Pizza" category not found.');

  const product = await prisma.product.create({
    data: {
      ...preparedData,
      categoryId: pizzaCategory.id,
      ingredients: { connect: ingredients.map((id) => ({ id })) },
    },
  });
  await prisma.productItem.createMany({
    data: items.map((item) => ({ ...item, productId: product.id })),
  });
  await updateProductMinPrice(product.id);

  revalidatePath('/admin/products');
  redirect('/admin/products');
}