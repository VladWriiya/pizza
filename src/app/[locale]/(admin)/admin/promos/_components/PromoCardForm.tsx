'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/ui/button';
import { promoCardFormSchema, PromoCardFormValues } from '@/lib/schemas/promo.schema';
import { createPromoCardAction } from '@/features/promo/actions/promo.mutations';
import { PromoCardFormFields } from './PromoCardFormFields';
import toast from 'react-hot-toast';

interface Props {
  onCreated: () => void;
}

export const PromoCardForm: React.FC<Props> = ({ onCreated }) => {
  const form = useForm<PromoCardFormValues>({
    resolver: zodResolver(promoCardFormSchema),
    defaultValues: {
      title_en: '',
      title_he: '',
      subtitle_en: '',
      subtitle_he: '',
      imageUrl: '',
      actionType: 'info',
      actionValue: '',
      isActive: true,
    },
  });

  const onSubmit = async (data: PromoCardFormValues) => {
    const result = await createPromoCardAction(data);
    if (result.success) {
      toast.success('Promo card created!');
      form.reset();
      onCreated();
    } else {
      toast.error('Failed to create promo card');
    }
  };

  return (
    <div className="pz-bg-white pz-p-6 pz-rounded-lg pz-shadow-sm">
      <h3 className="pz-font-semibold pz-mb-4">Add New Promo Card</h3>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pz-space-y-4">
          <PromoCardFormFields />
          <Button type="submit" loading={form.formState.isSubmitting} className="pz-w-full">
            Create Promo Card
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
