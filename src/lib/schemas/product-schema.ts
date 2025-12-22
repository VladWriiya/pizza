import { z } from 'zod';
import { AvailabilityStatus } from '@prisma/client';

// Custom validation for image URLs - accepts both full URLs and local paths
const imageUrlSchema = z.string().refine(
  (val) => {
    // Allow local paths starting with /
    if (val.startsWith('/')) return true;
    // Allow full URLs
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Please enter a valid URL or local path (e.g., /images/product.png)' }
);

export const productItemSchema = z.object({
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  size: z.number().optional().nullable(),
  pizzaType: z.number().optional().nullable(),
});

const baseProductSchema = z.object({
  imageUrl: imageUrlSchema,
  availabilityStatus: z.nativeEnum(AvailabilityStatus),
  name_en: z.string().min(2, { message: 'English name is required.' }),
  name_he: z.string().min(2, { message: 'Hebrew name is required.' }),
});

export const simpleProductFormSchema = baseProductSchema.extend({
  categoryId: z.number().min(1, { message: 'Please select a category.' }),
  price: z.number().positive({ message: 'Price must be a positive number.' }),
  // Marketing description (promotional text)
  marketingDescription_en: z.string().optional(),
  marketingDescription_he: z.string().optional(),
  // Technical description (ingredients/composition)
  description_en: z.string().optional(),
  description_he: z.string().optional(),
  // Discount
  discountPercent: z.number().min(0).max(99).nullable().optional(),
});

export const pizzaFormSchema = baseProductSchema.extend({
  ingredients: z.array(z.number()).min(1, { message: 'Select at least one ingredient.' }),
  items: z.array(productItemSchema).min(1, { message: 'At least one variation is required.' }),
  // Discount
  discountPercent: z.number().min(0).max(99).nullable().optional(),
});

export type SimpleProductFormValues = z.infer<typeof simpleProductFormSchema>;
export type PizzaFormValues = z.infer<typeof pizzaFormSchema>;