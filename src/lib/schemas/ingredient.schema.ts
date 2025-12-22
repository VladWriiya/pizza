import { z } from 'zod';

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
  { message: 'Please enter a valid URL or local path (e.g., /images/ingredient.png)' }
);

export const ingredientFormSchema = z.object({
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  imageUrl: imageUrlSchema,
  name_en: z.string().min(2, { message: 'English name is required.' }),
  name_he: z.string().min(2, { message: 'Hebrew name is required.' }),
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;