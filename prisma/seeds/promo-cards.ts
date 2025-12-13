import { PrismaClient } from '@prisma/client';
import { promoCards } from '../data/promoCards';

export async function seedPromoCards(prisma: PrismaClient) {
  console.log('🎠 Seeding promo cards...');

  for (const card of promoCards) {
    await prisma.promoCard.create({
      data: card,
    });
  }

  console.log(`✅ Created ${promoCards.length} promo cards`);
}
