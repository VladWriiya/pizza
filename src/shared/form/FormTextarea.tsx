'use client';

import React from 'react';
import { FormField } from './FormField';
import { Textarea } from '../ui/textarea';


interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ name, label, className, ...props }) => {
  return (
    <FormField name={name} label={label} className={className}>
      {(field, error) => (
        <Textarea
          {...field}
          {...props}
          id={name}
          aria-invalid={!!error}
        />
      )}
    </FormField>
  );
};