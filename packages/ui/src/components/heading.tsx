import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

const headingVariants = cva("font-sans font-semibold tracking-[-0.02em] [text-wrap:balance] text-[var(--color-foreground)]", {
  variants: {
    variant: {
      default: "leading-[1.15]",
      glass:
        "inline-block rounded-lg border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] px-2.5 py-1.5 backdrop-blur-xl backdrop-saturate-[180%]",
      outline: "inline-block rounded-lg border border-[var(--color-border)] px-2.5 py-1.5",
      ghost: "inline-block rounded-lg px-2.5 py-1.5"
    },
    size: {
      sm: "text-lg leading-7 tracking-[-0.01em]",
      md: "text-2xl leading-9",
      lg: "text-3xl leading-10 tracking-[-0.03em]",
      /** Fluid hero heading, light weight. */
      display: "text-[clamp(2.75rem,6.4vw,4.25rem)] font-light leading-[1.08] tracking-[-0.03em]",
      h2: "text-[clamp(2rem,4.2vw,3rem)] font-light leading-[1.15] tracking-[-0.025em]",
      h3: "text-xl font-medium leading-[1.3] tracking-[-0.02em]"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md"
  }
})

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof headingVariants> & {
    level?: HeadingLevel
  }

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, size, level = 2, ...props }, ref) => {
    const Comp = `h${level}` as const

    return <Comp ref={ref} className={cn(headingVariants({ variant, size }), className)} {...props} />
  }
)

Heading.displayName = "Heading"
