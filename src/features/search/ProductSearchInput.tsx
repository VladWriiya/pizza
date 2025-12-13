'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

type ProductSearchInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const ProductSearchInput = React.forwardRef<HTMLInputElement, ProductSearchInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className={cn('pz-relative pz-flex-1', className)}>
        <Search className="pz-absolute pz-top-1/2 pz-translate-y-[-50%] pz-left-3 pz-h-5 pz-text-gray-400" />
        <input
          ref={ref}
          className="pz-rounded-2xl pz-outline-none pz-w-full pz-bg-gray-100 pz-pl-11 pz-h-11"
          {...props}
        />
      </div>
    );
  }
);
ProductSearchInput.displayName = 'ProductSearchInput';
