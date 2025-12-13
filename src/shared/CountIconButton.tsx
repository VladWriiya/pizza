'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/lib/utils';

interface IconButtonProps {
  disabled?: boolean;
  type: 'plus' | 'minus';
  onClick?: () => void;
}

export const CountIconButton: React.FC<IconButtonProps> = ({ disabled, type, onClick }) => {
  return (
    <Button
      variant="outline"
      disabled={disabled}
      onClick={onClick}
      type="button"
      className={cn(
        'pz-p-0 pz-w-[30px] pz-h-[30px] pz-rounded-[10px] hover:pz-bg-primary hover:pz-text-white disabled:pz-bg-white disabled:pz-border-gray-400 disabled:pz-text-gray-400'
      )}
    >
      {type === 'plus' ? <Plus className="pz-h-4" /> : <Minus className="pz-h-4" />}
    </Button>
  );
};
