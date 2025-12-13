import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seeds/users';
import { seedProductsAndIngredients } from './seeds/products-and-ingredients';
import { seedCartsAndOrders } from './seeds/carts-and-orders';
import { updateAllMinPrices } from './seeds/update-min-price';
import { seedCoupons } from './seeds/coupons';
import { seedCustomerUsers, seedHistoricalOrders } from './seeds/historical-data';
import { seedPromoCards } from './seeds/promo-cards';

const prisma = new PrismaClient();

async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Category" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Product" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "ProductItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Ingredient" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Cart" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "CartItem" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Order" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Coupon" RESTART IDENTITY CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "PromoCard" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await down();
    await seedUsers(prisma);
    await seedCustomerUsers(prisma); // 50+ customer users
    await seedProductsAndIngredients(prisma);
    await updateAllMinPrices(prisma);
    await seedCoupons(prisma);
    await seedPromoCards(prisma);
    await seedCartsAndOrders(prisma);
    await seedHistoricalOrders(prisma); // 200+ historical orders
  } catch (e) {
    console.error(e);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    await prisma.$disconnect();
    process.exit(1);
  });