import { resolveSpringPhysics } from "../core"
import type {
  EngineCountOptions,
  EngineEasing,
  EngineFrame,
  EngineRevealOptions,
  EngineTiming
} from "../engine-types"

export const DEFAULT_DURATION_MS = 520
export const DEFAULT_THRESHOLD = 0.15
export const DEFAULT_ROOT_MARGIN = "0px"

const BEZIERS: Record<string, readonly [number, number, number, number]> = {
  out: [0.16, 1, 0.3, 1],
  standard: [0.2, 0, 0, 1],
  "in-out": [0.65, 0, 0.35, 1],
  linear: [0, 0, 1, 1]
}

export const FINAL_FRAME: EngineFrame = { opacity: 1, x: 0, y: 0, scale: 1, blur: 0 }

/** Solve a cubic bezier easing y(x). Newton with a bisection fallback. */
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): (progress: number) => number {
  const cx = 3 * x1
  const bx = 3 * (x2 - x1) - cx
  const ax = 1 - cx - bx
  const cy = 3 * y1
  const by = 3 * (y2 - y1) - cy
  const ay = 1 - cy - by
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x: number) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) {
      const err = sampleX(t) - x
      if (Math.abs(err) < 1e-5) return sampleY(t)
      const slope = slopeX(t)
      if (Math.abs(slope) < 1e-6) break
      t -= err / slope
    }
    let lo = 0
    let hi = 1
    t = x
    while (lo < hi) {
      const val = sampleX(t)
      if (Math.abs(val - x) < 1e-5) break
      if (x > val) lo = t
      else hi = t
      t = (hi - lo) / 2 + lo
      if (hi - lo < 1e-6) break
    }
    return sampleY(t)
  }
}

/** Analytic step response of a damped spring, normalised to settle at progress 1. */
export function springEase(
  stiffness: number,
  damping: number,
  mass: number,
  durationMs: number
): (progress: number) => number {
  const omega = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  return (p: number) => {
    if (p <= 0) return 0
    if (p >= 1) return 1
    const t = (p * durationMs) / 1000
    if (zeta < 1) {
      const wd = omega * Math.sqrt(1 - zeta * zeta)
      return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t))
    }
    if (zeta === 1) return 1 - Math.exp(-omega * t) * (1 + omega * t)
    const wd = omega * Math.sqrt(zeta * zeta - 1)
    return 1 - Math.exp(-zeta * omega * t) * (Math.cosh(wd * t) + ((zeta * omega) / wd) * Math.sinh(wd * t))
  }
}

type TimingInput = Pick<EngineRevealOptions, "duration" | "delay" | "easing" | "spring">

export function resolveTiming(opts: TimingInput | EngineCountOptions): EngineTiming {
  const delayMs = Math.max(0, opts.delay ?? 0)
  const easing: EngineEasing | undefined = opts.easing
  const useSpring = opts.spring !== undefined || easing === "spring"

  if (useSpring) {
    const resolved = resolveSpringPhysics(opts.spring ?? "smooth")
    const durationMs = opts.duration ?? resolved.settlingDurationMs
    const spring = { stiffness: resolved.tension, damping: resolved.friction, mass: resolved.mass }
    return {
      durationMs,
      delayMs,
      cssEasing: resolved.cssEasing,
      spring,
      ease: springEase(spring.stiffness, spring.damping, spring.mass, durationMs)
    }
  }

  const bezier = Array.isArray(easing) ? (easing as readonly [number, number, number, number]) : BEZIERS[(easing as string) ?? "out"] ?? BEZIERS.out
  return {
    durationMs: Math.max(0, opts.duration ?? DEFAULT_DURATION_MS),
    delayMs,
    cssEasing: `cubic-bezier(${bezier.join(", ")})`,
    bezier,
    ease: cubicBezier(bezier[0], bezier[1], bezier[2], bezier[3])
  }
}

const DIRECTION_SIGN: Record<string, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 }
}

