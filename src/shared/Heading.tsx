import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const headingVariants = cva('pz-font-bold', {
  variants: {
    level: {
      '1': 'pz-text-heading-1',
      '2': 'pz-text-heading-2',
      '3': 'pz-text-heading-3',
      '4': 'pz-text-heading-4',
      '5': 'pz-text-heading-5',
      '6': 'pz-text-heading-6',
    },
  },
  defaultVariants: {
    level: '4',
  },
});

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  level: '1' | '2' | '3' | '4' | '5' | '6';
  children: React.ReactNode;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level, children, ...props }, ref) => {
    const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

    return (
      <Tag ref={ref} className={cn(headingVariants({ level }), className)} {...props}>
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';
