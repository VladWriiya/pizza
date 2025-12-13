'use client';

import { FormInput } from '@/shared/form/FormInput';
import { FormSwitch } from '@/shared/form/FormSwitch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { DiscountType } from '@prisma/client';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const CouponFormFields = () => {
  const { control } = useFormContext();

  return (
    <>
      <FormInput name="code" label="Coupon Code" required />
      <FormInput name="discount" label="Discount" type="number" required />
      <Controller
        control={control}
        name="discountType"
        render={({ field }) => (
          <div>
            <label className="pz-block pz-mb-2 pz-font-medium">Discount Type</label>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DiscountType.PERCENTAGE}>Percentage</SelectItem>
                <SelectItem value={DiscountType.FIXED_AMOUNT}>Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      />
      <FormInput name="expiresAt" label="Expires At (optional)" type="date" />
      <FormSwitch name="isActive" label="Active" />
    </>
  );
};