"use client"

/**
 * Glin UI Border Trail (border-trail). Adapted from BorderTrail in Motion Primitives
 * (https://github.com/ibelick/motion-primitives, components/core/border-trail.tsx),
 * commit 120f64f6ca60348e251f929e9c81f11ccbe45eda.
 * Original copyright (c) 2024 ibelick. Licensed under MIT.
 * Modified for Glin UI: motion/react removed (offset-distance runs through the Web Animations API),
 * token colors, soft glow, conic fallback without offset-path rect(), pause offscreen and in hidden tabs, static glow at none.
 * See THIRD_PARTY_NOTICES.md#border-trail.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const RING_MASK =
  "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] [-webkit-mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [-webkit-mask-clip:content-box,border-box] [-webkit-mask-composite:xor]"

const borderTrailVariants = cva(
  `pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] p-[var(--bt-bw,1px)] forced-colors:hidden ${RING_MASK}`,
  {
    variants: {
      variant: {
        default: "[--bt-default:var(--color-accent)]",
        plain: "[--bt-default:var(--color-foreground)]",
        glass: "[--bt-default:color-mix(in_oklab,var(--color-accent)_55%,white)]"
      }
    },
    defaultVariants: { variant: "default" }
  }
)

export interface BorderTrailProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof borderTrailVariants> {
  /** Length of the glowing segment in pixels. */
  size?: number
  /** Seconds per lap. */
  duration?: number
  /** Corner radius of the path in pixels. Defaults to the parent border radius. */
  radius?: number
  /** Border thickness in pixels. */
  borderWidth?: number
  /** Trail color. Defaults to the variant token. */
  color?: string
}

function supportsOffsetRect(): boolean {
  return typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("offset-path", "rect(0 auto auto 0 round 8px)")
}

/**
 * A glowing segment that travels along the border of its parent. The parent must be `relative`
 * and have a border radius, which the layer inherits. Distinct from BorderBeam and ShineBorder:
 * a short comet with a soft head on a 1 to 2 pixel track.
 */
export const BorderTrail = React.forwardRef<HTMLDivElement, BorderTrailProps>(
  ({ size = 60, duration = 5, radius, borderWidth = 1, color, variant, className, ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const dotRef = React.useRef<HTMLSpanElement | null>(null)
    const animationRef = React.useRef<Animation | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const active = usePlaybackActive(rootRef)
    const activeRef = React.useRef(active)
    activeRef.current = active
    const [native, setNative] = React.useState(true)

    React.useLayoutEffect(() => {
      setNative(supportsOffsetRect())
    }, [])

    React.useEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--bt-bw", `${borderWidth}px`)
      el.style.setProperty("--bt-size", `${size}px`)
      if (color) el.style.setProperty("--bt-color", color)
      else el.style.removeProperty("--bt-color")
      const parent = el.parentElement
      const measured = parent && typeof getComputedStyle === "function" ? parseFloat(getComputedStyle(parent).borderTopLeftRadius) : NaN
      const r = radius ?? (Number.isFinite(measured) ? measured : 12)
      el.style.setProperty("--bt-r", `${r}px`)
    }, [borderWidth, size, color, radius])

    React.useEffect(() => {
      const dot = dotRef.current
      if (!dot || !animated || typeof dot.animate !== "function") return
      const keyframes: Keyframe[] = native
        ? [{ offsetDistance: "0%" }, { offsetDistance: "100%" }]
        : [{ transform: "translate(-50%,-50%) rotate(0deg)" }, { transform: "translate(-50%,-50%) rotate(360deg)" }]
      const animation = dot.animate(keyframes, { duration: Math.max(duration, 0.1) * 1000, iterations: Infinity, easing: "linear" })
      animationRef.current = animation
      if (!activeRef.current) animation.pause()
      return () => {
        animation.cancel()
        animationRef.current = null
      }
    }, [animated, duration, native])

    React.useEffect(() => {
      const animation = animationRef.current
      if (!animation) return
      if (active) animation.play()
      else animation.pause()
    }, [active])

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        aria-hidden="true"
        data-slot="border-trail"
        data-animated={animated ? "true" : "false"}
        data-mode={native ? "path" : "conic"}
        className={cn(borderTrailVariants({ variant }), className)}
        {...props}
      >
        {native ? (
          <span
            ref={dotRef}
            className="absolute left-0 top-0 block aspect-square w-[var(--bt-size,60px)] rounded-full [background-image:radial-gradient(closest-side,var(--bt-color,var(--bt-default)),transparent)] [offset-anchor:50%_50%] [offset-path:rect(0_auto_auto_0_round_var(--bt-r,12px))] [offset-rotate:0deg]"
          />
        ) : (
          <span
            ref={dotRef}
            className="absolute start-1/2 top-1/2 block aspect-square w-[300%] [transform:translate(-50%,-50%)] [background-image:conic-gradient(from_0deg,transparent_0_82%,var(--bt-color,var(--bt-default))_100%)]"
          />
        )}
      </div>
    )
  }
)

BorderTrail.displayName = "BorderTrail"
