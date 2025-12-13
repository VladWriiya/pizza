import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "pz-inline-flex pz-items-center pz-rounded-md pz-border pz-px-2.5 pz-py-0.5 pz-text-xs pz-font-semibold pz-transition-colors focus:pz-outline-none focus:pz-ring-2 focus:pz-ring-ring focus:pz-ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "pz-border-transparent pz-bg-primary pz-text-primary-foreground pz-shadow hover:pz-bg-primary/80",
        secondary:
          "pz-border-transparent pz-bg-secondary pz-text-secondary-foreground hover:pz-bg-secondary/80",
        destructive:
          "pz-border-transparent pz-bg-destructive pz-text-destructive-foreground pz-shadow hover:pz-bg-destructive/80",
        outline: "pz-text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }