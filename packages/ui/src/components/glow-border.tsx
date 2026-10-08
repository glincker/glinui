"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

const FACE: Record<SurfaceVariant, string> = {
  glinr: "[background:var(--sheen),var(--face-1,var(--surface-1))]",
  solid: "bg-[var(--surface-2)]",
  plain: "bg-[var(--surface-1)]",
  soft: "bg-[var(--surface-2)]",
  outline: "bg-transparent",
  ghost: "bg-transparent",
  gradient: "bg-[var(--surface-1)]",
  glass: "bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-150"
}

export interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rotation duration in seconds */
  duration?: number
  /** Glow color */
  glowColor?: string
  /** Glow spread in px */
  glowSize?: number
  /** Border radius */
  borderRadius?: string
  /** Face inside the glow. Omitted follows the ambient style (glinr by default). `glass` is opt-in. */
  variant?: SurfaceVariant | "default" | null
}

export const GlowBorder = React.forwardRef<HTMLDivElement, GlowBorderProps>(
  (
    {
      className,
      children,
      duration = 4,
      glowColor = "var(--color-accent)",
      glowSize = 2,
      borderRadius = "var(--radius-lg)",
      variant,
      style,
      ...props
    },
    ref
  ) => {
    const face = resolveVariant(variant, useGlinStyle(), "signature")
    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        style={{ borderRadius, ...style }}
        {...props}
      >
        {/* Rotating glow border */}
        <div
          aria-hidden
          className="absolute -inset-px overflow-hidden rounded-[inherit] motion-reduce:hidden"
        >
          <div
            className="absolute inset-[-100%] animate-glow-rotate"
            style={{
              "--glow-duration": `${duration}s`,
              background: `conic-gradient(from 0deg, transparent 0%, ${glowColor} 10%, transparent 20%)`,
            } as React.CSSProperties}
          />
        </div>
        {/* Content layer */}
        <div
          className="relative rounded-[inherit] bg-[var(--surface-0)]"
          style={{ padding: glowSize }}
        >
          <div data-variant={face} className={cn("rounded-[inherit] text-[var(--color-foreground)]", FACE[face])}>
            {children}
          </div>
        </div>
      </div>
    )
  }
)

GlowBorder.displayName = "GlowBorder"
