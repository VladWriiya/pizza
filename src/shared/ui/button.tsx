'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'pz-inline-flex pz-items-center pz-justify-center pz-whitespace-nowrap pz-rounded-md pz-text-sm pz-font-medium pz-ring-offset-background pz-transition-colors focus-visible:pz-outline-none focus-visible:pz-ring-2 focus-visible:pz-ring-ring focus-visible:pz-ring-offset-2 disabled:pz-pointer-events-none disabled:pz-opacity-50',
  {
    variants: {
      variant: {
        default: 'pz-bg-primary pz-text-primary-foreground hover:pz-bg-primary/90',
        destructive: 'pz-bg-destructive pz-text-destructive-foreground hover:pz-bg-destructive/90',
        outline: 'pz-border pz-border-input pz-bg-background hover:pz-bg-accent hover:pz-text-accent-foreground',
        secondary: 'pz-bg-secondary pz-text-secondary-foreground hover:pz-bg-secondary/80',
        ghost: 'hover:pz-bg-accent hover:pz-text-accent-foreground',
        link: 'pz-text-primary pz-underline-offset-4 hover:pz-underline',
      },
      size: {
        default: 'pz-h-10 pz-px-4 pz-py-2',
        sm: 'pz-h-9 pz-rounded-md pz-px-3',
        lg: 'pz-h-11 pz-rounded-md pz-px-8',
        icon: 'pz-h-10 pz-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="pz-mr-2 pz-h-4 pz-w-4 pz-animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
