'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/lib/utils';

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'pz-z-50 pz-w-72 pz-rounded-md pz-border pz-bg-popover pz-p-4 pz-text-popover-foreground pz-shadow-md pz-outline-none data-[state=open]:pz-animate-in data-[state=closed]:pz-animate-out data-[state=closed]:pz-fade-out-0 data-[state=open]:pz-fade-in-0 data-[state=closed]:pz-zoom-out-95 data-[state=open]:pz-zoom-in-95 data-[side=bottom]:pz-slide-in-from-top-2 data-[side=left]:pz-slide-in-from-right-2 data-[side=right]:pz-slide-in-from-left-2 data-[side=top]:pz-slide-in-from-bottom-2 pz-origin-[--radix-popover-content-transform-origin]',
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
