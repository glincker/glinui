import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

const statusDotVariants = cva("inline-flex items-center gap-2 font-medium", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base"
    }
  },
  defaultVariants: {
    size: "md"
  }
})

const dotVariants = cva("rounded-full", {
  variants: {
    status: {
      neutral: "bg-[var(--color-muted)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-muted)_20%,transparent)]",
      info: "bg-[var(--tone-info)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--tone-info)_22%,transparent)]",
      success: "bg-[var(--color-signal-ok)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--color-signal-ok)_24%,transparent)]",
      warning: "bg-[var(--tone-warning)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--tone-warning)_26%,transparent)]",
      danger: "bg-[var(--tone-danger)] shadow-[0_0_0_3px_color-mix(in_oklch,var(--tone-danger)_24%,transparent)]"
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5"
    },
    pulse: {
      true: "motion-safe:animate-pulse",
      false: ""
    }
  },
  defaultVariants: {
    status: "neutral",
    size: "md",
    pulse: false
  }
})

export type StatusDotProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusDotVariants> &
  VariantProps<typeof dotVariants> & {
    label?: string
  }

export const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, size, status, pulse, label, children, ...props }, ref) => {
    const content = label ?? children

    return (
      <span ref={ref} className={cn(statusDotVariants({ size }), className)} {...props}>
        <span aria-hidden className={cn(dotVariants({ status, size, pulse }))} />
        {content ? <span className="text-[var(--color-foreground)]">{content}</span> : null}
      </span>
    )
  }
)

StatusDot.displayName = "StatusDot"
