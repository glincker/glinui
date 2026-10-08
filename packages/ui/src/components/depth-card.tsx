"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"
import { useAutoPointer } from "../lib/use-auto-pointer"
import { useMotionEngine } from "./motion-engine"
import { Card, type CardProps } from "./card"

export interface DepthCardProps extends Omit<CardProps, "size" | "inset" | "interactive"> {
  /** Maximum tilt angle in degrees */
  maxTilt?: number
  /** Perspective distance in px */
  perspective?: number
  /** Scale on hover */
  hoverScale?: number
  /** Glare effect */
  glare?: boolean
  /** Glare max opacity */
  glareOpacity?: number
  /**
   * Runs a slow looping synthetic pointer so the tilt, glare and layer parallax are visible without hovering
   * (demos, screenshots, touch). Needs motion level full. A real pointer takes over while hovering.
   */
  autoPlay?: boolean
}

const LAYER_DEPTH = {
  1: "[transform:translateZ(16px)]",
  2: "[transform:translateZ(32px)]",
  3: "[transform:translateZ(52px)]",
  4: "[transform:translateZ(76px)]"
} as const

export interface DepthLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How far the layer floats above the card face (1 closest, 4 highest). */
  depth?: keyof typeof LAYER_DEPTH
}

/** A child that floats above the card face, so tilting the card shifts it against the face (parallax). */
export const DepthLayer = React.forwardRef<HTMLDivElement, DepthLayerProps>(({ className, depth = 2, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="depth-layer"
    data-depth={depth}
    className={cn(LAYER_DEPTH[depth], "drop-shadow-[0_6px_10px_rgb(0_0_0_/_0.22)] motion-reduce:transform-none", className)}
    {...props}
  />
))

DepthLayer.displayName = "DepthLayer"

export const DepthCard = React.forwardRef<HTMLDivElement, DepthCardProps>(
  (
    {
      className,
      children,
      maxTilt = 15,
      perspective = 800,
      hoverScale = 1.02,
      glare = true,
      glareOpacity = 0.35,
      autoPlay = false,
      onMouseMove,
      onMouseLeave,
      style,
      ...props
    },
    ref
  ) => {
    const prefersReducedMotion = usePrefersReducedMotion()
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const hovering = React.useRef(false)
    const { effectiveLevel } = useMotionEngine()

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node
        if (typeof ref === "function") { ref(node); return }
        if (ref) ref.current = node
      },
      [ref]
    )

    const applyPoint = React.useCallback(
      (x: number, y: number) => {
        const el = localRef.current
        if (!el) return
        el.style.setProperty("--depth-tilt-x", `${((0.5 - y) * maxTilt).toFixed(2)}deg`)
        el.style.setProperty("--depth-tilt-y", `${((x - 0.5) * maxTilt).toFixed(2)}deg`)
        el.style.setProperty("--depth-scale", `${hoverScale}`)
        if (glare) {
          el.style.setProperty("--glare-x", `${(x * 100).toFixed(1)}%`)
          el.style.setProperty("--glare-y", `${(y * 100).toFixed(1)}%`)
          el.style.setProperty("--glare-opacity", `${glareOpacity}`)
        }
      },
      [maxTilt, hoverScale, glare, glareOpacity]
    )

    useAutoPointer(localRef, autoPlay && effectiveLevel === "full" && !prefersReducedMotion, (nx, ny) => {
      if (!hovering.current) applyPoint(nx, ny)
    })

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (prefersReducedMotion || !localRef.current) {
          onMouseMove?.(event)
          return
        }
        hovering.current = true
        const rect = localRef.current.getBoundingClientRect()
        applyPoint((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height)
        onMouseMove?.(event)
      },
      [applyPoint, onMouseMove, prefersReducedMotion]
    )

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        hovering.current = false
        if (localRef.current) {
          localRef.current.style.setProperty("--depth-tilt-x", "0deg")
          localRef.current.style.setProperty("--depth-tilt-y", "0deg")
          localRef.current.style.setProperty("--depth-scale", "1")
          localRef.current.style.setProperty("--glare-opacity", "0")
        }
        onMouseLeave?.(event)
      },
      [onMouseLeave]
    )

    return (
      <Card
        ref={setRefs}
        className={cn(
          "relative p-6 [transform-style:preserve-3d] transition-transform duration-300 ease-out [transform:perspective(var(--depth-perspective,800px))_rotateX(var(--depth-tilt-x,0deg))_rotateY(var(--depth-tilt-y,0deg))_scale(var(--depth-scale,1))] motion-reduce:transform-none",
          className
        )}
        style={{
          "--depth-perspective": `${perspective}px`,
          ...style,
        } as React.CSSProperties}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {glare && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glare-opacity,0)] transition-opacity duration-300 [background:radial-gradient(300px_circle_at_var(--glare-x,50%)_var(--glare-y,50%),color-mix(in_oklab,var(--color-accent)_70%,white),transparent_70%)] motion-reduce:hidden"
          />
        )}
        <div className="relative z-[1] [transform-style:preserve-3d]">{children}</div>
      </Card>
    )
  }
)

DepthCard.displayName = "DepthCard"
