'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SimpleProductFormValues, pizzaFormSchema, PizzaFormValues, simpleProductFormSchema } from '@/lib/schemas/product-schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '../../../../prisma/prisma-client';
import { prepareProductData, updateProductMinPrice } from '@/lib/server/services/product.service';

export async function updateSimpleProductAction(id: number, data: SimpleProductFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const validation = simpleProductFormSchema.safeParse(data);
  if (!validation.success) throw new Error('Invalid product data.');

  const { price, categoryId, ...productData } = validation.data;
  const preparedData = prepareProductData(productData);

  await prisma.product.update({
    where: { id },
    data: {
      ...preparedData,
      category: { connect: { id: categoryId } },
    },
  });
  await prisma.productItem.updateMany({ where: { productId: id }, data: { price } });
  await updateProductMinPrice(id);

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/edit/${id}`);
  redirect('/admin/products');
}

export async function updatePizzaAction(id: number, data: PizzaFormValues) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  const validation = pizzaFormSchema.safeParse(data);
  if (!validation.success) throw new Error('Invalid product data.');

  const { items, ingredients, ...productData } = validation.data;
  const preparedData = prepareProductData(productData);

  await prisma.$transaction(async (tx) => {
    await tx.product.update({
      where: { id },
      data: {
        ...preparedData,
        ingredients: { set: ingredients.map((ingId) => ({ id: ingId })) },
      },
    });
    await tx.productItem.deleteMany({ where: { productId: id } });
    await tx.productItem.createMany({
      data: items.map((item) => ({ ...item, productId: id })),
    });
  });
  await updateProductMinPrice(id);

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/edit/${id}`);
  redirect('/admin/products');
}