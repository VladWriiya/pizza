'use server';

import { prisma } from "../../../../prisma/prisma-client";



export async function getCategoriesAction() {
  return prisma.category.findMany({
    orderBy: {
      sortIndex: 'asc',
    },
  });
}