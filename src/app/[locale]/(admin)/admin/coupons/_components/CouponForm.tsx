'use client';

import { Button } from '@/shared/ui/button';
import React from 'react';
import toast from 'react-hot-toast';
import { FormProvider, useForm } from 'react-hook-form';

import { CouponFormValues } from '@/lib/schemas/coupon.schema';
import { DiscountType } from '@prisma/client';
import { createCouponAction } from '@/features/coupon/actions/coupon.mutations';
import { CouponFormFields } from './CouponFormFields';

export const CouponForm = () => {
  const form = useForm<CouponFormValues>({
   
    defaultValues: {
        code: '',
        discount: undefined,
        discountType: DiscountType.PERCENTAGE,
        isActive: true,
        expiresAt: '',
    }
  });

  const handleFormSubmit = async (data: CouponFormValues) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });
    
    formData.set('isActive', String(data.isActive));

    const result = await createCouponAction(formData);
    if (result?.success) {
      toast.success('Coupon created successfully!');
      form.reset();
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
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="pz-space-y-4 pz-p-4 pz-bg-gray-50 pz-rounded-lg">
        <h2 className="pz-text-lg pz-font-semibold">Add New Coupon</h2>
        <CouponFormFields />
        <Button type="submit" loading={form.formState.isSubmitting}>Create</Button>
      </form>
    </FormProvider>
  );
};