"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Button, type ButtonProps, type ButtonVariant } from "./button"
import { useMotionEngine } from "./motion-engine"

export type ShimmerButtonProps = Omit<ButtonProps, "variant"> & {
  /** Vocabulary or legacy variant. `accent` is kept as an alias of `primary`. Omit for the ambient default. */
  variant?: ButtonVariant | "accent"
  /** Sweep colour. Defaults to the button's own text colour at 35 percent, so it shows on light and dark surfaces. */
  shimmerColor?: string
  /** Seconds per sweep. */
  shimmerDuration?: number
}

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "",
  sm: "",
  md: "h-10 px-6",
  lg: "h-12 px-8 text-base",
  icon: ""
}

/**
 * Crisp default surface with a light sweep layered underneath the label.
 * The sweep follows the surface's text colour, runs only at motion level `full`,
 * and is removed under reduced motion or `data-glin-motion="none"`.
 */
export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, variant, size = "md", shimmerColor, shimmerDuration = 2, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const sweepVars =
      shimmerColor || shimmerDuration !== 2
        ? ({
            ...(shimmerColor ? { "--shimmer-color": shimmerColor } : {}),
            "--shimmer-duration": `${shimmerDuration}s`
          } as React.CSSProperties)
        : undefined

    return (
      <Button
        ref={ref}
        variant={variant === "accent" ? "primary" : variant}
        size={size}
        className={cn("group relative isolate overflow-hidden", SIZE[size], className)}
        {...props}
      >
        {effectiveLevel === "full" ? (
          <span
            aria-hidden="true"
            data-slot="shimmer"
            style={sweepVars}
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,transparent,var(--shimmer-color,color-mix(in_oklab,currentColor_35%,transparent)),transparent)] motion-safe:animate-[skeleton-shimmer_var(--shimmer-duration,2s)_ease-in-out_infinite] motion-reduce:hidden"
          />
        ) : null}
        {children}
      </Button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
