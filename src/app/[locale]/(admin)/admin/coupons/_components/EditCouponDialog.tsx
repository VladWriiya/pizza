'use client';

import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/shared/ui/dialog';
import { Coupon } from '@prisma/client';
import React, { useState } from 'react';
import { CouponFormFields } from './CouponFormFields';
import { useForm, FormProvider } from 'react-hook-form';
import { CouponFormValues } from '@/lib/schemas/coupon.schema';

import { updateCouponAction } from '@/features/coupon/actions/coupon.mutations';
import toast from 'react-hot-toast';

interface Props {
  coupon: Coupon;
}

export const EditCouponDialog: React.FC<Props> = ({ coupon }) => {
  const [open, setOpen] = useState(false);
  const form = useForm<CouponFormValues>({
    
    defaultValues: {
        ...coupon,
        expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '',
    }
  });

  const onSubmit = async (data: CouponFormValues) => {
    const formData = new FormData();
     Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });
    formData.set('isActive', String(data.isActive));

    const result = await updateCouponAction(coupon.id, formData);
    if (result.success) {
        toast.success('Coupon updated!');
        setOpen(false);
    } else {
        const error = result?.error;
        if (typeof error === 'object') {
            Object.values(error).forEach((err) => err && toast.error((err as string[])[0]));
        } else if (typeof error === 'string') {
            toast.error(error);
        }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:pz-max-w-md pz-bg-white">
        <DialogHeader>
          <DialogTitle>Edit Coupon</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pz-space-y-4">
            <CouponFormFields />
            <div className="pz-flex pz-justify-end pz-gap-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit" loading={form.formState.isSubmitting}>Save Changes</Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};