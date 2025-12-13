import { z } from 'zod';
export const categoryFormSchema = z.object({
   
    name_en: z.string().min(2, { message: 'English name is required.' }),
    name_he: z.string().min(2, { message: 'Hebrew name is required.' }),
});
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;