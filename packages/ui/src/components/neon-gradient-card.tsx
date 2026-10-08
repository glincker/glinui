"use client"

/**
 * Glin UI Neon Gradient Card (neon-gradient-card). Adapted from NeonGradientCard in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/neon-gradient-card.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: token colors, padding based ring (no ResizeObserver), WAAPI spin gated by motion level, glass variant.
 * See THIRD_PARTY_NOTICES.md#neon-gradient-card.
 */

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "../lib/cn"
import { resolveVariant, type SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"
import { useMotionEngine } from "./motion-engine"

const GRADIENT = "[background-image:linear-gradient(0deg,var(--neon-a,var(--color-accent)),var(--neon-b,var(--color-signal-ok)))] [background-size:100%_200%]"

const neonFaceVariants = cva("relative size-full min-h-[inherit] rounded-[calc(var(--neon-radius,1.25rem)-var(--neon-bw,2px))] p-6 text-[var(--color-foreground)] [overflow-wrap:anywhere]", {
  variants: {
    variant: {
      glinr: "[background:var(--sheen),var(--face-1,var(--surface-1))]",
      solid: "bg-[var(--surface-2)]",
      plain: "bg-[var(--surface-1)]",
      soft: "bg-[var(--surface-2)]",
      outline: "bg-[var(--color-background)]",
      ghost: "bg-[var(--color-background)]",
      gradient: "bg-[var(--surface-1)]",
      glass: "bg-[var(--glass-readable)] backdrop-blur-xl backdrop-saturate-150"
    }
  },
  defaultVariants: { variant: "glinr" }
})

export type NeonVariant = SurfaceVariant | "default"

export interface NeonColors {
  firstColor: string
  secondColor: string
}

export interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Face under the neon ring. Omitted follows the ambient style (glinr by default). `glass` is opt-in. */
  variant?: NeonVariant | null
  /** Ring thickness in pixels. */
  borderSize?: number
  /** Outer corner radius in pixels. */
  borderRadius?: number
  /** Gradient colors. Default to the accent and signal tokens. */
  neonColors?: Partial<NeonColors>
  /** Seconds per gradient cycle. */
  duration?: number
  /** Class for the inner content face. */
  contentClassName?: string
}

/**
 * Card with an animated neon gradient ring and a soft glow. Ring size is plain padding, so
 * it follows the content without any JS measurement.
 */
export const NeonGradientCard = React.forwardRef<HTMLDivElement, NeonGradientCardProps>(
  (
    { className, contentClassName, children, borderSize = 2, borderRadius = 20, neonColors, duration = 6, variant, ...props },
    ref
  ) => {
    const ambient = useGlinStyle()
    const face = resolveVariant(variant, ambient, "signature")
    const ringRef = React.useRef<HTMLDivElement | null>(null)
    const glowRef = React.useRef<HTMLDivElement | null>(null)
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const { effectiveLevel } = useMotionEngine()
    const animated = effectiveLevel === "full"
    const staticRing = effectiveLevel !== "full"
    const first = neonColors?.firstColor
    const second = neonColors?.secondColor

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    React.useEffect(() => {
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--neon-bw", `${borderSize}px`)
      el.style.setProperty("--neon-radius", `${borderRadius}px`)
      if (first) el.style.setProperty("--neon-a", first)
      else el.style.removeProperty("--neon-a")
      if (second) el.style.setProperty("--neon-b", second)
      else el.style.removeProperty("--neon-b")
    }, [borderSize, borderRadius, first, second])

    React.useEffect(() => {
      if (!animated) return
      const animations: Animation[] = []
      for (const el of [ringRef.current, glowRef.current]) {
        if (!el || typeof el.animate !== "function") continue
        animations.push(
          el.animate(
            [{ backgroundPosition: "0% 0%" }, { backgroundPosition: "0% 100%", offset: 0.5 }, { backgroundPosition: "0% 0%" }],
            { duration: Math.max(duration, 0.1) * 1000, iterations: Infinity, easing: "ease-in-out" }
          )
        )
      }
      return () => animations.forEach((animation) => animation.cancel())
    }, [animated, duration])

    return (
      <div
        ref={setRefs}
        data-slot="neon-gradient-card"
        data-variant={face}
        data-animated={animated ? "true" : "false"}
        className={cn(
          "relative isolate z-0 rounded-[var(--neon-radius,1.25rem)] p-[var(--neon-bw,2px)] forced-colors:border forced-colors:border-[CanvasText]",
          className
        )}
        {...props}
      >
        <div
          ref={glowRef}
          aria-hidden="true"
          data-slot="neon-glow"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] opacity-70 blur-xl sm:blur-2xl forced-colors:hidden",
            staticRing && "hidden",
            GRADIENT
          )}
        />
        <div
          ref={ringRef}
          aria-hidden="true"
          data-slot="neon-ring"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-[inherit] forced-colors:hidden",
            face === "glass" && "[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [mask-clip:content-box,border-box] [mask-composite:exclude] [-webkit-mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)] [-webkit-mask-clip:content-box,border-box] [-webkit-mask-composite:xor] p-[var(--neon-bw,2px)]",
            GRADIENT
          )}
        />
        <div className={cn(neonFaceVariants({ variant: face }), contentClassName)}>{children}</div>
      </div>
    )
  }
)

NeonGradientCard.displayName = "NeonGradientCard"
