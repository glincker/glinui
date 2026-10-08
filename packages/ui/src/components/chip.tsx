"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const chipShape = cva(
  "inline-flex items-center justify-center font-medium transition-[background-color,color,border-color,box-shadow] duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      shape: { pill: "rounded-full", plain: "rounded-md" },
      size: {
        sm: "h-5 px-2 text-[10px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm"
      }
    },
    defaultVariants: { shape: "pill", size: "md" }
  }
)

export type ChipProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> & {
  /**
   * Visual variant. Omit for the ambient design style (glinr: raised pill with a hairline ring).
   * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. Legacy `default` follows the ambient style.
   */
  variant?: SurfaceVariant | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
  /** Colour tone. Tinted faces are built with color-mix on the surface tokens. */
  tone?: SurfaceTone
  size?: "sm" | "md" | "lg"
}

export const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, tone, size, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "control")
    const finalTone = tone ?? aliasTone ?? "neutral"

    return (
      <span
        ref={ref}
        data-variant={resolved}
        className={cn(
          surfaceVariants({
            variant: resolved,
            tone: finalTone,
            elevation: resolved === "glinr" || resolved === "solid" ? "auto" : "none"
          }),
          resolved === "glinr" && finalTone !== "neutral" && "[--face:var(--t-soft)]",
          chipShape({ shape: resolved === "plain" ? "plain" : "pill", size }),
          className
        )}
        {...props}
      />
    )
  }
)

Chip.displayName = "Chip"
