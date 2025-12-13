'use server';


import { Product, Ingredient } from '@prisma/client';
import { searchProductsByName as searchInDb } from '@/lib/server/product-api';
import { prisma } from '../../../../prisma/prisma-client';

export async function getProductsAction(): Promise<Product[]> {
  return prisma.product.findMany({
    orderBy: {
      id: 'asc',
    },
  });
}

export async function searchProductsAction(query: string): Promise<Product[]> {
  return searchInDb(query);
}

export async function getIngredientsAction(): Promise<Ingredient[]> {
  return prisma.ingredient.findMany({ orderBy: { id: 'asc' } });
}