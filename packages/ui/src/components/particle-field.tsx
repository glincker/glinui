"use client"

import * as React from "react"
import { cn } from "../lib/cn"

export interface ParticleFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of particles */
  count?: number
  /** Particle color */
  color?: string
  /** Min particle size in px */
  minSize?: number
  /** Max particle size in px */
  maxSize?: number
  /** Float duration in seconds */
  duration?: number
  /** Float distance in px */
  distance?: number
  /** Particle shape */
  shape?: "circle" | "square"
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return x - Math.floor(x)
}

export const ParticleField = React.forwardRef<HTMLDivElement, ParticleFieldProps>(
  (
    {
      className,
      count = 30,
      color,
      minSize = 2,
      maxSize = 5,
      duration = 5,
      distance = 200,
      shape = "circle",
      style,
      ...props
    },
    ref
  ) => {
    const particles = React.useMemo(() => {
      return Array.from({ length: count }, (_, i) => {
        const r1 = seededRandom(i + 1)
        const r2 = seededRandom(i + 100)
        const r3 = seededRandom(i + 200)
        const r4 = seededRandom(i + 300)
        const size = minSize + r1 * (maxSize - minSize)
        return {
          id: i,
          x: r2 * 100,
          y: r3 * 100,
          size,
          delay: r4 * duration,
          drift: (r1 - 0.5) * 40,
          dur: duration * (0.7 + r2 * 0.6),
        }
      })
    }, [count, minSize, maxSize, duration])

    const particleColor = color ?? "currentColor"

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={style}
        {...props}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className={cn(
              "absolute opacity-0 animate-particle-float motion-reduce:[animation:none]",
              shape === "circle" ? "rounded-full" : "rounded-sm"
            )}
            style={{
              "--particle-distance": `${-distance}px`,
              "--particle-drift": `${p.drift}px`,
              "--particle-duration": `${p.dur}s`,
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              bottom: `${p.y * 0.3}%`,
              backgroundColor: particleColor,
              animationDelay: `${-p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    )
  }
)

ParticleField.displayName = "ParticleField"
