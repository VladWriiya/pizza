import { DiscountType } from '@prisma/client';

export const coupons = [
  {
    code: 'SALE20',
    discount: 20,
    discountType: DiscountType.PERCENTAGE,
    isActive: true,
  },
  {
    code: '50ILS-OFF',
    discount: 50,
    discountType: DiscountType.FIXED_AMOUNT,
    isActive: true,
  },
  {
    code: 'EXPIRED',
    discount: 10,
    discountType: DiscountType.PERCENTAGE,
    isActive: true,
    expiresAt: new Date('2020-01-01'),
  },
  {
    code: 'INACTIVE',
    discount: 15,
    discountType: DiscountType.PERCENTAGE,
    isActive: false,
  },
];