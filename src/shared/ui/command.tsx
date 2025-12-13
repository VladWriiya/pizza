'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command as CommandPrimitive } from 'cmdk';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent } from '@/shared/ui/dialog';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'pz-flex pz-h-full pz-w-full pz-flex-col pz-overflow-hidden pz-rounded-md pz-bg-popover pz-text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps;

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="pz-overflow-hidden pz-p-0 pz-shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:pz-px-2 [&_[cmdk-group-heading]]:pz-font-medium [&_[cmdk-group-heading]]:pz-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pz-pt-0 [&_[cmdk-group]]:pz-px-2 [&_[cmdk-input-wrapper]_svg]:pz-h-5 [&_[cmdk-input-wrapper]_svg]:pz-w-5 [&_[cmdk-input]]:pz-h-12 [&_[cmdk-item]]:pz-px-2 [&_[cmdk-item]]:pz-py-3 [&_[cmdk-item]_svg]:pz-h-5 [&_[cmdk-item]_svg]:pz-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="pz-flex pz-items-center pz-border-b pz-px-3" cmdk-input-wrapper="">
    <Search className="pz-mr-2 pz-h-4 pz-w-4 pz-shrink-0 pz-opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'pz-flex pz-h-11 pz-w-full pz-rounded-md pz-bg-transparent pz-py-3 pz-text-sm pz-outline-none placeholder:pz-text-muted-foreground disabled:pz-cursor-not-allowed disabled:pz-opacity-50',
        className
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('pz-max-h-[300px] pz-overflow-y-auto pz-overflow-x-hidden', className)}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <CommandPrimitive.Empty ref={ref} className="pz-py-6 pz-text-center pz-text-sm" {...props} />);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'pz-overflow-hidden pz-p-1 pz-text-foreground [&_[cmdk-group-heading]]:pz-px-2 [&_[cmdk-group-heading]]:pz-py-1.5 [&_[cmdk-group-heading]]:pz-text-xs [&_[cmdk-group-heading]]:pz-font-medium [&_[cmdk-group-heading]]:pz-text-muted-foreground',
      className
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator ref={ref} className={cn('-pz-mx-1 pz-h-px pz-bg-border', className)} {...props} />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'pz-relative pz-flex pz-cursor-default pz-select-none pz-items-center pz-rounded-sm pz-px-2 pz-py-1.5 pz-text-sm pz-outline-none aria-selected:pz-bg-accent aria-selected:pz-text-accent-foreground data-[disabled=true]:pz-pointer-events-none data-[disabled=true]:pz-opacity-50',
      className
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('pz-ml-auto pz-text-xs pz-tracking-widest pz-text-muted-foreground', className)} {...props} />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
