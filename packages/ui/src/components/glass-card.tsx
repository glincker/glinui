"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { Card, CardContent, CardFooter, CardHeader, type CardProps, type CardSectionProps } from "./card"

/**
 * Glass is this component's identity, so `variant` defaults to `glass` (not the ambient style).
 * The glass surface uses `--glass-readable`, an opacity floor that keeps text legible on any backdrop.
 * Pass `glinr`, `plain`, `solid`, `soft`, `outline`, `ghost` or `gradient` to use the card looks instead.
 */
export type GlassCardProps = CardProps & {
  /** Lift on hover. Default true. */
  hoverLift?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "glass", hoverLift = true, ...props }, ref) => (
    <Card
      ref={ref}
      variant={variant}
      className={cn(
        "relative rounded-2xl",
        hoverLift && "hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:hover:translate-y-0",
        className
      )}
      {...props}
    />
  )
)

GlassCard.displayName = "GlassCard"

type GlassCardSectionProps = CardSectionProps

export const GlassCardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof CardHeader>>(
  (props, ref) => <CardHeader ref={ref} {...props} />
)

GlassCardHeader.displayName = "GlassCardHeader"

export const GlassCardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof CardContent>>(
  (props, ref) => <CardContent ref={ref} {...props} />
)

GlassCardContent.displayName = "GlassCardContent"

export const GlassCardFooter = React.forwardRef<HTMLDivElement, GlassCardSectionProps>(({ className, ...props }, ref) => (
  <CardFooter ref={ref} className={cn("mt-0 border-t-0 pt-0", className)} {...props} />
))

GlassCardFooter.displayName = "GlassCardFooter"
