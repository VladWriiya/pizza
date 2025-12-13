'use client';

import * as React from 'react';
import { Root, Item } from '@radix-ui/react-radio-group';
import { cn } from '@/lib/utils';

const SegmentedControl = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => {
  return (
    <Root
      ref={ref}
      className={cn('pz-inline-flex pz-items-center pz-justify-center pz-gap-1 pz-bg-gray-100 pz-p-1 pz-rounded-lg', className)}
      {...props}
    />
  );
});
SegmentedControl.displayName = Root.displayName;

const SegmentedControlItem = React.forwardRef<
  React.ElementRef<typeof Item>,
  React.ComponentPropsWithoutRef<typeof Item>
>(({ className, children, ...props }, ref) => {
  return (
    <Item
      ref={ref}
      className={cn(
        'peer pz-flex pz-items-center pz-justify-center pz-whitespace-nowrap pz-rounded-md pz-px-6 pz-py-2 pz-text-sm pz-font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=unchecked]:hover:pz-bg-gray-200', 
        'data-[state=checked]:pz-bg-white data-[state=checked]:pz-text-primary data-[state=checked]:pz-shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </Item>
  );
});
SegmentedControlItem.displayName = Item.displayName;

export { SegmentedControl, SegmentedControlItem };