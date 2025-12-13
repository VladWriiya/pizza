'use client';

import React from 'react';
import { Checkbox as ShadcnCheckbox } from '@/shared/ui/checkbox';
import type { CheckboxProps as ShadcnCheckboxProps } from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';

interface CheckboxWithLabelProps extends ShadcnCheckboxProps {
  label: React.ReactNode;
  endAdornment?: React.ReactNode;
  className?: string;
}

export const CheckboxWithLabel = React.forwardRef<React.ElementRef<typeof ShadcnCheckbox>, CheckboxWithLabelProps>(
  ({ className, label, endAdornment, ...props }, ref) => {
    return (
      <label className={cn('pz-flex pz-items-center pz-space-x-2 pz-cursor-pointer', className)}>
        <ShadcnCheckbox ref={ref} {...props} className="pz-rounded-[8px] pz-w-6 pz-h-6" />
        <span className="pz-leading-none pz-flex-1">{label}</span>
        {endAdornment}
      </label>
    );
  }
);

CheckboxWithLabel.displayName = 'CheckboxWithLabel';
