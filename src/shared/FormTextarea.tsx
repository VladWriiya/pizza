'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ name, className, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string;

  return (
    <div className={cn('pz-w-full', className)}>
      <Textarea {...register(name)} {...props} />
      {error && <p className="pz-text-red-500 pz-text-sm pz-mt-1">{error}</p>}
    </div>
  );
};
