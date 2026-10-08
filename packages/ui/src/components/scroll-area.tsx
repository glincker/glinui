"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface } from "../lib/surface-resolve"

const SCROLL_AREA_BASE = "relative overflow-hidden"

export type ScrollAreaProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
  /**
   * Surface variant. Omit (or `plain`) for a chromeless scroll region like the shadcn primitive.
   * Vocabulary: glinr, solid, soft, outline, ghost, gradient, glass. Legacy `default` maps to glinr.
   */
  variant?: SurfaceVariant | "default"
  tone?: SurfaceTone
  /** Class names for the scrollable viewport. */
  viewportClassName?: string
}

export const ScrollArea = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>(({ className, viewportClassName, variant, tone, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    data-variant={variant === "default" ? "glinr" : (variant ?? "plain")}
    className={cn(
      SCROLL_AREA_BASE,
      variant && variant !== "plain" && variant !== "ghost"
        ? containerSurface(variant === "default" ? "glinr" : variant, { radius: "xl", elevation: "1", tone })
        : "",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      className={cn(
        "size-full rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-accent)]",
        viewportClassName
      )}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))

ScrollArea.displayName = "ScrollArea"

export type ScrollBarProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>

export const ScrollBar = React.forwardRef<
  React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none p-px transition-opacity duration-150 motion-reduce:transition-none",
      orientation === "vertical" && "h-full w-2.5 border-s border-s-transparent",
      orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[color-mix(in_oklab,var(--color-foreground)_22%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--color-foreground)_38%,transparent)]" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))

ScrollBar.displayName = "ScrollBar"
