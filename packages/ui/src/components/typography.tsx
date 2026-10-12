import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"

/**
 * Display, Eyebrow and Lede read these optional variables from @glinui/tokens:
 * --glinr-font-display, --glinr-display-weight and --glinr-font-eyebrow.
 * Each falls back to the surrounding font, so the components work without them.
 */

const displayVariants = cva(
  "[font-family:var(--glinr-font-display,inherit)] [font-weight:var(--glinr-display-weight,300)] leading-tight tracking-tight [text-wrap:balance] text-[color:var(--color-foreground)]",
  {
    variants: {
      size: {
        lg: "text-lg",
        "2xl": "text-2xl",
        "3xl": "text-2xl sm:text-3xl",
        "4xl": "text-3xl sm:text-4xl"
      }
    },
    defaultVariants: { size: "2xl" }
  }
)

export type DisplayElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"

export type DisplayProps = React.HTMLAttributes<HTMLHeadingElement> &
  VariantProps<typeof displayVariants> & {
    /** Element to render. Pick the level that fits the document outline. */
    as?: DisplayElement
  }

/** Display is the light, tight heading style for page heroes, banners and form sections. */
export const Display = React.forwardRef<HTMLHeadingElement, DisplayProps>(
  ({ as = "h2", size, className, ...props }, ref) => {
    const Comp = as as React.ElementType
    return <Comp ref={ref} className={cn(displayVariants({ size }), className)} {...props} />
  }
)

Display.displayName = "Display"

export type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement> & {
  /** Leading accent dot. */
  dot?: boolean
}

/** Eyebrow is the small uppercase label, with an optional accent dot, that sits above a heading. */
export const Eyebrow = React.forwardRef<HTMLParagraphElement, EyebrowProps>(
  ({ dot = true, className, children, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--color-muted)] [font-family:var(--glinr-font-eyebrow,inherit)]",
        className
      )}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[var(--tone-accent)]" /> : null}
      {children}
    </p>
  )
)

Eyebrow.displayName = "Eyebrow"

export type LedeProps = React.HTMLAttributes<HTMLParagraphElement>

/** Lede is regular-weight muted supporting copy under a Display heading. */
export const Lede = React.forwardRef<HTMLParagraphElement, LedeProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("max-w-prose text-sm font-normal [text-wrap:pretty] text-[color:var(--color-muted)]", className)}
    {...props}
  />
))

Lede.displayName = "Lede"
