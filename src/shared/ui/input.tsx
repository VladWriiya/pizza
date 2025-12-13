import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'pz-flex pz-h-9 pz-w-full pz-rounded-md pz-border pz-border-input pz-bg-transparent pz-px-3 pz-py-1 pz-text-base pz-shadow-sm pz-transition-colors file:pz-border-0 file:pz-bg-transparent file:pz-text-sm file:pz-font-medium file:pz-text-foreground placeholder:pz-text-muted-foreground focus-visible:pz-outline-none focus-visible:pz-ring-1 focus-visible:pz-ring-ring disabled:pz-cursor-not-allowed disabled:pz-opacity-50 md:pz-text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
