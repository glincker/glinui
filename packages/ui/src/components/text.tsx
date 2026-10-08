import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

const textVariants = cva("font-sans [text-wrap:pretty] transition-colors duration-fast ease-standard motion-reduce:transition-none", {
  variants: {
    variant: {
      default: "text-[var(--color-foreground)]",
      muted: "text-[var(--color-muted)]",
      glass:
        "rounded-md border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] px-2 py-1 text-[var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%]",
      ghost: "rounded-md px-2 py-1 text-foreground/85",
      eyebrow:
        "inline-flex items-center gap-2 font-mono text-xs uppercase leading-none tracking-[0.08em] text-[var(--color-muted)]"
    },
    size: {
      sm: "text-xs leading-5",
      md: "text-sm leading-6",
      lg: "text-base leading-7"
    },
    tone: {
      live: "text-[var(--color-signal-live)]",
      violet: "text-[var(--color-violet,var(--color-brand))]"
    },
    lead: {
      true: "max-w-[56ch] text-[1.1875rem] leading-[1.6] text-[var(--color-muted)]",
      false: ""
    }
  },
  defaultVariants: {
    variant: "default",
    size: "md",
    lead: false
  }
})

export type TextProps = Omit<React.HTMLAttributes<HTMLParagraphElement>, "color"> &
  VariantProps<typeof textVariants> & {
    /** Element to render. Use `span` with `tone` for an inline mark. */
    as?: "p" | "span" | "div"
    /** Eyebrow variant only: show the accent dot before the label. */
    dot?: boolean
  }

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant, size, tone, lead, as = "p", dot = false, children, ...props }, ref) => {
    const Comp = as as "p"
    const isEyebrow = variant === "eyebrow"
    // Eyebrow type is fixed by the variant; an inline tone mark inherits the surrounding size.
    const resolvedSize = isEyebrow || (tone && size === undefined) ? null : size

    return (
      <Comp
        ref={ref}
        className={cn(textVariants({ variant, size: resolvedSize, tone, lead }), className)}
        {...props}
      >
        {isEyebrow && dot ? (
          <span
            aria-hidden="true"
            data-slot="eyebrow-dot"
            className="size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
          />
        ) : null}
        {children}
      </Comp>
    )
  }
)

Text.displayName = "Text"
