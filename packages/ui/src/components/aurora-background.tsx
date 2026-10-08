"use client"

import * as React from "react"
import { cn } from "../lib/cn"

export interface AuroraBackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of gradient blobs */
  blobCount?: number
  /** Base colors for the aurora. Defaults come from theme tokens so the blobs read on light and dark scopes. */
  colors?: string[]
  /** Animation duration in seconds */
  duration?: number
  /** Blur intensity in px */
  blur?: number
  /** Opacity of the aurora layer (0-1) */
  intensity?: number
}

export const AuroraBackground = React.forwardRef<HTMLDivElement, AuroraBackgroundProps>(
  (
    {
      className,
      children,
      blobCount = 3,
      colors = ["var(--color-accent)", "var(--tone-info)", "var(--gradient-to)"],
      duration = 8,
      blur = 80,
      intensity = 0.4,
      style,
      ...props
    },
    ref
  ) => {
    const blobs = React.useMemo(() => {
      return Array.from({ length: blobCount }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        delay: (i * duration) / blobCount,
        size: 40 + (i % 3) * 15,
        x: 20 + (i * 60) / blobCount,
        y: 20 + ((i * 40) % 60),
      }))
    }, [blobCount, colors, duration])

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
        style={style}
        {...props}
      >
        <div
          className="absolute inset-0"
          style={{ filter: `blur(${blur}px)`, opacity: intensity }}
        >
          {blobs.map((blob) => (
            <div
              key={blob.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-aurora-shift motion-reduce:[animation:none]"
              style={{
                "--aurora-duration": `${duration}s`,
                width: `${blob.size}%`,
                height: `${blob.size}%`,
                left: `${blob.x}%`,
                top: `${blob.y}%`,
                background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
                animationDelay: `${-blob.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
        {children}
      </div>
    )
  }
)

AuroraBackground.displayName = "AuroraBackground"
