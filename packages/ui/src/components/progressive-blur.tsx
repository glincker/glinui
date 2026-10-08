"use client"

/**
 * Glin UI Progressive Blur (progressive-blur). Adapted from ProgressiveBlur in Motion Primitives
 * (https://github.com/ibelick/motion-primitives, components/core/progressive-blur.tsx),
 * commit 120f64f6ca60348e251f929e9c81f11ccbe45eda.
 * Original copyright (c) 2024 ibelick. Licensed under MIT.
 * Modified for Glin UI: motion/react removed, logical start and end directions, layer cap, per-layer values as CSS variables
 * instead of inline styles, single gradient fade at motion none, forced-colors and RTL handling.
 * See THIRD_PARTY_NOTICES.md#progressive-blur.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const MAX_LAYERS = 8
const MIN_LAYERS = 2

const progressiveBlurVariants = cva("pointer-events-none absolute z-10 overflow-hidden rounded-[inherit] forced-colors:hidden", {
  variants: {
    direction: {
      top: "inset-x-0 top-0 h-[var(--pb-size,6rem)] [--pb-angle:0deg]",
      bottom: "inset-x-0 bottom-0 h-[var(--pb-size,6rem)] [--pb-angle:180deg]",
      start: "inset-y-0 start-0 w-[var(--pb-size,6rem)] [--pb-angle:270deg] rtl:[--pb-angle:90deg]",
      end: "inset-y-0 end-0 w-[var(--pb-size,6rem)] [--pb-angle:90deg] rtl:[--pb-angle:270deg]"
    },
    variant: {
      default: "[--pb-fade:var(--color-background)]",
      plain: "[--pb-fade:var(--color-background)]",
      glass: "[--pb-fade:color-mix(in_oklab,var(--color-background)_70%,transparent)]"
    }
  },
  defaultVariants: { direction: "bottom", variant: "default" }
})

// Window for layer i: transparent, ramp up, solid, ramp down, in units of one segment (1 / (n + 1)).
const LAYER_MASK =
  "[mask-image:linear-gradient(var(--pb-angle),transparent_calc(var(--pb-i)*var(--pb-seg)),#000_calc((var(--pb-i)+1)*var(--pb-seg)),#000_calc((var(--pb-i)+2)*var(--pb-seg)),transparent_calc((var(--pb-i)+3)*var(--pb-seg)))] [-webkit-mask-image:linear-gradient(var(--pb-angle),transparent_calc(var(--pb-i)*var(--pb-seg)),#000_calc((var(--pb-i)+1)*var(--pb-seg)),#000_calc((var(--pb-i)+2)*var(--pb-seg)),transparent_calc((var(--pb-i)+3)*var(--pb-seg)))]"

const LAYER_BLUR =
  "[backdrop-filter:blur(calc(var(--pb-i)*var(--pb-step)))] [-webkit-backdrop-filter:blur(calc(var(--pb-i)*var(--pb-step)))]"

// Literal classes so the Tailwind scanner sees every index.
const LAYER_INDEX = [
  "[--pb-i:0]",
  "[--pb-i:1]",
  "[--pb-i:2]",
  "[--pb-i:3]",
  "[--pb-i:4]",
  "[--pb-i:5]",
  "[--pb-i:6]",
  "[--pb-i:7]"
]

export interface ProgressiveBlurProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressiveBlurVariants> {
  /** Number of stacked backdrop-filter layers, clamped to 2..8. */
  blurLayers?: number
  /** Extra blur in pixels added per layer (the strongest layer blurs by `(layers - 1) * blurIntensity`). */
  blurIntensity?: number
  /** Thickness of the overlay along its axis. A number is pixels, a string is any CSS length. */
  size?: number | string
}

/**
 * Edge overlay that blurs content progressively. Put it inside a `relative` scroll container or a sticky header.
 * It never receives pointer events. At motion level none it renders a single gradient fade without backdrop-filter.
 */
export const ProgressiveBlur = React.forwardRef<HTMLDivElement, ProgressiveBlurProps>(
  ({ direction, variant, blurLayers = MAX_LAYERS, blurIntensity = 1, size, className, ...props }, ref) => {
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const fade = effectiveLevel === "none"
    const layers = Math.min(Math.max(Math.round(blurLayers), MIN_LAYERS), MAX_LAYERS)

    React.useEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--pb-step", `${blurIntensity}px`)
      el.style.setProperty("--pb-seg", `${100 / (layers + 1)}%`)
      if (size === undefined) el.style.removeProperty("--pb-size")
      else el.style.setProperty("--pb-size", typeof size === "number" ? `${size}px` : size)
    }, [blurIntensity, layers, size])

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        aria-hidden="true"
        data-slot="progressive-blur"
        data-mode={fade ? "fade" : "blur"}
        data-layers={fade ? 1 : layers}
        className={cn(progressiveBlurVariants({ direction, variant }), className)}
        {...props}
      >
        {fade ? (
          <span className="absolute inset-0 [background-image:linear-gradient(var(--pb-angle),transparent,var(--pb-fade))]" />
        ) : (
          Array.from({ length: layers }, (_, index) => (
            <span
              key={index}
              data-layer={index}
              className={cn("absolute inset-0 rounded-[inherit]", LAYER_MASK, LAYER_BLUR, LAYER_INDEX[index])}
            />
          ))
        )}
      </div>
    )
  }
)

ProgressiveBlur.displayName = "ProgressiveBlur"
