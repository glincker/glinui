"use client"

/**
 * Glin UI Spinning Text (spinning-text). Adapted from SpinningText in Motion Primitives
 * (https://github.com/ibelick/motion-primitives, components/core/spinning-text.tsx),
 * commit 120f64f6ca60348e251f929e9c81f11ccbe45eda.
 * Original copyright (c) 2024 ibelick. Licensed under MIT.
 * Modified for Glin UI: motion/react removed (rotation runs through the Web Animations API), tokens,
 * accessible name on a role="img" wrapper, pause on hover, offscreen and hidden tab, static ring at none, RTL.
 * See THIRD_PARTY_NOTICES.md#spinning-text.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const spinningTextVariants = cva(
  [
    "relative inline-block shrink-0 select-none font-medium uppercase tracking-wide",
    "[font-size:calc(var(--st-fs,1)*1rem)]",
    "size-[calc(var(--st-r,5)*2ch+2em)]"
  ].join(" "),
  {
    variants: {
      variant: {
        default: "text-[var(--color-foreground)]",
        plain: "text-[var(--color-foreground)]",
        glass: "text-[var(--color-foreground)] [text-shadow:0_1px_8px_color-mix(in_oklab,var(--color-background)_60%,transparent)]"
      }
    },
    defaultVariants: { variant: "default" }
  }
)

export interface SpinningTextProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof spinningTextVariants> {
  /** The string laid out on the ring. It becomes the accessible name. */
  children: string
  /** Seconds per full turn. */
  duration?: number
  /** Spin counter-clockwise. In RTL documents the default direction is mirrored. */
  reverse?: boolean
  /** Glyph size in rem. */
  fontSize?: number
  /** Ring radius in ch units. */
  radius?: number
  /** Pause the rotation while hovered or focused within. */
  pauseOnHover?: boolean
}

/** Text laid out on a rotating circle. Glyphs are decorative, the wrapper carries the real string. */
export const SpinningText = React.forwardRef<HTMLSpanElement, SpinningTextProps>(
  ({ children, duration = 10, reverse = false, fontSize = 1, radius = 5, pauseOnHover = false, variant, className, onPointerEnter, onPointerLeave, onFocus, onBlur, ...props }, ref) => {
    const rootRef = React.useRef<HTMLSpanElement | null>(null)
    const ringRef = React.useRef<HTMLSpanElement | null>(null)
    const animationRef = React.useRef<Animation | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const active = usePlaybackActive(rootRef)
    const activeRef = React.useRef(active)
    activeRef.current = active
    const hoverPaused = React.useRef(false)
    const letters = React.useMemo(() => Array.from(children), [children])
    const total = letters.length

    React.useEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--st-fs", String(fontSize))
      el.style.setProperty("--st-r", String(radius))
    }, [fontSize, radius])

    // Place each glyph on the circle: per-glyph angle is a CSS variable, never an inline style attribute.
    React.useLayoutEffect(() => {
      const ring = ringRef.current
      if (!ring) return
      ring.style.setProperty("--st-n", String(Math.max(total, 1)))
      Array.from(ring.children).forEach((child, index) => {
        ;(child as HTMLElement).style.setProperty("--st-i", String(index))
      })
      ring.dataset.ready = "true"
    }, [total])

    React.useEffect(() => {
      const ring = ringRef.current
      if (!ring || !animated || typeof ring.animate !== "function") return
      const rtl = typeof getComputedStyle === "function" && getComputedStyle(ring).direction === "rtl"
      const clockwise = reverse === rtl
      const animation = ring.animate(
        [{ transform: "rotate(0deg)" }, { transform: `rotate(${clockwise ? 360 : -360}deg)` }],
        { duration: Math.max(duration, 0.1) * 1000, iterations: Infinity, easing: "linear" }
      )
      animationRef.current = animation
      if (!activeRef.current || hoverPaused.current) animation.pause()
      return () => {
        animation.cancel()
        animationRef.current = null
      }
    }, [animated, duration, reverse])

    React.useEffect(() => {
      const animation = animationRef.current
      if (!animation) return
      if (active && !hoverPaused.current) animation.play()
      else animation.pause()
    }, [active])

    const setHover = (paused: boolean) => {
      if (!pauseOnHover) return
      hoverPaused.current = paused
      const animation = animationRef.current
      if (!animation) return
      if (!paused && activeRef.current) animation.play()
      else animation.pause()
    }

    return (
      <span
        ref={mergeRefs(ref, rootRef)}
        role="img"
        aria-label={children}
        data-slot="spinning-text"
        data-animated={animated ? "true" : "false"}
        className={cn(spinningTextVariants({ variant }), className)}
        onPointerEnter={(event) => {
          onPointerEnter?.(event)
          setHover(true)
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event)
          setHover(false)
        }}
        onFocus={(event) => {
          onFocus?.(event)
          setHover(true)
        }}
        onBlur={(event) => {
          onBlur?.(event)
          setHover(false)
        }}
        {...props}
      >
        <span
          ref={ringRef}
          aria-hidden="true"
          data-slot="spinning-text-ring"
          className="absolute inset-0 block opacity-0 data-[ready=true]:opacity-100"
        >
          {letters.map((letter, index) => (
            <span
              // eslint-disable-next-line react/no-array-index-key -- glyph order is the identity
              key={`${index}-${letter}`}
              className="absolute start-1/2 top-1/2 inline-block whitespace-pre [transform:translate(-50%,-50%)_rotate(calc(360deg/var(--st-n,1)*var(--st-i,0)*var(--st-dir,1)))_translateY(calc(var(--st-r,5)*-1ch))] rtl:[--st-dir:-1]"
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    )
  }
)

SpinningText.displayName = "SpinningText"
