"use client"
/**
 * Glin UI Sparkles Text (sparkles-text). Adapted from SparklesText in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/sparkles-text.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714. Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: no motion dependency (WAAPI), effect-only randomness, fixed pool, tokens, motion levels.
 * See THIRD_PARTY_NOTICES.md#sparkles-text.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import { useMotionEngine } from "./motion-engine"

export const MAX_SPARKLES = 24

export interface SparklesTextColors {
  first: string
  second: string
}

export interface SparklesTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  children: React.ReactNode
  /** Element to render. */
  as?: "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  /** Number of sparkles alive at once. Capped at 24. */
  sparklesCount?: number
  /** Sparkle colors. Any CSS color, defaults to Glin tokens. */
  colors?: SparklesTextColors
}

const DEFAULT_COLORS: SparklesTextColors = {
  first: "var(--color-accent)",
  second: "var(--color-signal-ok)"
}

const STAR_PATH =
  "M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"

const STAR_CLASS =
  "pointer-events-none absolute z-10 size-[max(0.75rem,0.3em)] -translate-x-1/2 -translate-y-1/2"

function Star({ color, className }: { color: string; className?: string }) {
  const ref = React.useRef<SVGSVGElement>(null)
  React.useLayoutEffect(() => {
    ref.current?.style.setProperty("color", color)
  }, [color])
  return (
    <svg ref={ref} aria-hidden="true" focusable="false" viewBox="0 0 21 21" className={className}>
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  )
}

/** One animated sparkle. Position and timing are re-rolled in place, no React state churn. */
function AnimatedSparkle({ color }: { color: string }) {
  const ref = React.useRef<SVGSVGElement>(null)
  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof el.animate !== "function") return
    el.style.setProperty("color", color)
    const place = () => {
      el.style.insetInlineStart = `${Math.random() * 100}%`
      el.style.top = `${Math.random() * 100}%`
    }
    place()
    const scale = 0.4 + Math.random() * 0.9
    const animation = el.animate(
      [
        { opacity: 0, transform: `translate(-50%, -50%) scale(0) rotate(75deg)` },
        { opacity: 1, transform: `translate(-50%, -50%) scale(${scale}) rotate(120deg)`, offset: 0.5 },
        { opacity: 0, transform: `translate(-50%, -50%) scale(0) rotate(150deg)` }
      ],
      { duration: 900 + Math.random() * 500, delay: Math.random() * 2000, easing: "ease-in-out", fill: "both" }
    )
    animation.onfinish = () => {
      place()
      animation.effect?.updateTiming({ delay: Math.random() * 1200 })
      animation.play()
    }
    return () => {
      animation.onfinish = null
      animation.cancel()
    }
  }, [color])
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 21 21"
      data-sparkle=""
      className={cn(STAR_CLASS, "opacity-0")}
    >
      <path d={STAR_PATH} fill="currentColor" />
    </svg>
  )
}

export const SparklesText = React.forwardRef<HTMLElement, SparklesTextProps>(
  ({ children, as = "div", sparklesCount = 10, colors = DEFAULT_COLORS, className, ...props }, ref) => {
    const { effectiveLevel } = useMotionEngine()
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    const count = Math.max(0, Math.min(Math.floor(sparklesCount), MAX_SPARKLES))
    const Tag = as as React.ElementType
    const { first, second } = colors

    return (
      <Tag
        ref={ref}
        data-motion={mounted ? effectiveLevel : undefined}
        className={cn("text-[length:clamp(1.75rem,8vw,3.75rem)] font-bold text-[var(--color-foreground)]", className)}
        {...props}
      >
        <span className="relative inline-block">
          {mounted && effectiveLevel === "full" &&
            Array.from({ length: count }, (_, i) => (
              <AnimatedSparkle key={i} color={i % 2 === 0 ? first : second} />
            ))}
          {mounted && effectiveLevel !== "full" && count > 0 && (
            <>
              <Star color={first} className={cn(STAR_CLASS, "top-0 [inset-inline-end:-0.1em]")} />
              <Star color={second} className={cn(STAR_CLASS, "top-full [inset-inline-start:0.05em]")} />
            </>
          )}
          <strong className="font-[inherit]">{children}</strong>
        </span>
      </Tag>
    )
  }
)
SparklesText.displayName = "SparklesText"
