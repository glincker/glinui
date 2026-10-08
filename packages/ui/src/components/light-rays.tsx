"use client"

/**
 * Glin UI Light Rays (light-rays). Adapted from LightRays in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/light-rays.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: WAAPI instead of motion, seeded rays, tokens, motion levels, pause offscreen, RTL mirror.
 * See THIRD_PARTY_NOTICES.md#light-rays.
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const MAX_RAYS = 24

const lightRaysVariants = cva(
  "pointer-events-none absolute inset-0 isolate overflow-hidden rounded-[inherit] select-none",
  {
    variants: {
      variant: {
        soft: "",
        crisp: ""
      }
    },
    defaultVariants: { variant: "soft" }
  }
)

export interface LightRaysProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">,
    VariantProps<typeof lightRaysVariants> {
  /** Number of rays, capped at 24. */
  count?: number
  /** Any CSS color. Defaults to the accent token. */
  color?: string
  /** Blur radius in px. Defaults to 24 (soft) or 6 (crisp). */
  blur?: number
  /** Seconds for one sway cycle. */
  speed?: number
  /** CSS length of each ray, for example "70%" or "28rem". */
  length?: string
  /** Overall strength from 0 to 1. Keep at or below 0.5 behind text. */
  intensity?: number
  /** Seed for the deterministic ray layout. */
  seed?: number
}

export interface RayShape {
  left: number
  rotate: number
  width: number
  swing: number
  delay: number
  duration: number
  strength: number
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Deterministic ray layout: the same seed always gives the same rays. */
export function createRays(count: number, cycle: number, seed: number): RayShape[] {
  const n = Math.max(0, Math.min(MAX_RAYS, Math.floor(count)))
  const rand = mulberry32(seed * 9973 + 17)
  return Array.from({ length: n }, () => ({
    left: 8 + rand() * 84,
    rotate: -28 + rand() * 56,
    width: 2 + rand() * 3,
    swing: 0.8 + rand() * 1.8,
    delay: rand() * cycle,
    duration: cycle * (0.75 + rand() * 0.5),
    strength: 0.6 + rand() * 0.5
  }))
}

export const LightRays = React.forwardRef<HTMLDivElement, LightRaysProps>(
  (
    {
      className,
      variant,
      count = 7,
      color = "var(--color-accent)",
      blur,
      speed = 14,
      length = "120%",
      intensity = 0.35,
      seed = 1,
      ...props
    },
    ref
  ) => {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const { effectiveLevel } = useMotionEngine()
    const active = usePlaybackActive(rootRef)
    const animationsRef = React.useRef<Animation[]>([])
    const cycle = Math.max(speed, 0.1)
    const animated = effectiveLevel === "full"
    const blurPx = blur ?? (variant === "crisp" ? 6 : 24)
    const rays = React.useMemo(() => createRays(count, cycle, seed), [count, cycle, seed])

    React.useEffect(() => {
      const root = rootRef.current
      if (!root) return
      root.style.setProperty("--glin-rays-color", color)
      root.style.setProperty("--glin-rays-blur", `${blurPx}px`)
      root.style.setProperty("--glin-rays-length", length)
      root.style.setProperty("--glin-rays-strength", String(Math.min(1, Math.max(0, intensity))))
    }, [color, blurPx, length, intensity])

    React.useEffect(() => {
      const root = rootRef.current
      if (!root) return
      const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-ray]"))
      const level = Math.min(1, Math.max(0, intensity)) * 2
      const created: Animation[] = []
      nodes.forEach((node, i) => {
        const ray = rays[i]
        if (!ray) return
        node.style.setProperty("--ray-left", `${ray.left}%`)
        node.style.setProperty("--ray-width", `${ray.width}rem`)
        node.style.setProperty("--ray-rotate", `${ray.rotate}deg`)
        node.style.setProperty("--ray-opacity", String(ray.strength * level * 0.6))
        if (animated && typeof node.animate === "function") {
          const t = (deg: number) => `translateX(-50%) rotate(${deg}deg)`
          const anim = node.animate(
            [
              { opacity: 0, transform: t(ray.rotate - ray.swing) },
              { opacity: Math.min(1, ray.strength * level), transform: t(ray.rotate + ray.swing), offset: 0.5 },
              { opacity: 0, transform: t(ray.rotate - ray.swing) }
            ],
            {
              duration: ray.duration * 1000,
              delay: -ray.delay * 1000,
              iterations: Infinity,
              easing: "ease-in-out"
            }
          )
          created.push(anim)
        }
      })
      animationsRef.current = created
      return () => {
        created.forEach((a) => a.cancel())
        animationsRef.current = []
      }
    }, [rays, animated, intensity])

    React.useEffect(() => {
      animationsRef.current.forEach((a) => (active ? a.play() : a.pause()))
    }, [active, rays, animated])

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        aria-hidden="true"
        data-slot="light-rays"
        data-variant={variant ?? "soft"}
        data-animated={animated ? "true" : "false"}
        className={cn(lightRaysVariants({ variant }), className)}
        {...props}
      >
        <div className="absolute inset-0 rtl:-scale-x-100">
          <div className="absolute inset-0 opacity-[calc(var(--glin-rays-strength,0.35)*0.7)] [background:radial-gradient(circle_at_20%_15%,color-mix(in_srgb,var(--glin-rays-color,var(--color-accent))_35%,transparent),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[calc(var(--glin-rays-strength,0.35)*0.7)] [background:radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--glin-rays-color,var(--color-accent))_28%,transparent),transparent_75%)]" />
          {rays.map((_, i) => (
            <div
              key={i}
              data-ray=""
              className={cn(
                "absolute -top-[12%] left-[var(--ray-left,50%)] h-[var(--glin-rays-length,70%)] w-[var(--ray-width,12rem)] origin-top rounded-full",
                "bg-gradient-to-b from-[color-mix(in_srgb,var(--glin-rays-color,var(--color-accent))_80%,transparent)] to-transparent",
                "[filter:blur(var(--glin-rays-blur,36px))] [transform:translateX(-50%)_rotate(var(--ray-rotate,0deg))]",
                "opacity-[var(--ray-opacity,0)] dark:mix-blend-screen",
                animated && "will-change-[opacity,transform]"
              )}
            />
          ))}
        </div>
      </div>
    )
  }
)

LightRays.displayName = "LightRays"
