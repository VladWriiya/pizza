'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface BaseIngredientToggleProps {
  name: string;
  isRemoved: boolean;
  onClick: () => void;
}

export const BaseIngredientToggle: React.FC<BaseIngredientToggleProps> = ({
  name,
  isRemoved,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'pz-inline pz-underline pz-underline-offset-2 pz-decoration-dashed pz-cursor-pointer pz-transition-all',
        isRemoved
          ? 'pz-line-through pz-text-gray-400 pz-decoration-gray-400'
          : 'pz-text-gray-600 pz-decoration-gray-400 hover:pz-text-primary hover:pz-decoration-primary'
      )}
    >
      {name}
    </button>
  );
};
