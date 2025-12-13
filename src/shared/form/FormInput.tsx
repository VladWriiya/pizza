'use client';

import React from 'react';
import { Input } from '@/shared/ui/input';
import { FormField } from './FormField';
import { cn } from '@/lib/utils';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, className, ...props }) => {
  return (
    <FormField name={name} label={label} className={className}>
      {(field, error) => (
        <Input
          {...field}
          {...props}
          id={name}
          className={cn('pz-h-12', className)} 
          aria-invalid={!!error}
        />
      )}
    </FormField>
  );
};