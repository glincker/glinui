"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"

export type CollapsibleProps = React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root> & {
  /**
   * Surface variant. Omit for the ambient design style (glinr by default, plain under `minimal`).
   * Vocabulary: glinr, solid, plain, soft, outline, ghost, gradient, glass. `ghost` is chromeless like the shadcn primitive.
   */
  variant?: SurfaceVariant | "default" | "raised" | "frosted"
  tone?: SurfaceTone
}

export const Collapsible = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Root>,
  CollapsibleProps
>(({ className, variant, tone, ...props }, ref) => {
  const ambient = useGlinStyle()
  const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
  return (
    <CollapsiblePrimitive.Root
      ref={ref}
      data-variant={resolved}
      className={cn(
        "w-full",
        resolved === "ghost"
          ? "bg-transparent text-[color:var(--color-foreground)]"
          : containerSurface(resolved, { radius: "xl", elevation: "1", tone: tone ?? aliasTone }),
        className
      )}
      {...props}
    />
  )
})
Collapsible.displayName = "Collapsible"

export type CollapsibleTriggerProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleTrigger
>

export const CollapsibleTrigger = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleTrigger>,
  CollapsibleTriggerProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleTrigger
    ref={ref}
    className={cn(
      "rounded-md outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none",
      className
    )}
    {...props}
  />
))
CollapsibleTrigger.displayName = "CollapsibleTrigger"

export type CollapsibleContentProps = React.ComponentPropsWithoutRef<
  typeof CollapsiblePrimitive.CollapsibleContent
>

export const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  CollapsibleContentProps
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "duration-[180ms] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1 motion-reduce:data-[state=open]:animate-none",
      className
    )}
    {...props}
  />
))
CollapsibleContent.displayName = "CollapsibleContent"

