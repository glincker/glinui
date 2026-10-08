"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"
import { useAutoPointer } from "../lib/use-auto-pointer"
import { useMotionEngine } from "./motion-engine"
import { Card, type CardProps } from "./card"

/**
 * Card with a cursor spotlight. The base surface follows the ambient style (glinr by default);
 * pass `variant="glass"` for a frosted base. The spotlight is an accent tint that reads on light and dark scopes.
 */
export type SpotlightCardProps = CardProps & {
  spotlightClassName?: string
  /** Spotlight radius in pixels. */
  spotlightSize?: number
  /**
   * Runs a slow looping synthetic pointer so the spotlight is visible without hovering (demos, screenshots, touch).
   * Off at reduced motion. A real pointer takes over while hovering.
   */
  autoPlay?: boolean
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(
  ({ className, children, onMouseMove, onMouseLeave, spotlightClassName, spotlightSize = 300, autoPlay = false, ...props }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const hovering = React.useRef(false)
    const { effectiveLevel } = useMotionEngine()

    React.useEffect(() => {
      localRef.current?.style.setProperty("--spot-size", `${spotlightSize}px`)
    }, [spotlightSize])

    useAutoPointer(localRef, autoPlay && effectiveLevel === "full" && !prefersReducedMotion, (nx, ny) => {
      const el = localRef.current
      if (!el || hovering.current) return
      el.style.setProperty("--spot-x", `${(nx * el.offsetWidth).toFixed(1)}px`)
      el.style.setProperty("--spot-y", `${(ny * el.offsetHeight).toFixed(1)}px`)
    })

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node

        if (typeof ref === "function") {
          ref(node)
          return
        }

        if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        hovering.current = true
        if (!prefersReducedMotion && localRef.current) {
          const rect = localRef.current.getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top

          localRef.current.style.setProperty("--spot-x", `${x.toFixed(2)}px`)
          localRef.current.style.setProperty("--spot-y", `${y.toFixed(2)}px`)
          localRef.current.dataset.spotlightActive = "true"
        }

        onMouseMove?.(event)
      },
      [onMouseMove, prefersReducedMotion]
    )

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        hovering.current = false
        if (localRef.current) {
          localRef.current.dataset.spotlightActive = "false"
        }

        onMouseLeave?.(event)
      },
      [onMouseLeave]
    )

    return (
      <Card
        ref={setRefs}
        className={cn("group relative overflow-hidden", className)}
        data-spotlight-active="false"
        data-autoplay={autoPlay && effectiveLevel === "full" ? "true" : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <span
          aria-hidden="true"
          data-slot="spotlight-overlay"
          className={cn(
            "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-fast ease-standard [background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--color-accent)_32%,transparent),transparent_70%)] group-hover:opacity-100 group-data-[autoplay=true]:opacity-100 motion-reduce:hidden motion-reduce:transition-none",
            spotlightClassName
          )}
        />
        <span
          aria-hidden="true"
          data-slot="spotlight-border"
          className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-fast ease-standard [background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--color-accent)_85%,transparent),transparent_70%)] [mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] [-webkit-mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [-webkit-mask-clip:content-box,border-box] [-webkit-mask-composite:xor] group-hover:opacity-100 group-data-[autoplay=true]:opacity-100 motion-reduce:hidden forced-colors:hidden"
        />
        <div className="relative z-[1]">{children}</div>
      </Card>
    )
  }
)

SpotlightCard.displayName = "SpotlightCard"
