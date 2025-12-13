'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface CountButtonProps {
  value?: number;
  onClick?: (type: 'plus' | 'minus') => void;
  className?: string;
}

export const CountButton: React.FC<CountButtonProps> = ({ className, onClick, value = 1 }) => {
  return (
    <div className={cn('pz-inline-flex pz-items-center pz-gap-3 pz-bg-gray-100 pz-rounded-full', className)}>
      <button
        type="button"
        onClick={() => onClick?.('minus')}
        disabled={value <= 1}
        data-testid="count-minus"
        className="pz-w-8 pz-h-8 pz-flex pz-items-center pz-justify-center pz-rounded-full pz-text-gray-500 hover:pz-text-primary disabled:pz-opacity-50"
      >
        <Minus size={16} />
      </button>

      <span className="pz-font-bold pz-w-5 pz-text-center" data-testid="count-value">{value}</span>

      <button
        type="button"
        onClick={() => onClick?.('plus')}
        data-testid="count-plus"
        className="pz-w-8 pz-h-8 pz-flex pz-items-center pz-justify-center pz-rounded-full pz-text-gray-500 hover:pz-text-primary"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
