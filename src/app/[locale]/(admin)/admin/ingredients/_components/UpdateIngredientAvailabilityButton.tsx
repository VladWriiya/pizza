'use client';

import { updateIngredientAvailabilityAction } from '@/features/ingredient/actions/ingredient.mutations';
import { Switch } from '@/shared/ui/switch';
import React, { useTransition } from 'react';
import toast from 'react-hot-toast';

interface Props {
  id: number;
  isAvailable: boolean;
}

export const UpdateIngredientAvailabilityButton: React.FC<Props> = ({ id, isAvailable }) => {
  const [isPending, startTransition] = useTransition();

  const onToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await updateIngredientAvailabilityAction(id, checked);
      if (result.success) {
        toast.success('Availability updated!');
      } else {
        toast.error('Failed to update.');
      }
    });
  };

  return <Switch checked={isAvailable} onCheckedChange={onToggle} disabled={isPending} />;
};