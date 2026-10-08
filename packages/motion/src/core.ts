export type MotionPresetName =
  | "fadeIn"
  | "slideUp"
  | "glassHover"
  | "spotlightPulse"
  | "springSmooth"
  | "springSnappy"

export type MotionPreset = {
  from: Record<string, number | string>
  to: Record<string, number | string>
  duration: string
  easing: string
  spring?: ResolvedSpringConfig
}

export type SpringPresetName = "gentle" | "smooth" | "snappy" | "bouncy"

export type SpringConfig = {
  /** Hooke's law stiffness constant (k). Higher = snappier. */
  tension: number
  /** Damping coefficient (c). Higher = less oscillation. */
  friction: number
  /** Simulated mass (m). Higher = heavier feel. */
  mass: number
  /** Initial velocity in units/s for future gesture handoff. */
  velocity: number
  /** Precision target for "settled" spring value. */
  precision: number
}

export type ResolvedSpringConfig = SpringConfig & {
  dampingRatio: number
  angularFrequency: number
  settlingDurationMs: number
  cssEasing: string
}

const DEFAULT_SPRING: SpringConfig = {
  tension: 220,
  friction: 24,
  mass: 1,
  velocity: 0,
  precision: 0.01
}

export const springPresets: Record<SpringPresetName, SpringConfig> = {
  gentle: {
    tension: 160,
    friction: 22,
    mass: 1.15,
    velocity: 0,
    precision: 0.01
  },
  smooth: {
    tension: 220,
    friction: 24,
    mass: 1,
    velocity: 0,
    precision: 0.01
  },
  snappy: {
    tension: 320,
    friction: 28,
    mass: 0.9,
    velocity: 0,
    precision: 0.01
  },
  bouncy: {
    tension: 280,
    friction: 18,
    mass: 0.95,
    velocity: 0,
    precision: 0.01
  }
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function isSpringPreset(value: string): value is SpringPresetName {
  return value in springPresets
}

function formatBezier(x1: number, y1: number, x2: number, y2: number): string {
  const r = (n: number) => Number(n.toFixed(3))
  return `cubic-bezier(${r(x1)}, ${r(y1)}, ${r(x2)}, ${r(y2)})`
}

function resolveSpringEasing(tension: number, dampingRatio: number): string {
  const stiffnessNorm = clamp((tension - 140) / 220, 0, 1)

  if (dampingRatio >= 1) {
    return formatBezier(0.16, 1, 0.3, 1)
  }

  const overshoot = clamp((1 - dampingRatio) * 0.38, 0, 0.36)
  const x1 = 0.16 + stiffnessNorm * 0.08
  const y1 = 1 + overshoot
  const x2 = 0.3 + stiffnessNorm * 0.14
  return formatBezier(x1, y1, x2, 1)
}

export type SpringInput = SpringPresetName | Partial<SpringConfig> | undefined

export function resolveSpringPhysics(spring?: SpringInput): ResolvedSpringConfig {
  let merged: SpringConfig = DEFAULT_SPRING

  if (typeof spring === "string" && isSpringPreset(spring)) {
    merged = springPresets[spring]
  } else if (spring && typeof spring === "object") {
    merged = { ...DEFAULT_SPRING, ...spring }
  }

  const tension = clamp(merged.tension, 20, 800)
  const friction = clamp(merged.friction, 1, 200)
  const mass = clamp(merged.mass, 0.1, 20)
  const velocity = clamp(merged.velocity, -100, 100)
  const precision = clamp(merged.precision, 0.0001, 0.1)

  const angularFrequency = Math.sqrt(tension / mass)
  const dampingRatio = friction / (2 * Math.sqrt(tension * mass))

  const minDuration = 120
  const maxDuration = 1200
  const target = Math.max(precision, 0.0001)
  const normalizedTarget = clamp(target, 0.0001, 0.1)
  const settleScalar = Math.log(1 / normalizedTarget)

  const rawSeconds =
    dampingRatio > 0
      ? settleScalar / (Math.max(dampingRatio, 0.05) * Math.max(angularFrequency, 0.01))
      : 1

  const velocityNudge = 1 + Math.min(Math.abs(velocity) / 240, 0.2)
  const settlingDurationMs = clamp(rawSeconds * 1000 * velocityNudge, minDuration, maxDuration)
  const cssEasing = resolveSpringEasing(tension, dampingRatio)

  return {
    tension,
    friction,
    mass,
    velocity,
    precision,
    dampingRatio,
    angularFrequency,
    settlingDurationMs,
    cssEasing
  }
}

export function createSpringPreset(config: {
  from: Record<string, number | string>
  to: Record<string, number | string>
  spring?: SpringInput
}): MotionPreset {
  const resolved = resolveSpringPhysics(config.spring)
  return {
    from: config.from,
    to: config.to,
    duration: `${Math.round(resolved.settlingDurationMs)}ms`,
    easing: resolved.cssEasing,
    spring: resolved
  }
}

export const motionPresets: Record<MotionPresetName, MotionPreset> = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: "var(--motion-normal)",
    easing: "var(--easing-standard)"
  },
  slideUp: {
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    duration: "var(--motion-normal)",
    easing: "var(--easing-standard)"
  },
  glassHover: {
    from: { transform: "translateY(0)", filter: "saturate(1)" },
    to: { transform: "translateY(-2px)", filter: "saturate(1.08)" },
    duration: "var(--motion-fast)",
    easing: "var(--easing-standard)"
  },
  spotlightPulse: {
    from: { opacity: 0.7, transform: "scale(0.98)" },
    to: { opacity: 1, transform: "scale(1)" },
    duration: "var(--motion-slow)",
    easing: "var(--easing-spring)"
  },
  springSmooth: createSpringPreset({
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    spring: "smooth"
  }),
  springSnappy: createSpringPreset({
    from: { opacity: 0, transform: "translateY(10px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    spring: "snappy"
  })
}

export function resolveMotionPreset(
  name: MotionPresetName,
  opts?: { reducedMotion?: boolean }
): MotionPreset {
  const preset = motionPresets[name]

  if (opts?.reducedMotion) {
    return {
      ...preset,
      duration: "1ms",
      easing: "linear"
    }
  }

  return preset
}