/** Compute the starting frame for a reveal. The final frame is always `FINAL_FRAME`. */
export function resolveFromFrame(opts: EngineRevealOptions): EngineFrame {
  const preset = opts.preset
  let distance = 12
  let scale = 1
  let opacity = 0
  let direction = opts.direction ?? "up"

  if (preset === "fadeIn") distance = 0
  else if (preset === "slideUp") distance = 10
  else if (preset === "springSmooth") distance = 8
  else if (preset === "springSnappy") distance = 10
  else if (preset === "spotlightPulse") {
    distance = 0
    scale = 0.98
    opacity = 0.7
  } else if (preset === "glassHover") {
    distance = 0
    opacity = 1
  }

  distance = opts.distance ?? distance
  scale = opts.scale ?? scale
  if (distance === 0) direction = "none"
  const sign = DIRECTION_SIGN[direction] ?? DIRECTION_SIGN.none
  return { opacity, x: sign.x * distance, y: sign.y * distance, scale, blur: Math.max(0, opts.blur ?? 0) }
}

export function frameTransform(f: EngineFrame): string {
  if (f.x === 0 && f.y === 0 && f.scale === 1) return "none"
  return `translate3d(${f.x}px, ${f.y}px, 0) scale(${f.scale})`
}

export function frameFilter(f: EngineFrame): string {
  return f.blur > 0 ? `blur(${f.blur}px)` : "none"
}

export function isMoving(from: EngineFrame): boolean {
  return from.x !== 0 || from.y !== 0 || from.scale !== 1
}

/** Apply a frame as inline styles. Allowed here: adapters animate DOM nodes directly. */
export function applyFrame(el: HTMLElement, f: EngineFrame): void {
  el.style.opacity = String(f.opacity)
  if (isMoving(f)) el.style.transform = frameTransform(f)
  else el.style.removeProperty("transform")
  if (f.blur > 0) el.style.filter = frameFilter(f)
  else el.style.removeProperty("filter")
}

/** Remove everything an adapter wrote so the element returns to its authored styles. */
export function clearFrame(el: HTMLElement): void {
  el.style.removeProperty("opacity")
  el.style.removeProperty("transform")
  el.style.removeProperty("filter")
  el.style.removeProperty("will-change")
}

export function defaultDecimals(to: number): number {
  const text = String(to)
  const dot = text.indexOf(".")
  return dot === -1 ? 0 : Math.min(4, text.length - dot - 1)
}

export function createFormatter(to: number, opts: EngineCountOptions): (value: number) => string {
  if (opts.format) return opts.format
  const decimals = opts.decimals ?? defaultDecimals(to)
  let formatter: Intl.NumberFormat | undefined
  try {
    formatter = new Intl.NumberFormat(opts.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  } catch {
    formatter = undefined
  }
  return (value) => (formatter ? formatter.format(value) : value.toFixed(decimals))
}

export const PART_ATTR = "data-glin-part"

/**
 * Return the animatable parts of a split-text element. Uses existing
 * `[data-glin-part]` descendants (rendered by React) or, when none exist,
 * splits the text content into inline-block spans and returns a restore function.
 */
export function collectParts(
  el: HTMLElement,
  by: "words" | "chars"
): { parts: HTMLElement[]; restore: () => void } {
  const existing = Array.from(el.querySelectorAll<HTMLElement>(`[${PART_ATTR}="${by}"]`))
  if (existing.length > 0) return { parts: existing, restore: () => undefined }

  const original = el.textContent ?? ""
  const doc = el.ownerDocument
  const frag = doc.createDocumentFragment()
  const parts: HTMLElement[] = []
  const words = original.split(/(\s+)/)
  for (const token of words) {
    if (token === "") continue
    if (/^\s+$/.test(token)) {
      frag.appendChild(doc.createTextNode(token))
      continue
    }
    const wordEl = doc.createElement("span")
    wordEl.setAttribute("aria-hidden", "true")
    wordEl.style.display = "inline-block"
    if (by === "words") {
      wordEl.setAttribute(PART_ATTR, "words")
      wordEl.textContent = token
      parts.push(wordEl)
    } else {
      wordEl.style.whiteSpace = "nowrap"
      for (const ch of Array.from(token)) {
        const charEl = doc.createElement("span")
        charEl.setAttribute(PART_ATTR, "chars")
        charEl.style.display = "inline-block"
        charEl.textContent = ch
        wordEl.appendChild(charEl)
        parts.push(charEl)
      }
    }
    frag.appendChild(wordEl)
  }
  const hadLabel = el.hasAttribute("aria-label")
  if (!hadLabel) el.setAttribute("aria-label", original)
  el.replaceChildren(frag)
  return {
    parts,
    restore: () => {
      el.textContent = original
      if (!hadLabel) el.removeAttribute("aria-label")
    }
  }
}

export function canObserve(): boolean {
  return typeof IntersectionObserver !== "undefined"
}
