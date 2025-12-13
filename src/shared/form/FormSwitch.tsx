'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Switch } from '@/shared/ui/switch';
import { Label } from '@/shared/ui/label';



interface FormSwitchProps {
  name: string;
  label: string;
}

export const FormSwitch: React.FC<FormSwitchProps> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-center space-x-2">
          <Switch
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <Label htmlFor={name}>{label}</Label>
        </div>
      )}
    />
  );
};