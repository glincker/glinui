"use client"

import * as React from "react"
import type { EngineName, EngineRevealOptions, MotionLevel, RevealDirection, SpringInput } from "@glinui/motion"

import { mergeRefs, useEngineRun } from "./motion-engine"

export type RevealVariant = "fade" | "slide" | "blur" | "blur-slide" | "scale"

export type RevealTag =
  | "div"
  | "span"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "main"
  | "aside"
  | "nav"
  | "p"
  | "li"
  | "ul"
  | "ol"
  | "h1"
  | "h2"
  | "h3"
  | "h4"

/** Shared engine controls available on every engine-driven component. */
export type EngineControlProps = {
  /** Engine override: `css` (default), `motion`, `gsap` or a registered custom engine. */
  engine?: EngineName
  /** Motion override. `none` renders the static final state, `subtle` is opacity only. */
  motion?: MotionLevel
}

const VARIANT_OPTIONS: Record<RevealVariant, EngineRevealOptions> = {
  fade: { distance: 0 },
  slide: { distance: 16 },
  blur: { distance: 0, blur: 10 },
  "blur-slide": { distance: 16, blur: 8 },
  scale: { distance: 0, scale: 0.94 }
}

/** Map a design-system variant to engine reveal options. */
export function variantToRevealOptions(
  variant: RevealVariant,
  overrides: { direction?: RevealDirection; distance?: number } = {}
): EngineRevealOptions {
  const base = VARIANT_OPTIONS[variant]
  const distance = base.distance === 0 ? 0 : (overrides.distance ?? base.distance)
  return { ...base, distance, direction: overrides.direction ?? "up" }
}

export type RevealProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> &
  EngineControlProps & {
    as?: RevealTag
    variant?: RevealVariant
    /** Direction the content travels in. Default `up`. */
    direction?: RevealDirection
    /** Travel distance in px for slide variants. */
    distance?: number
    /** Duration in ms. Defaults to the engine default (520). */
    duration?: number
    /** Delay in ms. */
    delay?: number
    spring?: SpringInput
    /** Animate only the first time it enters the viewport. Default true. */
    once?: boolean
    /** Visible fraction (0 to 1) required to trigger. Default 0.15. */
    threshold?: number
    /** Play on mount instead of waiting for the viewport. */
    immediate?: boolean
    children?: React.ReactNode
  }

export const Reveal = React.forwardRef<HTMLElement, RevealProps>(function Reveal(
  {
    as = "div",
    variant = "slide",
    direction,
    distance,
    duration,
    delay,
    spring,
    once = true,
    threshold,
    immediate = false,
    engine,
    motion,
    children,
    ...props
  },
  forwardedRef
) {
  const innerRef = React.useRef<HTMLElement | null>(null)

  useEngineRun(
    { engine, motion, hideRef: innerRef },
    (instance) => {
      const el = innerRef.current
      if (!el) return
      return instance.reveal(el, {
        ...variantToRevealOptions(variant, { direction, distance }),
        duration,
        delay,
        spring,
        once,
        threshold,
        immediate
      })
    },
    [variant, direction, distance, duration, delay, spring, once, threshold, immediate]
  )

  return React.createElement(
    as,
    { ...props, ref: mergeRefs<HTMLElement>(innerRef, forwardedRef), "data-glin-reveal": variant },
    children
  )
})

Reveal.displayName = "Reveal"
