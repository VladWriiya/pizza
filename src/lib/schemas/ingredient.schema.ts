import { z } from 'zod';

export const ingredientFormSchema = z.object({
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  imageUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  name_en: z.string().min(2, { message: 'English name is required.' }),
  name_he: z.string().min(2, { message: 'Hebrew name is required.' }),
});

export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;