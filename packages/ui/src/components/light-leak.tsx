"use client"

import * as React from "react"
import { cn } from "../lib/cn"

export interface LightLeakProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of light leak layers */
  count?: number
  /** Colors for the light leaks. Defaults come from theme tokens. */
  colors?: string[]
  /** Animation duration in seconds */
  duration?: number
  /** Intensity/opacity (0-1) */
  intensity?: number
  /** Blur amount in px */
  blur?: number
}

export const LightLeak = React.forwardRef<HTMLDivElement, LightLeakProps>(
  (
    {
      className,
      count = 3,
      colors = ["var(--tone-warning)", "var(--tone-danger)", "var(--color-accent)"],
      duration = 6,
      intensity = 0.3,
      blur = 60,
      style,
      ...props
    },
    ref
  ) => {
    const leaks = React.useMemo(() => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        delay: (i * duration) / count,
        size: 30 + (i % 3) * 20,
        x: 10 + (i * 80) / count,
        y: 10 + ((i * 60) % 80),
        rotation: i * 45,
      }))
    }, [count, colors, duration])

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={style}
        {...props}
      >
        {leaks.map((leak) => (
          <div
            key={leak.id}
            className="absolute animate-light-leak-drift motion-reduce:[animation:none]"
            style={{
              "--light-leak-duration": `${duration + leak.id * 2}s`,
              width: `${leak.size}%`,
              height: `${leak.size * 0.6}%`,
              left: `${leak.x}%`,
              top: `${leak.y}%`,
              background: `radial-gradient(ellipse at center, ${leak.color}, transparent 70%)`,
              filter: `blur(${blur}px)`,
              opacity: intensity,
              transform: `translate(-50%, -50%) rotate(${leak.rotation}deg)`,
              animationDelay: `${-leak.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    )
  }
)

LightLeak.displayName = "LightLeak"
