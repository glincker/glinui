"use client"

import * as React from "react"
import { cn } from "../lib/cn"

export interface SpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the spotlight is active */
  active?: boolean
  /** X position of spotlight center (px or %) */
  x?: number | string
  /** Y position of spotlight center (px or %) */
  y?: number | string
  /** Spotlight radius in px */
  size?: number
  /** Overlay color */
  overlayColor?: string
  /** Click overlay to dismiss */
  onDismiss?: () => void
  /** Pulsing animation */
  pulse?: boolean
}

export const Spotlight = React.forwardRef<HTMLDivElement, SpotlightProps>(
  (
    {
      className,
      children,
      active = true,
      x = "50%",
      y = "50%",
      size = 150,
      overlayColor = "rgba(0, 0, 0, 0.7)",
      onDismiss,
      pulse = false,
      style,
      ...props
    },
    ref
  ) => {
    if (!active) return null

    const posX = typeof x === "number" ? `${x}px` : x
    const posY = typeof y === "number" ? `${y}px` : y

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-[100] transition-opacity duration-300",
          className
        )}
        style={{
          background: `radial-gradient(circle ${size}px at ${posX} ${posY}, transparent 0%, ${overlayColor} 100%)`,
          ...style,
        }}
        onClick={onDismiss}
        role={onDismiss ? "button" : undefined}
        tabIndex={onDismiss ? 0 : undefined}
        aria-label={onDismiss ? "Dismiss spotlight" : undefined}
        onKeyDown={onDismiss ? (e) => { if (e.key === "Enter" || e.key === " ") onDismiss() } : undefined}
        {...props}
      >
        {pulse && (
          <div
            aria-hidden="true"
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/30 [--spotlight-pulse-duration:3s] animate-spotlight-pulse motion-reduce:[animation:none]"
            style={{
                            left: posX,
              top: posY,
              width: size * 2,
              height: size * 2,
            } as React.CSSProperties}
          />
        )}
        {children}
      </div>
    )
  }
)

Spotlight.displayName = "Spotlight"
