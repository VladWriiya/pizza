import { z } from 'zod';

export const actionTypes = ['scroll', 'link', 'external', 'copy', 'modal', 'info'] as const;
export type ActionType = typeof actionTypes[number];

export const promoCardFormSchema = z.object({
  title_en: z.string().min(1, 'English title is required'),
  title_he: z.string().min(1, 'Hebrew title is required'),
  subtitle_en: z.string().min(1, 'English subtitle is required'),
  subtitle_he: z.string().min(1, 'Hebrew subtitle is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  actionType: z.enum(actionTypes),
  actionValue: z.string().optional(),
  isActive: z.boolean(),
});

export type PromoCardFormValues = z.infer<typeof promoCardFormSchema>;
