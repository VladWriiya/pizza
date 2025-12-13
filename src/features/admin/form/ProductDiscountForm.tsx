'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '@/shared/ui/checkbox';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { getPriceDisplay } from '@/lib/utils';

interface ProductDiscountFormProps {
  /** Current price for preview (for simple products) */
  price?: number;
  /** Min price for preview (for pizzas with multiple variants) */
  minPrice?: number;
}

export const ProductDiscountForm: React.FC<ProductDiscountFormProps> = ({ price, minPrice }) => {
  const { setValue, watch } = useFormContext();
  const discountPercent = watch('discountPercent');
  const hasDiscount = !!discountPercent && discountPercent > 0;

  // Use price or minPrice for preview
  const previewPrice = price || minPrice || 0;
  const priceInfo = getPriceDisplay(previewPrice, discountPercent);

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      setValue('discountPercent', 10, { shouldDirty: true });
    } else {
      setValue('discountPercent', null, { shouldDirty: true });
    }
  };

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setValue('discountPercent', null, { shouldDirty: true });
    } else {
      setValue('discountPercent', Math.min(99, Math.max(0, value)), { shouldDirty: true });
    }
  };

  return (
    <div className="pz-space-y-4">
      <div className="pz-flex pz-items-center pz-gap-3">
        <Checkbox
          id="hasDiscount"
          checked={hasDiscount}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="hasDiscount" className="pz-cursor-pointer">
          On Sale (Apply Discount)
        </Label>
      </div>

      {hasDiscount && (
        <div className="pz-ps-9 pz-space-y-4">
          <div className="pz-flex pz-items-center pz-gap-3">
            <Label htmlFor="discountPercent" className="pz-shrink-0">
              Discount:
            </Label>
            <div className="pz-flex pz-items-center pz-gap-2">
              <Input
                id="discountPercent"
                type="number"
                min={1}
                max={99}
                value={discountPercent || ''}
                onChange={handlePercentChange}
                className="pz-w-20 pz-h-10"
              />
              <span className="pz-text-gray-500">%</span>
            </div>
          </div>

          {/* Preview */}
          {previewPrice > 0 && (
            <div className="pz-bg-gray-50 pz-rounded-lg pz-p-4">
              <p className="pz-text-sm pz-text-gray-500 pz-mb-2">Preview:</p>
              <div className="pz-flex pz-items-center pz-gap-3">
                <span className="pz-bg-red-500 pz-text-white pz-text-xs pz-font-bold pz-px-2 pz-py-1 pz-rounded">
                  -{priceInfo.discountPercent}%
                </span>
                <span className="pz-line-through pz-text-gray-400">
                  {priceInfo.original} ₪
                </span>
                <span className="pz-text-primary pz-font-bold pz-text-lg">
                  {priceInfo.discounted} ₪
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
