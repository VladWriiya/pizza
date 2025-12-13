"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer pz-inline-flex pz-h-6 pz-w-11 pz-shrink-0 pz-cursor-pointer pz-items-center pz-rounded-full pz-border-2 pz-border-transparent pz-transition-colors focus-visible:pz-outline-none focus-visible:pz-ring-2 focus-visible:pz-ring-ring focus-visible:pz-ring-offset-2 focus-visible:pz-ring-offset-background disabled:pz-cursor-not-allowed disabled:pz-opacity-50 data-[state=checked]:pz-bg-primary data-[state=unchecked]:pz-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pz-pointer-events-none pz-block pz-h-5 pz-w-5 pz-rounded-full pz-bg-background pz-shadow-lg pz-ring-0 pz-transition-transform data-[state=checked]:pz-translate-x-5 data-[state=unchecked]:pz-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }