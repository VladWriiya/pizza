'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'pz-flex pz-min-h-[80px] pz-w-full pz-rounded-md pz-border pz-border-input pz-bg-background pz-px-3 pz-py-2 pz-text-sm pz-ring-offset-background placeholder:pz-text-muted-foreground focus-visible:pz-outline-none focus-visible:pz-ring-2 focus-visible:pz-ring-ring focus-visible:pz-ring-offset-2 disabled:pz-cursor-not-allowed disabled:pz-opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };
