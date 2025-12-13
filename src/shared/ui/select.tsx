import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'pz-flex pz-w-full pz-items-center pz-justify-between pz-whitespace-nowrap pz-rounded-md pz-border pz-border-input pz-bg-background pz-px-3 pz-py-2 pz-text-sm pz-ring-offset-background data-[placeholder]:pz-text-muted-foreground focus:pz-outline-none focus:pz-ring-1 focus:pz-ring-ring disabled:pz-cursor-not-allowed disabled:pz-opacity-50 [&>span]:pz-line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="pz-h-4 pz-w-4 pz-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'pz-relative pz-z-50 pz-max-h-96 pz-min-w-[8rem] pz-overflow-y-auto pz-rounded-md pz-border pz-bg-popover pz-text-popover-foreground pz-shadow-md data-[state=open]:pz-animate-in data-[state=closed]:pz-animate-out data-[state=closed]:pz-fade-out-0 data-[state=open]:pz-fade-in-0 data-[state=closed]:pz-zoom-out-95 data-[state=open]:pz-zoom-in-95 data-[side=bottom]:pz-slide-in-from-top-2 data-[side=left]:pz-slide-in-from-right-2 data-[side=right]:pz-slide-in-from-left-2 data-[side=top]:pz-slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:pz-translate-y-1 data-[side=left]:-pz-translate-x-1 data-[side=right]:pz-translate-x-1 data-[side=top]:-pz-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'pz-p-1',
          position === 'popper' &&
            'pz-h-[var(--radix-select-trigger-height)] pz-w-full pz-min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'pz-relative pz-flex pz-w-full pz-cursor-default pz-select-none pz-items-center pz-rounded-sm pz-py-1.5 pz-pl-8 pz-pr-2 pz-text-sm pz-outline-none focus:pz-bg-accent focus:pz-text-accent-foreground data-[disabled]:pz-pointer-events-none data-[disabled]:pz-opacity-50',
      className
    )}
    {...props}
  >
    <span className="pz-absolute pz-left-2 pz-flex pz-h-3.5 pz-w-3.5 pz-items-center pz-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="pz-h-4 pz-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('pz-py-1.5 pz-pl-8 pz-pr-2 pz-text-sm pz-font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn('pz-flex pz-cursor-default pz-items-center pz-justify-center pz-py-1', className)}
    {...props}
  >
    <ChevronUp className="pz-h-4 pz-w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn('pz-flex pz-cursor-default pz-items-center pz-justify-center pz-py-1', className)}
    {...props}
  >
    <ChevronDown className="pz-h-4 pz-w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
