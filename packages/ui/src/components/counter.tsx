"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

const counterShape = cva(
  "inline-flex items-center justify-center font-medium tabular-nums transition-[background-color,color,border-color] duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      shape: { pill: "rounded-full", plain: "rounded-md" },
      size: {
        sm: "h-5 min-w-5 px-1.5 text-[10px]",
        md: "h-6 min-w-6 px-2 text-xs",
        lg: "h-7 min-w-7 px-2.5 text-sm"
      }
    },
    defaultVariants: { shape: "pill", size: "md" }
  }
)

export type CounterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> & {
  /** Visual variant. Omit for the ambient design style (glinr by default). */
  variant?: SurfaceVariant | "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info" | "raised" | "frosted"
  tone?: SurfaceTone
  size?: "sm" | "md" | "lg"
  value: number
  max?: number
}

export const Counter = React.forwardRef<HTMLSpanElement, CounterProps>(
  ({ className, variant, tone, size, value, max = 99, ...props }, ref) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "control")
    const displayValue = value > max ? `${max}+` : `${value}`

    return (
      <span
        ref={ref}
        data-variant={resolved}
        className={cn(
          surfaceVariants({
            variant: resolved,
            tone: tone ?? aliasTone ?? "neutral",
            elevation: resolved === "glinr" || resolved === "solid" ? "auto" : "none"
          }),
          counterShape({ shape: resolved === "plain" ? "plain" : "pill", size }),
          className
        )}
        {...props}
      >
        {displayValue}
      </span>
    )
  }
)

Counter.displayName = "Counter"
