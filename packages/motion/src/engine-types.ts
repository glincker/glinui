import type { MotionPresetName, SpringInput } from "./core"
import type { StaggerDirection } from "./stagger"

/** Stops an animation, disconnects observers and leaves the element in its final (visible) state. */
export type EngineCleanup = () => void

/** Names of the engines that ship with @glinui/motion. Any other string is a custom engine. */
export type BuiltinEngineName = "css" | "motion" | "gsap"
export type EngineName = BuiltinEngineName | (string & {})

/** Animation level: full motion, opacity-only, or static. `system` follows prefers-reduced-motion. */
export type MotionLevel = "full" | "subtle" | "none" | "system"
export type ResolvedMotionLevel = "full" | "subtle" | "none"

export type RevealDirection = "up" | "down" | "left" | "right" | "none"

/** Named easings, a cubic-bezier tuple, or `spring` (uses the `spring` option or the smooth preset). */
export type EngineEasing =
  | "out"
  | "standard"
  | "in-out"
  | "linear"
  | "spring"
  | readonly [number, number, number, number]

export type EngineCapabilities = {
  /** True when the engine integrates real spring physics rather than a bezier approximation. */
  spring: boolean
  /** True when in-view triggering is handled by a scroll engine (e.g. ScrollTrigger). */
  scrollTrigger: boolean
  /** True when `timeline` is implemented. */
  timeline: boolean
  /** True when `splitText` is implemented. */
  splitText: boolean
  /** Approximate extra bytes this engine adds to a bundle (informational). */
  runtime: "native" | "library"
}

export type EngineRevealOptions = {
  /** Existing preset used for default frames. Explicit options below win. */
  preset?: MotionPresetName
  /** Direction the element travels in. `up` starts below and moves up. Default `up`. */
  direction?: RevealDirection
  /** Travel distance in px. Default 12 (0 for the fadeIn preset). */
  distance?: number
  /** Starting blur radius in px. Default 0. */
  blur?: number
  /** Starting scale. Default 1. */
  scale?: number
  /** Duration in ms. Default 520 (spring settling time when a spring is used). */
  duration?: number
  /** Delay in ms. Default 0. */
  delay?: number
  easing?: EngineEasing
  spring?: SpringInput
  /** Animate only the first time the element enters the viewport. Default true. */
  once?: boolean
  /** Visible fraction (0 to 1) needed to trigger. Default 0.15. */
  threshold?: number
  /** IntersectionObserver root margin. Default `0px`. */
  rootMargin?: string
  /** Skip the in-view trigger and play now. Default false. */
  immediate?: boolean
  onComplete?: () => void
}

export type EngineStaggerOptions = EngineRevealOptions & {
  /** Delay between children in ms. Default 60. */
  step?: number
  /** Upper bound for the cumulative stagger delay in ms. Default 1200. */
  maxDelay?: number
  /** Order the children are revealed in. Default `forward`. */
  order?: StaggerDirection
  /** Element whose visibility triggers the group. Default: the first child. */
  trigger?: HTMLElement
}

export type EngineCountOptions = {
  duration?: number
  delay?: number
  easing?: EngineEasing
  spring?: SpringInput
  /** Fraction digits used by the default formatter. Default: digits of `to`, max 4. */
  decimals?: number
  locale?: string
  /** Custom formatter. Receives the current value. */
  format?: (value: number) => string
  once?: boolean
  threshold?: number
  rootMargin?: string
  immediate?: boolean
  onComplete?: () => void
}

export type EngineSplitOptions = EngineStaggerOptions & {
  /** Split granularity. Default `words`. */
  by?: "words" | "chars"
}

export type EngineTimelineStep = {
  target: HTMLElement | readonly HTMLElement[]
  /** Absolute start time in ms from the beginning of the timeline. */
  at?: number
  reveal?: EngineRevealOptions
}

export type EngineTimelineOptions = { onComplete?: () => void }

/**
 * The contract every animation engine implements. Every method returns a cleanup
 * that stops the animation, disconnects observers and leaves the element visible.
 * Methods must be idempotent and SSR safe (never touch `window` at import time).
 */
export interface MotionEngine {
  readonly name: EngineName
  readonly capabilities: EngineCapabilities
  reveal(el: HTMLElement, opts?: EngineRevealOptions): EngineCleanup
  stagger(els: ArrayLike<HTMLElement>, opts?: EngineStaggerOptions): EngineCleanup
  countTo(el: HTMLElement, from: number, to: number, opts?: EngineCountOptions): EngineCleanup
  splitText?(el: HTMLElement, opts?: EngineSplitOptions): EngineCleanup
  timeline?(steps: readonly EngineTimelineStep[], opts?: EngineTimelineOptions): EngineCleanup
}

export type EngineFactory = () => MotionEngine | Promise<MotionEngine>

/** Resolved visual state of an element at one end of a reveal. */
export type EngineFrame = { opacity: number; x: number; y: number; scale: number; blur: number }

/** Normalised timing shared by every adapter. */
export type EngineTiming = {
  durationMs: number
  delayMs: number
  /** `cubic-bezier(...)` string, valid for CSS and WAAPI. */
  cssEasing: string
  /** Bezier control points, or undefined when `spring` is set. */
  bezier?: readonly [number, number, number, number]
  /** Spring physics when requested. */
  spring?: { stiffness: number; damping: number; mass: number }
  /** Progress function (0 to 1) that reproduces the easing, for engines without bezier support. */
  ease: (progress: number) => number
}

/** One animatable unit produced by an adapter. */
export interface ElementAnimator {
  /** Put the element in its starting (hidden) state. */
  reset(): void
  /** Play to the final state after an extra delay in ms. */
  play(extraDelayMs: number): void
  /** Stop everything and leave the element in its final, visible state. */
  dispose(): void
}

export interface TweenHandle {
  play(extraDelayMs: number): void
  stop(): void
}

export type ObserveOptions = { threshold: number; rootMargin: string }

/**
 * Lowest-level building block. Implement this and pass it to `createEngine`
 * to get a complete `MotionEngine` (reveal, stagger, countTo, splitText).
 */
export interface EngineAdapter {
  readonly name: EngineName
  readonly capabilities: EngineCapabilities
  animate(
    el: HTMLElement,
    from: EngineFrame,
    timing: EngineTiming,
    onComplete?: () => void
  ): ElementAnimator
  tween(
    from: number,
    to: number,
    timing: EngineTiming,
    onUpdate: (value: number) => void,
    onComplete?: () => void
  ): TweenHandle
  /** Call `enter` when `target` becomes visible and `leave` when it hides. Return a disposer. */
  observe(
    target: HTMLElement,
    opts: ObserveOptions,
    enter: () => void,
    leave: () => void
  ): EngineCleanup
}
