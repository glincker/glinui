"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveVariant, surfaceVariants, type SurfaceTone, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

const iconFrameVariants = cva(
  "inline-flex shrink-0 items-center justify-center transition-[background-color,color,border-color,box-shadow] duration-fast ease-standard motion-reduce:transition-none",
  {
    variants: {
      size: {
        sm: "h-7 w-7",
        md: "h-9 w-9",
        lg: "h-11 w-11"
      }
    },
    defaultVariants: {
      size: "md"
    }
  }
)

/** Vocabulary variants plus the legacy `default` (ambient) and `raised` (glinr). */
export type IconFrameVariant = SurfaceVariant | "default" | "raised"

export type IconFrameProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> &
  VariantProps<typeof iconFrameVariants> & {
    /** Omitted follows the ambient style (glinr by default). `glass` is opt-in and needs a backdrop. */
    variant?: IconFrameVariant | null
    /** Tone for the icon color and tinted looks. */
    tone?: SurfaceTone
  }

const PLAIN = "rounded-md bg-[var(--surface-1)] shadow-none"

export const IconFrame = React.forwardRef<HTMLSpanElement, IconFrameProps>(
  ({ className, variant, tone = "neutral", size, ...props }, ref) => {
    const ambient = useGlinStyle()
    const resolved = resolveVariant(variant === "raised" ? "glinr" : variant, ambient, "control")
    const look =
      resolved === "plain"
        ? cn(surfaceVariants({ variant: "outline", tone }), PLAIN)
        : cn("rounded-xl", surfaceVariants({ variant: resolved, tone }))

    return (
      <span
        ref={ref}
        data-variant={resolved}
        className={cn(iconFrameVariants({ size }), look, className)}
        {...props}
      />
    )
  }
)

IconFrame.displayName = "IconFrame"
