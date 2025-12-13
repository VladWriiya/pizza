'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // ИСПРАВЛЕНИЕ: pz-rounded-[8px] вместо pz-rounded-full, pz-bg-gray-100 для неактивного состояния
      'pz-peer pz-h-6 pz-w-6 pz-shrink-0 pz-bg-gray-100 pz-rounded-[8px] pz-ring-offset-background focus-visible:pz-outline-none focus-visible:pz-ring-2 focus-visible:pz-ring-ring focus-visible:pz-ring-offset-2 disabled:pz-cursor-not-allowed disabled:pz-opacity-50 data-[state=checked]:pz-bg-primary data-[state=checked]:pz-text-primary-foreground',
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('pz-flex pz-items-center pz-justify-center pz-text-current')}>
      <Check className="pz-h-4 pz-w-4" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
