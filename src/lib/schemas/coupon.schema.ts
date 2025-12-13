import { z } from 'zod';
import { DiscountType } from '@prisma/client';

export const couponFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters.'),
  discount: z.coerce.number().positive('Discount must be a positive number.'),
  discountType: z.nativeEnum(DiscountType),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;