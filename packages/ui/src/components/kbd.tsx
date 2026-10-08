"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const kbdShape = cva(
  "inline-flex min-w-6 items-center justify-center rounded-md px-1.5 font-mono font-medium uppercase tracking-wide tabular-nums transition-colors duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-5 text-[10px]",
        md: "h-6 text-[11px]",
        lg: "h-7 text-xs"
      }
    },
    defaultVariants: { size: "md" }
  }
)

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  /** Visual variant. Omit for the ambient design style (glinr: tactile raised key). */
  variant?: SurfaceVariant | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
  tone?: SurfaceTone
  size?: "sm" | "md" | "lg"
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, tone, size, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "key")

    return (
      <kbd
        ref={ref}
        data-variant={resolved}
        className={cn(
          surfaceVariants({
            variant: resolved,
            tone: tone ?? aliasTone ?? "neutral",
            elevation: resolved === "glinr" || resolved === "solid" ? "auto" : "none"
          }),
          kbdShape({ size }),
          resolved === "glinr" && "[--face:var(--face-3,var(--surface-3))]",
          resolved === "plain" &&
            "border-[color:var(--color-border)] bg-[var(--surface-2)] text-[color:var(--color-foreground)] shadow-none",
          className
        )}
        {...props}
      />
    )
  }
)

Kbd.displayName = "Kbd"
