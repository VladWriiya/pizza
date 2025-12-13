import { PrismaClient } from '@prisma/client';
import { coupons } from '../data/coupons';

export async function seedCoupons(prisma: PrismaClient) {
  console.log('Seeding coupons...');
  await prisma.coupon.createMany({
    data: coupons,
  });
  console.log('Coupons seeded.');
}