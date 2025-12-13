'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { AvailabilityStatus } from '@prisma/client';
import { Label } from '@/shared/ui/label';
import { SegmentedControl, SegmentedControlItem } from '@/shared/SegmentedControl';

const statusOptions = [
  { value: AvailabilityStatus.AVAILABLE, label: 'On Sale' },
  { value: AvailabilityStatus.TEMPORARILY_UNAVAILABLE, label: 'Temporarily Unavailable' },
  { value: AvailabilityStatus.HIDDEN, label: 'Hidden' },
];

export const ProductAvailabilityForm = () => {
  const { setValue, watch } = useFormContext();

  const currentStatus = watch('availabilityStatus');
  return (
    <div className="pz-flex pz-items-center pz-gap-5">
      <Label className="pz-shrink-0">Product Status</Label>
      <div>
        <SegmentedControl
          value={currentStatus}
          onValueChange={(value: string) => {
            setValue('availabilityStatus', value as AvailabilityStatus, {
              shouldDirty: true,
              shouldTouch: true,
            });
          }}
        >
          {statusOptions.map((option) => (
            <SegmentedControlItem key={option.value} value={option.value}>
              {option.label}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
        <p className="pz-text-xs pz-text-gray-500 pz-mt-2">
          <b>Temporarily Unavailable:</b> shown in the menu, but cannot be ordered.
          <br />
          <b>Hidden:</b> completely removed from the menu.
        </p>
      </div>
    </div>
  );
};