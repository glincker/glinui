"use client"

/**
 * Glin UI Animated Beam (animated-beam). Adapted from AnimatedBeam in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/animated-beam.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: SVG path measurement with WAAPI dash travel instead of motion, ResizeObserver on all anchors, RTL offsets, tokens, motion levels.
 * See THIRD_PARTY_NOTICES.md#animated-beam.
 */

import * as React from "react"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

export interface AnimatedBeamProps extends Omit<React.SVGAttributes<SVGSVGElement>, "ref"> {
  /** Positioned (relative) element that contains both anchors. The beam is drawn in it. */
  containerRef: React.RefObject<HTMLElement | null>
  fromRef: React.RefObject<HTMLElement | null>
  toRef: React.RefObject<HTMLElement | null>
  /** Upward bend of the curve in px. Negative bends downward. */
  curvature?: number
  /** Travel from `toRef` to `fromRef`. */
  reverse?: boolean
  /** Track color. Defaults to the soft line token. */
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  /** Seconds for one pass. */
  duration?: number
  /** Seconds before the first pass. */
  delay?: number
  /** Seconds to rest between passes. */
  repeatDelay?: number
  /** Length of the travelling segment as a share of the path, 0.05 to 1. */
  beamLength?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

type Geometry = {
  width: number
  height: number
  d: string
  x1: number
  y1: number
  x2: number
  y2: number
}

const EMPTY: Geometry = { width: 0, height: 0, d: "", x1: 0, y1: 0, x2: 0, y2: 0 }

export const AnimatedBeam = React.forwardRef<SVGSVGElement, AnimatedBeamProps>(
  (
    {
      className,
      containerRef,
      fromRef,
      toRef,
      curvature = 0,
      reverse = false,
      pathColor = "var(--line-soft, var(--color-border))",
      pathWidth = 2,
      pathOpacity = 1,
      gradientStartColor = "var(--color-accent)",
      gradientStopColor = "color-mix(in oklab, var(--color-accent) 55%, var(--color-foreground))",
      duration = 4,
      delay = 0,
      repeatDelay = 0,
      beamLength = 0.35,
      startXOffset = 0,
      startYOffset = 0,
      endXOffset = 0,
      endYOffset = 0,
      ...props
    },
    ref
  ) => {
    const rawId = React.useId()
    const gradientId = `glin-beam-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
    const svgRef = React.useRef<SVGSVGElement>(null)
    const trackRef = React.useRef<SVGPathElement>(null)
    const beamRef = React.useRef<SVGPathElement>(null)
    const animRef = React.useRef<Animation | null>(null)
    const [geo, setGeo] = React.useState<Geometry>(EMPTY)
    const [length, setLength] = React.useState(0)
    const { effectiveLevel } = useMotionEngine()
    const active = usePlaybackActive(svgRef)
    const animated = effectiveLevel === "full"

    // Passive effect: the container is usually an ancestor whose ref attaches after children layout effects.
    React.useEffect(() => {
      const container = containerRef.current
      const from = fromRef.current
      const to = toRef.current
      if (!container || !from || !to || typeof ResizeObserver === "undefined") return
      let raf = 0
      const update = () => {
        const c = container.getBoundingClientRect()
        const a = from.getBoundingClientRect()
        const b = to.getBoundingClientRect()
        const rtl = getComputedStyle(container).direction === "rtl" || container.closest("[dir]")?.getAttribute("dir") === "rtl"
        const sign = rtl ? -1 : 1
        const sx = a.left - c.left + a.width / 2 + startXOffset * sign
        const sy = a.top - c.top + a.height / 2 + startYOffset
        const ex = b.left - c.left + b.width / 2 + endXOffset * sign
        const ey = b.top - c.top + b.height / 2 + endYOffset
        const d = `M ${sx},${sy} Q ${(sx + ex) / 2},${sy - curvature} ${ex},${ey}`
        setGeo((prev) =>
          prev.d === d && prev.width === c.width && prev.height === c.height
            ? prev
            : { width: c.width, height: c.height, d, x1: sx, y1: sy, x2: ex, y2: ey }
        )
      }
      const schedule = () => {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(update)
      }
      const observer = new ResizeObserver(schedule)
      observer.observe(container)
      observer.observe(from)
      observer.observe(to)
      update()
      return () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
      }
    }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset])

    React.useEffect(() => {
      const track = trackRef.current
      if (!track || !geo.d) return
      let total = 0
      try {
        total = track.getTotalLength()
      } catch {
        total = 0
      }
      if (!total) total = Math.hypot(geo.x2 - geo.x1, geo.y2 - geo.y1) * 1.05
      setLength(total)
    }, [geo])

    const segment = Math.max(0.05, Math.min(1, beamLength)) * length

    React.useEffect(() => {
      const beam = beamRef.current
      if (!animated || !beam || !length || typeof beam.animate !== "function") return
      const from = reverse ? -length : segment
      const to = reverse ? segment : -length
      const anim = beam.animate(
        [
          { strokeDashoffset: `${from}px`, opacity: 0 },
          { opacity: 1, offset: 0.08 },
          { opacity: 1, offset: 0.85 },
          { strokeDashoffset: `${to}px`, opacity: 0 }
        ],
        {
          duration: Math.max(0.1, duration) * 1000,
          delay: delay * 1000,
          endDelay: repeatDelay * 1000,
          iterations: Infinity,
          easing: "cubic-bezier(0.45, 0, 0.25, 1)"
        }
      )
      animRef.current = anim
      return () => {
        anim.cancel()
        animRef.current = null
      }
    }, [animated, length, segment, reverse, duration, delay, repeatDelay])

    React.useEffect(() => {
      const anim = animRef.current
      if (!anim) return
      if (active) anim.play()
      else anim.pause()
    }, [active, animated, length])

    const start = reverse ? { x: geo.x2, y: geo.y2 } : { x: geo.x1, y: geo.y1 }
    const end = reverse ? { x: geo.x1, y: geo.y1 } : { x: geo.x2, y: geo.y2 }

    return (
      <svg
        ref={mergeRefs(ref, svgRef)}
        aria-hidden="true"
        focusable="false"
        fill="none"
        data-slot="animated-beam"
        data-animated={animated ? "true" : "false"}
        width={geo.width}
        height={geo.height}
        viewBox={`0 0 ${geo.width} ${geo.height}`}
        className={cn("pointer-events-none absolute left-0 top-0 transform-gpu overflow-visible", className)}
        {...props}
      >
        <path
          ref={trackRef}
          d={geo.d}
          stroke={pathColor}
          strokeWidth={pathWidth}
          strokeOpacity={pathOpacity}
          strokeLinecap="round"
        />
        <path
          ref={beamRef}
          d={geo.d}
          stroke={`url(#${gradientId})`}
          strokeWidth={pathWidth}
          strokeLinecap="round"
          strokeOpacity={animated ? 1 : 0.6}
          strokeDasharray={animated && length ? `${segment} ${length + segment}` : undefined}
          strokeDashoffset={animated && length ? segment : undefined}
          opacity={animated ? 0 : 1}
        />
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1={start.x} y1={start.y} x2={end.x} y2={end.y}>
            <stop stopColor={gradientStartColor} />
            <stop offset="100%" stopColor={gradientStopColor} />
          </linearGradient>
        </defs>
      </svg>
    )
  }
)

AnimatedBeam.displayName = "AnimatedBeam"
