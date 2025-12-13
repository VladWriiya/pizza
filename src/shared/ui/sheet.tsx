'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'pz-fixed pz-inset-0 pz-z-50 pz-bg-black/80 pz-data-[state=open]:animate-in pz-data-[state=closed]:animate-out pz-data-[state=closed]:fade-out-0 pz-data-[state=open]:fade-in-0',
      className
    )}
    {...props}
    ref={ref}
  />
));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

const sheetVariants = cva(
  'pz-fixed pz-z-50 pz-gap-4  pz-p-6 pz-shadow-lg pz-transition pz-ease-in-out data-[state=closed]:pz-duration-300 data-[state=open]:pz-duration-500 data-[state=open]:pz-animate-in data-[state=closed]:pz-animate-out',
  {
    variants: {
      side: {
        top: 'pz-inset-x-0 pz-top-0 pz-border-b data-[state=closed]:pz-slide-out-to-top data-[state=open]:pz-slide-in-from-top',
        bottom:
          'pz-inset-x-0 pz-bottom-0 pz-border-t data-[state=closed]:pz-slide-out-to-bottom data-[state=open]:pz-slide-in-from-bottom',
        left: 'pz-inset-y-0 pz-left-0 pz-h-full pz-w-3/4 pz-border-r data-[state=closed]:pz-slide-out-to-left data-[state=open]:pz-slide-in-from-left sm:pz-max-w-sm',
        right:
          'pz-inset-y-0 pz-right-0 pz-h-full pz-w-3/4 pz-border-l data-[state=closed]:pz-slide-out-to-right data-[state=open]:pz-slide-in-from-right sm:pz-max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  }
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<React.ElementRef<typeof SheetPrimitive.Content>, SheetContentProps>(
  ({ side = 'right', className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content ref={ref} className={cn(sheetVariants({ side }), className)} {...props}>
        <SheetPrimitive.Close className="pz-absolute pz-right-4 pz-top-4 pz-rounded-sm pz-opacity-70 pz-ring-offset-background pz-transition-opacity hover:pz-opacity-100 focus:pz-outline-none focus:pz-ring-2 focus:pz-ring-ring focus:pz-ring-offset-2 disabled:pz-pointer-events-none data-[state=open]:pz-bg-secondary">
          <X className="pz-h-4 pz-w-4" />
          <span className="pz-sr-only">Close</span>
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pz-flex pz-flex-col pz-space-y-2 pz-text-center sm:pz-text-left', className)} {...props} />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('pz-flex pz-flex-col-reverse sm:pz-flex-row sm:pz-justify-end sm:pz-space-x-2', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('pz-text-lg pz-font-semibold pz-text-foreground', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description ref={ref} className={cn('pz-text-sm pz-text-muted-foreground', className)} {...props} />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
