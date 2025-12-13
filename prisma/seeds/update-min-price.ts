import { PrismaClient } from '@prisma/client';

export async function updateAllMinPrices(prisma: PrismaClient) {
  console.log('Updating min prices...');
  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    const items = await prisma.productItem.findMany({ where: { productId: product.id } });
    if (items.length > 0) {
      const minPrice = Math.min(...items.map(item => item.price));
      await prisma.product.update({
        where: { id: product.id },
        data: { minPrice },
      });
    }
  }
  console.log('Min prices updated.');
}