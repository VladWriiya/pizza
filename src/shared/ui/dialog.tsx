'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'pz-fixed pz-inset-0 pz-z-50 pz-bg-black/80 pz-data-[state=open]:animate-in pz-data-[state=closed]:animate-out pz-data-[state=closed]:fade-out-0 pz-data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'pz-fixed pz-left-[50%] pz-top-[50%] pz-z-50 pz-grid pz-w-full pz-translate-x-[-50%] pz-translate-y-[-50%] pz-gap-4 pz-border pz-bg-background pz-p-6 pz-shadow-lg pz-duration-200 data-[state=open]:pz-animate-in data-[state=closed]:pz-animate-out data-[state=closed]:pz-fade-out-0 data-[state=open]:pz-fade-in-0 data-[state=closed]:pz-zoom-out-95 data-[state=open]:pz-zoom-in-95 data-[state=closed]:pz-slide-out-to-left-1/2 data-[state=closed]:pz-slide-out-to-top-[48%] data-[state=open]:pz-slide-in-from-left-1/2 data-[state=open]:pz-slide-in-from-top-[48%] sm:pz-rounded-lg',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="pz-absolute pz-right-4 pz-top-4 pz-rounded-sm pz-opacity-70 pz-ring-offset-background pz-transition-opacity hover:pz-opacity-100 focus:pz-outline-none focus:pz-ring-2 focus:pz-ring-ring focus:pz-ring-offset-2 disabled:pz-pointer-events-none data-[state=open]:pz-bg-accent data-[state=open]:pz-text-muted-foreground">
        <X className="pz-h-4 pz-w-4" />
        <span className="pz-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('pz-flex pz-flex-col pz-space-y-1.5 pz-text-center sm:pz-text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('pz-flex pz-flex-col-reverse sm:pz-flex-row sm:pz-justify-end sm:pz-space-x-2', className)}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('pz-text-lg pz-font-semibold pz-leading-none pz-tracking-tight', className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('pz-text-sm pz-text-muted-foreground', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
