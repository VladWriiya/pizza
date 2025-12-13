'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('pz-relative pz-flex pz-w-full pz-touch-none pz-select-none pz-items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="pz-relative pz-h-1.5 pz-w-full pz-grow pz-overflow-hidden pz-rounded-full pz-bg-primary/20">
      <SliderPrimitive.Range className="pz-absolute pz-h-full pz-bg-primary" />
    </SliderPrimitive.Track>

    <SliderPrimitive.Thumb className="pz-block pz-h-4 pz-w-4 pz-rounded-full pz-border pz-border-primary/50 pz-bg-white pz-shadow pz-transition-colors focus-visible:pz-outline-none focus-visible:pz-ring-1 focus-visible:pz-ring-ring disabled:pz-pointer-events-none disabled:pz-opacity-50" />
    <SliderPrimitive.Thumb className="pz-block pz-h-4 pz-w-4 pz-rounded-full pz-border pz-border-primary/50 pz-bg-white pz-shadow pz-transition-colors focus-visible:pz-outline-none focus-visible:pz-ring-1 focus-visible:pz-ring-ring disabled:pz-pointer-events-none disabled:pz-opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
