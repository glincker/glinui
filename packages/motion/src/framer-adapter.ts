import type { SpringInput } from "./core"
import {
  viewTransitionPresets,
  type TransitionFrame,
  type ViewTransitionPresetName
} from "./view-transitions"
import { resolveStaggerDelay, type StaggerOptions } from "./stagger"

export type FramerTransition = {
  type?: "spring" | "tween"
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number
  restDelta?: number
  duration?: number
  ease?: [number, number, number, number]
  delay?: number
  staggerChildren?: number
  delayChildren?: number
  staggerDirection?: 1 | -1
}

export type FramerTarget = {
  opacity?: number
  y?: number
  scale?: number
  rotate?: number
  filter?: string
  transition?: FramerTransition
}

export type FramerVariants = {
  initial: FramerTarget
  animate: FramerTarget
  exit: FramerTarget
}

type ResolvedSpringForFramer = {
  tension: number
  friction: number
  mass: number
  velocity: number
  precision: number
}

const framerSpringPresets = {
  gentle: { tension: 160, friction: 22, mass: 1.15, velocity: 0, precision: 0.01 },
  smooth: { tension: 220, friction: 24, mass: 1, velocity: 0, precision: 0.01 },
  snappy: { tension: 320, friction: 28, mass: 0.9, velocity: 0, precision: 0.01 },
  bouncy: { tension: 280, friction: 18, mass: 0.95, velocity: 0, precision: 0.01 }
} as const

const defaultFramerSpring: ResolvedSpringForFramer = framerSpringPresets.smooth

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function resolveFramerSpringInput(spring?: SpringInput): ResolvedSpringForFramer {
  if (typeof spring === "string" && spring in framerSpringPresets) {
    return framerSpringPresets[spring as keyof typeof framerSpringPresets]
  }

  if (spring && typeof spring === "object") {
    return {
      tension: clamp(spring.tension ?? defaultFramerSpring.tension, 20, 800),
      friction: clamp(spring.friction ?? defaultFramerSpring.friction, 1, 200),
      mass: clamp(spring.mass ?? defaultFramerSpring.mass, 0.1, 20),
      velocity: clamp(spring.velocity ?? defaultFramerSpring.velocity, -100, 100),
      precision: clamp(spring.precision ?? defaultFramerSpring.precision, 0.0001, 0.1)
    }
  }

  return defaultFramerSpring
}

function tokenEasingToBezier(value: string): [number, number, number, number] | undefined {
  const tokenMap: Record<string, [number, number, number, number]> = {
    "var(--easing-standard)": [0.2, 0, 0, 1],
    "var(--easing-glass)": [0.4, 0, 0.2, 1],
    "var(--easing-spring)": [0.34, 1.56, 0.64, 1]
  }
  if (value in tokenMap) {
    return tokenMap[value]
  }

  const match = value.match(
    /^cubic-bezier\(\s*([-0-9.]+)\s*,\s*([-0-9.]+)\s*,\s*([-0-9.]+)\s*,\s*([-0-9.]+)\s*\)$/
  )
  if (!match) return undefined
  const [, a, b, c, d] = match
  return [Number(a), Number(b), Number(c), Number(d)]
}

function frameToFramerTarget(frame: TransitionFrame): FramerTarget {
  return {
    opacity: frame.opacity,
    y: frame.translateY,
    scale: frame.scale,
    rotate: frame.rotate,
    filter: typeof frame.blur === "number" ? `blur(${frame.blur}px)` : undefined
  }
}

export function toFramerSpring(spring?: SpringInput): FramerTransition {
  const resolved = resolveFramerSpringInput(spring)
  return {
    type: "spring",
    stiffness: resolved.tension,
    damping: resolved.friction,
    mass: resolved.mass,
    velocity: resolved.velocity,
    restDelta: resolved.precision
  }
}

export function toFramerVariants(
  name: ViewTransitionPresetName,
  opts?: { reducedMotion?: boolean; durationScale?: number }
): FramerVariants {
  const preset = viewTransitionPresets[name]
  const scale = opts?.durationScale ?? 1

  if (opts?.reducedMotion) {
    return {
      initial: { opacity: preset.enter.from.opacity ?? 0 },
      animate: { opacity: preset.enter.to.opacity ?? 1 },
      exit: { opacity: preset.exit.to.opacity ?? 0 }
    }
  }

  const enterDuration = Math.max(0.001, (preset.enter.durationMs * scale) / 1000)
  const exitDuration = Math.max(0.001, (preset.exit.durationMs * scale) / 1000)
  const enterEase = tokenEasingToBezier(preset.enter.easing)
  const exitEase = tokenEasingToBezier(preset.exit.easing)

  return {
    initial: frameToFramerTarget(preset.enter.from),
    animate: {
      ...frameToFramerTarget(preset.enter.to),
      transition: {
        type: "tween",
        duration: enterDuration,
        ease: enterEase
      }
    },
    exit: {
      ...frameToFramerTarget(preset.exit.to),
      transition: {
        type: "tween",
        duration: exitDuration,
        ease: exitEase
      }
    }
  }
}

export function toFramerDelay(index: number, options: StaggerOptions): number {
  return resolveStaggerDelay(index, options) / 1000
}

export function toFramerStagger(options: StaggerOptions): FramerTransition {
  const stepMs = options.reducedMotion ? 0 : options.stepMs ?? 40
  const initialDelayMs = options.reducedMotion ? 0 : options.initialDelayMs ?? 0
  const direction = options.direction ?? "forward"
  return {
    delayChildren: initialDelayMs / 1000,
    staggerChildren: stepMs / 1000,
    staggerDirection: direction === "reverse" ? -1 : 1
  }
}
