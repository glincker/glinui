import * as React from "react"
import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface } from "../lib/surface-resolve"

export type AspectRatioProps = React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
  /**
   * Surface variant. Omit (or `plain`) for a chromeless frame like the shadcn primitive.
   * Vocabulary: glinr, solid, soft, outline, ghost, gradient, glass. Legacy `default` maps to glinr.
   */
  variant?: SurfaceVariant | "default"
  tone?: SurfaceTone
}

/** Constrains children to a width/height ratio. Children fill the frame. */
export const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatioPrimitive.Root>,
  AspectRatioProps
>(({ className, variant, tone, ratio = 1, ...props }, ref) => (
  <AspectRatioPrimitive.Root
    ref={ref}
    ratio={ratio}
    data-variant={variant === "default" ? "glinr" : (variant ?? "plain")}
    className={cn(
      "overflow-hidden",
      variant && variant !== "plain" && variant !== "ghost"
        ? containerSurface(variant === "default" ? "glinr" : variant, { radius: "xl", elevation: "1", tone })
        : "",
      className
    )}
    {...props}
  />
))

AspectRatio.displayName = "AspectRatio"
