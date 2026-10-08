"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Button, type ButtonProps, type ButtonVariant } from "./button"
import { useMotionEngine } from "./motion-engine"

export type PulsatingButtonProps = Omit<ButtonProps, "variant"> & {
  /** Vocabulary or legacy variant. `accent` is kept as an alias of `primary`. Omit for the ambient default. */
  variant?: ButtonVariant | "accent"
  /** Ring colour. Defaults to the accent token, visible on light and dark scopes. */
  pulseColor?: string
  /** Seconds per pulse. */
  pulseDuration?: number
}

const SIZE: Record<NonNullable<ButtonProps["size"]>, string> = {
  xs: "",
  sm: "",
  md: "h-10 px-6",
  lg: "h-12 px-8 text-base",
  icon: ""
}

/**
 * Crisp default surface with an expanding accent ring around it.
 * The ring runs only at motion level `full` and is removed under reduced motion or `data-glin-motion="none"`.
 */
export const PulsatingButton = React.forwardRef<HTMLButtonElement, PulsatingButtonProps>(
  ({ className, children, variant, size = "md", pulseColor, pulseDuration = 2, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const ringVars =
      pulseColor || pulseDuration !== 2
        ? ({
            ...(pulseColor ? { "--pulse-color": pulseColor } : {}),
            "--pulsate-duration": `${pulseDuration}s`
          } as React.CSSProperties)
        : undefined

    return (
      <Button
        ref={ref}
        variant={variant === "accent" ? "primary" : variant}
        size={size}
        className={cn("relative", SIZE[size], className)}
        {...props}
      >
        {effectiveLevel === "full" ? (
          <span
            aria-hidden="true"
            data-slot="pulse"
            style={ringVars}
            className="pointer-events-none absolute inset-0 rounded-[inherit] border-2 border-[color:var(--pulse-color,var(--color-accent))] motion-safe:animate-[pulsate-ring_var(--pulsate-duration,2s)_ease-out_infinite] motion-reduce:hidden"
          />
        ) : null}
        {children}
      </Button>
    )
  }
)

PulsatingButton.displayName = "PulsatingButton"
