'use client';

import React from 'react';
import { useFormContext, FieldError, UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';

interface FormFieldProps {
  name: string;
  label?: string;
  className?: string;
  children: (field: UseFormRegisterReturn, error?: FieldError) => React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ name, label, className, children }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name] as FieldError | undefined;
  const fieldProps = register(name);

  return (
    <div className={cn('pz-w-full', className)}>
      {label && <Label htmlFor={name} className="pz-block pz-mb-2 pz-font-medium">{label}</Label>}
      {children(fieldProps, error)}
      {error && <p className="pz-text-red-500 pz-text-sm pz-mt-1">{error.message}</p>}
    </div>
  );
};