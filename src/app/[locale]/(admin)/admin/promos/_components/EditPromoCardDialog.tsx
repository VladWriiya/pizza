'use client';

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PromoCard } from '@prisma/client';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Pencil } from 'lucide-react';
import { promoCardFormSchema, PromoCardFormValues } from '@/lib/schemas/promo.schema';
import { updatePromoCardAction } from '@/features/promo/actions/promo.mutations';
import { PromoCardFormFields } from './PromoCardFormFields';
import toast from 'react-hot-toast';

interface Props {
  promoCard: PromoCard;
  onUpdated: () => void;
}

export const EditPromoCardDialog: React.FC<Props> = ({ promoCard, onUpdated }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<PromoCardFormValues>({
    resolver: zodResolver(promoCardFormSchema),
    defaultValues: {
      title_en: promoCard.title_en,
      title_he: promoCard.title_he,
      subtitle_en: promoCard.subtitle_en,
      subtitle_he: promoCard.subtitle_he,
      imageUrl: promoCard.imageUrl,
      actionType: promoCard.actionType as PromoCardFormValues['actionType'],
      actionValue: promoCard.actionValue || '',
      isActive: promoCard.isActive,
    },
  });

  const onSubmit = async (data: PromoCardFormValues) => {
    const result = await updatePromoCardAction(promoCard.id, data);
    if (result.success) {
      toast.success('Promo card updated!');
      setOpen(false);
      onUpdated();
    } else {
      toast.error('Failed to update promo card');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <Pencil size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="pz-max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Promo Card</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pz-space-y-4">
            <PromoCardFormFields />
            <div className="pz-flex pz-justify-end pz-gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" loading={form.formState.isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
