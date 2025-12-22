'use client';

import React from 'react';
import { Input } from '@/shared/ui/input';
import { useFormContext, FieldError } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ name, label, className, type, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const isNumber = type === 'number';

  const fieldProps = register(name, {
    valueAsNumber: isNumber,
  });

  return (
    <div className={cn('pz-w-full', className)}>
      {label && <Label htmlFor={name} className="pz-block pz-mb-2 pz-font-medium">{label}</Label>}
      <Input
        {...fieldProps}
        {...props}
        type={type}
        id={name}
        className={cn('pz-h-12', className)}
        aria-invalid={!!error}
      />
      {error && <p className="pz-text-red-500 pz-text-sm pz-mt-1">{error.message}</p>}
    </div>
  );
};