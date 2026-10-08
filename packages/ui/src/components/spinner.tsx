"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveControlVariant, type ControlVariant, type ControlVariantProp } from "../lib/control"
import { useGlinStyle } from "./glin-provider"

const SPINNER_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "glass"] as const satisfies readonly ControlVariant[]

const spinnerVariants = cva("inline-block shrink-0 align-middle", {
  variants: {
    size: {
      sm: "size-4",
      md: "size-5",
      lg: "size-8",
      xl: "size-12"
    },
    variant: {
      glinr: "text-[color:var(--color-accent)]",
      solid: "text-[color:var(--neutral-solid)]",
      plain: "text-[color:var(--color-foreground)]",
      soft: "text-[color:var(--tone-accent-text)]",
      outline:
        "rounded-full border border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] p-1 text-[color:var(--tone-accent)]",
      ghost: "text-[color:var(--color-muted)]",
      muted: "text-[color:var(--color-muted)]",
      current: "text-current",
      glass:
        "rounded-full border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] p-1 text-[color:var(--tone-accent)] backdrop-blur-xl"
    }
  },
  defaultVariants: { size: "md", variant: "glinr" }
})

const DOTS = [0, 1, 2, 3, 4, 5, 6, 7]

export type SpinnerProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  Pick<VariantProps<typeof spinnerVariants>, "size"> & {
    /**
     * Color treatment. Omit to follow the ambient design style (glinr = accent, minimal = foreground).
     * Also: solid, soft, outline, ghost, glass (chip, opt-in), muted, current.
     */
    variant?: ControlVariantProp | "muted" | "current"
    /** Accessible label announced to assistive tech. */
    label?: string
  }

/**
 * Loading indicator. Rotates with CSS under normal motion; with reduced motion
 * it swaps to a ring of dots that pulse in opacity.
 */
export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, variant, label = "Loading", ...props }, ref) => {
    const style = useGlinStyle()
    const look =
      variant === "muted" || variant === "current" ? variant : resolveControlVariant(variant, style, SPINNER_VARIANTS)
    return (
    <span
      ref={ref}
      role="status"
      data-variant={look}
      aria-label={label}
      className={cn(spinnerVariants({ size, variant: look }), "relative", className)}
      {...props}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="size-full animate-spin motion-reduce:hidden"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className="absolute inset-0 hidden motion-reduce:block">
        {DOTS.map((i) => (
          <span
            key={i}
            data-spinner-dot=""
            className={cn(
              "absolute left-1/2 top-1/2 size-[14%] -ml-[7%] -mt-[7%] rounded-full bg-current opacity-30 motion-reduce:animate-pulse",
              DOT_POSITION[i],
              DOT_DELAY[i]
            )}
          />
        ))}
      </span>
    </span>
    )
  }
)

Spinner.displayName = "Spinner"

const DOT_POSITION: readonly string[] = [
  "-translate-y-[300%]",
  "translate-x-[210%] -translate-y-[210%]",
  "translate-x-[300%]",
  "translate-x-[210%] translate-y-[210%]",
  "translate-y-[300%]",
  "-translate-x-[210%] translate-y-[210%]",
  "-translate-x-[300%]",
  "-translate-x-[210%] -translate-y-[210%]"
]

const DOT_DELAY: readonly string[] = [
  "[animation-delay:0ms]",
  "[animation-delay:120ms]",
  "[animation-delay:240ms]",
  "[animation-delay:360ms]",
  "[animation-delay:480ms]",
  "[animation-delay:600ms]",
  "[animation-delay:720ms]",
  "[animation-delay:840ms]"
]
