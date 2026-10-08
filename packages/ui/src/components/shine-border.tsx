"use client"

/**
 * Glin UI Shine Border (shine-border). Adapted from ShineBorder in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/shine-border.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: token colors, WAAPI animation gated by motion level, logical RTL, glass variant, no inline styles.
 * See THIRD_PARTY_NOTICES.md#shine-border.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const shineBorderVariants = cva(
  [
    "pointer-events-none absolute inset-0 size-full rounded-[inherit] p-[var(--shine-bw,1px)] will-change-[background-position]",
    "[background-size:300%_300%]",
    "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] [-webkit-mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [-webkit-mask-clip:content-box,border-box] [-webkit-mask-composite:xor]",
    "rtl:-scale-x-100 forced-colors:hidden"
  ].join(" "),
  {
    variants: {
      variant: {
        default: "[background-image:radial-gradient(transparent,transparent,var(--shine-color,var(--color-accent)),transparent,transparent)]",
        plain: "[background-image:radial-gradient(transparent,transparent,var(--shine-color,var(--color-foreground)),transparent,transparent)]",
        glass:
          "[background-image:radial-gradient(transparent,transparent,var(--shine-color,color-mix(in_oklab,var(--color-accent)_55%,white)),transparent,transparent)]"
      }
    },
    defaultVariants: { variant: "default" }
  }
)

export interface ShineBorderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof shineBorderVariants> {
  /** Border thickness in pixels. */
  borderWidth?: number
  /** Seconds for one full sweep cycle. */
  duration?: number
  /** One color or a list of colors. Defaults to the accent token. */
  shineColor?: string | string[]
}

/**
 * Animated gradient edge that wraps any positioned parent with a rounded border.
 * The parent must be `relative`. Distinct from BorderBeam (a travelling dot):
 * the shine is a soft gradient that drifts around the whole edge.
 */
export const ShineBorder = React.forwardRef<HTMLDivElement, ShineBorderProps>(
  ({ borderWidth = 1, duration = 14, shineColor, variant, className, ...props }, ref) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const colors = Array.isArray(shineColor) ? shineColor.join(",") : shineColor

    React.useEffect(() => {
      const el = localRef.current
      if (!el) return
      el.style.setProperty("--shine-bw", `${borderWidth}px`)
      if (colors) el.style.setProperty("--shine-color", colors)
      else el.style.removeProperty("--shine-color")
    }, [borderWidth, colors])

    React.useEffect(() => {
      const el = localRef.current
      if (!el || !animated || typeof el.animate !== "function") return
      const animation = el.animate(
        [{ backgroundPosition: "0% 0%" }, { backgroundPosition: "100% 100%", offset: 0.5 }, { backgroundPosition: "0% 0%" }],
        { duration: Math.max(duration, 0.1) * 1000, iterations: Infinity, easing: "linear" }
      )
      return () => animation.cancel()
    }, [animated, duration])

    return (
      <div
        ref={mergeRefs(ref, localRef)}
        aria-hidden="true"
        data-slot="shine-border"
        data-animated={animated ? "true" : "false"}
        className={cn(shineBorderVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

ShineBorder.displayName = "ShineBorder"
