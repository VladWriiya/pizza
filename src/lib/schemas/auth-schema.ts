import { z } from 'zod';
import { DiscountType } from '@prisma/client';

// Auth schemas
export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export const registerFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

// Coupon schemas
export const couponFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters.'),
  discount: z.number().positive('Discount must be a positive number.'),
  discountType: z.nativeEnum(DiscountType),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean(),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;