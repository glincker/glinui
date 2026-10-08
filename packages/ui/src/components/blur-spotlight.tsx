"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface BlurSpotlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Spotlight radius in px */
  size?: number
  /** Spotlight color */
  color?: string
  /** Blur amount in px */
  blur?: number
  /** Intensity/opacity (0-1) */
  intensity?: number
}

export const BlurSpotlight = React.forwardRef<HTMLDivElement, BlurSpotlightProps>(
  (
    {
      className,
      size = 300,
      color = "var(--color-accent)",
      blur = 80,
      intensity = 0.5,
      style,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const localRef = React.useRef<HTMLDivElement | null>(null)

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node
        if (typeof ref === "function") { ref(node); return }
        if (ref) ref.current = node
      },
      [ref]
    )

    React.useEffect(() => {
      if (prefersReducedMotion) return
      const el = localRef.current
      if (!el) return

      const parent = el.parentElement
      if (!parent) return

      const handleMouseMove = (event: MouseEvent) => {
        const rect = parent.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        el.style.setProperty("--spot-x", `${x}px`)
        el.style.setProperty("--spot-y", `${y}px`)
        el.style.setProperty("--spot-visible", "1")
      }

      const handleMouseLeave = () => {
        el.style.setProperty("--spot-visible", "0")
      }

      parent.addEventListener("mousemove", handleMouseMove)
      parent.addEventListener("mouseleave", handleMouseLeave)
      return () => {
        parent.removeEventListener("mousemove", handleMouseMove)
        parent.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [prefersReducedMotion])

    return (
      <div
        ref={setRefs}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden opacity-[var(--spot-visible,0)] transition-opacity duration-300 motion-reduce:hidden",
          className
        )}
        style={style}
        {...props}
      >
        <div
          className="absolute left-[var(--spot-x,50%)] top-[var(--spot-y,50%)] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, ${color}, transparent 70%)`,
            filter: `blur(${blur}px)`,
            opacity: intensity,
          }}
        />
      </div>
    )
  }
)

BlurSpotlight.displayName = "BlurSpotlight"
