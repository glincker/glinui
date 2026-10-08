"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface MeteorShowerProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
  angle?: number
  minDuration?: number
  maxDuration?: number
  minDelay?: number
  maxDelay?: number
}

export const MeteorShower = React.forwardRef<HTMLDivElement, MeteorShowerProps>(
  (
    {
      className,
      count = 12,
      angle = 215,
      minDuration = 2,
      maxDuration = 5,
      minDelay = 0,
      maxDelay = 4,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion()

    const meteors = React.useMemo(() => {
      return Array.from({ length: count }).map((_, i) => ({
        id: i,
        top: `${-30 + Math.random() * -10}%`,
        left: `${10 + Math.random() * 90}%`,
        duration: minDuration + Math.random() * (maxDuration - minDuration),
        delay: minDelay + Math.random() * (maxDelay - minDelay),
        size: 1 + Math.random() * 2
      }))
    }, [count, minDuration, maxDuration, minDelay, maxDelay])

    if (prefersReducedMotion) return null

    return (
      <div
        ref={ref}
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          className
        )}
        aria-hidden
        {...props}
      >
        {meteors.map((meteor) => (
          <span
            key={meteor.id}
            className="absolute rounded-full bg-[var(--color-foreground)] animate-[meteor-fall_var(--meteor-duration,3s)_linear_infinite]"
            style={
              {
                "--meteor-angle": `${angle}deg`,
                "--meteor-duration": `${meteor.duration}s`,
                top: meteor.top,
                left: meteor.left,
                animationDelay: `${meteor.delay}s`,
                width: `${meteor.size}px`,
                height: `${meteor.size}px`,
                boxShadow: `0 0 0 1px color-mix(in oklab, var(--color-foreground) 12%, transparent), 0 0 ${meteor.size * 10}px ${meteor.size * 2}px color-mix(in oklab, var(--color-foreground) 14%, transparent)`,
              } as React.CSSProperties
            }
          >
            <span
              className="absolute right-full top-1/2 block -translate-y-1/2 bg-[linear-gradient(to_right,transparent,var(--color-foreground))] opacity-40"
              style={{
                width: `${30 + Math.random() * 40}px`,
                height: `${meteor.size * 0.5}px`,
              }}
            />
          </span>
        ))}
      </div>
    )
  }
)

MeteorShower.displayName = "MeteorShower"
