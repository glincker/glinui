import type { IconProps } from "@phosphor-icons/react"

export const GLIN_MOTIONS = ["system", "full", "subtle", "none"] as const
export const GLIN_ENGINES = ["css", "motion", "gsap"] as const
export const GLIN_SURFACES = ["solid", "glass"] as const
export const GLIN_STYLES = ["glinr", "minimal", "glass"] as const
export const GLIN_ACCENTS = ["violet", "blue", "emerald", "amber", "rose", "neutral"] as const
export const GLIN_BASES = ["obsidian", "neutral", "zinc", "slate", "stone", "gray"] as const
export const GLIN_RADII = ["sharp", "default", "round"] as const
export const GLIN_ICON_WEIGHTS = ["thin", "light", "regular", "bold", "fill", "duotone"] as const
export const GLIN_ICON_SIZES = ["sm", "md", "lg"] as const

export type GlinMotion = (typeof GLIN_MOTIONS)[number]
export type GlinEngine = (typeof GLIN_ENGINES)[number]
export type GlinSurface = (typeof GLIN_SURFACES)[number]
export type GlinStyle = (typeof GLIN_STYLES)[number]
export type GlinAccent = (typeof GLIN_ACCENTS)[number]
export type GlinBase = (typeof GLIN_BASES)[number]
export type GlinRadius = (typeof GLIN_RADII)[number]
export type GlinIconWeight = (typeof GLIN_ICON_WEIGHTS)[number]
export type GlinIconSize = (typeof GLIN_ICON_SIZES)[number]

export type GlinConfig = {
  motion: GlinMotion
  engine: GlinEngine
  /** @deprecated alias of `style`: solid maps to minimal, glass maps to glass. */
  surface: GlinSurface
  /** Design style preset: picks the default variant of components with no `variant` prop. */
  style: GlinStyle
  accent: GlinAccent
  /** Base color (neutral scale): obsidian is the default theauth tonal scale. */
  base: GlinBase
  radius: GlinRadius
  iconWeight: GlinIconWeight
  iconSize: GlinIconSize
}

export type GlinTarget = "self" | "document"

export const DEFAULT_GLIN_CONFIG: GlinConfig = {
  motion: "system",
  engine: "css",
  surface: "solid",
  style: "glinr",
  accent: "violet",
  base: "obsidian",
  radius: "default",
  iconWeight: "regular",
  iconSize: "md"
}

/** Pixel size per icon size step. */
export const GLIN_ICON_PX: Record<GlinIconSize, number> = { sm: 16, md: 20, lg: 24 }

/** Shape of the value handed to Phosphor's IconContext. */
export type PhosphorIconDefaults = Pick<IconProps, "weight" | "size">

/** Attribute name per config key. */
export const GLIN_ATTRIBUTES: Record<keyof GlinConfig, string> = {
  motion: "data-glin-motion",
  engine: "data-glin-engine",
  surface: "data-glin-surface",
  style: "data-glin-style",
  accent: "data-glin-accent",
  base: "data-glin-base",
  radius: "data-glin-radius",
  iconWeight: "data-glin-icon-weight",
  iconSize: "data-glin-icon-size"
}

const OPTIONS: { [K in keyof GlinConfig]: readonly GlinConfig[K][] } = {
  motion: GLIN_MOTIONS,
  engine: GLIN_ENGINES,
  surface: GLIN_SURFACES,
  style: GLIN_STYLES,
  accent: GLIN_ACCENTS,
  base: GLIN_BASES,
  radius: GLIN_RADII,
  iconWeight: GLIN_ICON_WEIGHTS,
  iconSize: GLIN_ICON_SIZES
}

export const CONFIG_KEYS = Object.keys(OPTIONS) as Array<keyof GlinConfig>

/** Keep only known keys with valid values. Safe for untrusted storage input. */
export function sanitizeGlinConfig(input: unknown): Partial<GlinConfig> {
  const out: Partial<GlinConfig> = {}
  if (typeof input !== "object" || input === null) return out
  const record = input as Record<string, unknown>
  for (const key of CONFIG_KEYS) {
    const value = record[key]
    if (typeof value === "string" && (OPTIONS[key] as readonly string[]).includes(value)) {
      ;(out as Record<string, string>)[key] = value
    }
  }
  return out
}

/**
 * Backwards compatible alias: when `surface` is given without `style`,
 * solid maps to the minimal style and glass maps to the glass style.
 */
export function applySurfaceAlias(patch: Partial<GlinConfig>): Partial<GlinConfig> {
  if (patch.surface && !patch.style) return { ...patch, style: patch.surface === "glass" ? "glass" : "minimal" }
  return patch
}

/** Phosphor IconContext value for a config. */
export function getPhosphorDefaults(config: Pick<GlinConfig, "iconWeight" | "iconSize">): PhosphorIconDefaults {
  return { weight: config.iconWeight, size: GLIN_ICON_PX[config.iconSize] }
}

/**
 * Returns a tiny inline script string that applies the persisted config to
 * document.documentElement before first paint. Render it in <head> in a
 * <script dangerouslySetInnerHTML> to avoid a flash of default styles.
 */
export function getGlinConfigScript(storageKey: string): string {
  const attrs = JSON.stringify(GLIN_ATTRIBUTES)
  const options = JSON.stringify(OPTIONS)
  const key = JSON.stringify(storageKey)
  return `(function(){try{var s=localStorage.getItem(${key});if(!s)return;var c=JSON.parse(s),a=${attrs},o=${options},r=document.documentElement;for(var k in a){if(typeof c[k]==="string"&&o[k].indexOf(c[k])>-1){r.setAttribute(a[k],c[k])}}}catch(e){}})()`
}

