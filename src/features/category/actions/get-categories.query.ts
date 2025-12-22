'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { prisma } from "../../../../prisma/prisma-client";

export async function getCategoriesAction() {
  noStore();
  return prisma.category.findMany({
    orderBy: {
      sortIndex: 'asc',
    },
  });
}