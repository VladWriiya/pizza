import { z } from 'zod';

export const orderFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  address: z.string().min(5, { message: 'Please enter a valid address.' }),
  apartment: z.string().optional(),
  comment: z.string().optional(),
  // Pre-order scheduling: ISO string or empty for ASAP
  scheduledFor: z.string().optional(),
});

export const orderItemSchema = z.object({
  id: z.number(),
  productItemId: z.number(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  imageUrl: z.string().url(),
  details: z.string().optional(),
  ingredientIds: z.array(z.number()).optional(),
  removedIngredientIds: z.array(z.number()).optional(),
});

export const orderItemsSchema = z.array(orderItemSchema);

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
