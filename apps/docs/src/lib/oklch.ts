/** Pure OKLCH helpers: parsing, sRGB conversion, WCAG contrast, and tonal ramps. */

export type Oklch = { l: number; c: number; h: number }
export type Rgb = { r: number; g: number; b: number }

const OKLCH_PATTERN = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\s*\)/i

export function parseOklch(value: string): Oklch | null {
  const match = OKLCH_PATTERN.exec(value.trim())
  if (!match) return null
  const rawL = match[1] ?? ""
  const l = rawL.endsWith("%") ? Number.parseFloat(rawL) / 100 : Number.parseFloat(rawL)
  const c = Number.parseFloat(match[2] ?? "")
  const h = Number.parseFloat(match[3] ?? "")
  if ([l, c, h].some((n) => Number.isNaN(n))) return null
  return { l, c, h }
}

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${round(l, 3)} ${round(c, 3)} ${round(h, 1)})`
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function gamma(linear: number): number {
  const v = Math.min(1, Math.max(0, linear))
  return v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
}

type LinearRgb = { r: number; g: number; b: number }

function oklchToLinear({ l, c, h }: Oklch): LinearRgb {
  const rad = (h * Math.PI) / 180
  const a = c * Math.cos(rad)
  const b = c * Math.sin(rad)
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return {
    r: 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    g: -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    b: -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_
  }
}

export function inGamut(color: Oklch): boolean {
  const { r, g, b } = oklchToLinear(color)
  const eps = 0.0005
  return [r, g, b].every((v) => v >= -eps && v <= 1 + eps)
}

export function oklchToRgb(color: Oklch): Rgb {
  const { r, g, b } = oklchToLinear(color)
  return { r: gamma(r), g: gamma(g), b: gamma(b) }
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const part = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0")
  return `#${part(r)}${part(g)}${part(b)}`
}

export function oklchToHex(color: Oklch): string {
  return rgbToHex(oklchToRgb(color))
}

function channelLuminance(v: number): number {
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

export function relativeLuminance(color: Oklch): number {
  const { r, g, b } = oklchToRgb(color)
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
}

export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

export type ContrastGrade = { ratio: number; aa: boolean; aaa: boolean; aaLarge: boolean }

export function gradeContrast(ratio: number): ContrastGrade {
  return { ratio, aa: ratio >= 4.5, aaa: ratio >= 7, aaLarge: ratio >= 3 }
}

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
export type RampStep = (typeof RAMP_STEPS)[number]

const RAMP_LIGHTNESS = [0.975, 0.95, 0.9, 0.83, 0.74, 0.64, 0.55, 0.47, 0.39, 0.31, 0.23]
const RAMP_CHROMA = [0.08, 0.16, 0.34, 0.58, 0.82, 0.96, 1, 0.92, 0.78, 0.62, 0.46]

export type RampStop = { step: RampStep; color: Oklch; css: string; hex: string }

/** Fit chroma into sRGB by shrinking it, keeping lightness and hue fixed. */
function fitToGamut(color: Oklch): Oklch {
  let candidate = color
  for (let i = 0; i < 24 && !inGamut(candidate); i += 1) {
    candidate = { ...candidate, c: candidate.c * 0.94 }
  }
  return candidate
}

/** Build a 50 to 950 ramp. Hue is held constant, lightness follows a fixed curve, chroma is scaled then gamut fitted. */
export function tonalRamp(base: Oklch): RampStop[] {
  return RAMP_STEPS.map((step, index) => {
    const color = fitToGamut({
      l: RAMP_LIGHTNESS[index] ?? base.l,
      c: base.c * (RAMP_CHROMA[index] ?? 1),
      h: base.h
    })
    return { step, color, css: formatOklch(color), hex: oklchToHex(color) }
  })
}
