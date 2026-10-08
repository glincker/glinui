import { readFileSync } from "node:fs"
import { join } from "node:path"

const TOKENS = join(import.meta.dirname, "../../../packages/tokens")

/** Parse top-level rules of a css file into [{ selector, decls: Map }] (no nesting beyond @media). */
export function parseDecls(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "")
  const rules = []
  const re = /([^{}]+)\{([^{}]*)\}/g
  for (const m of clean.matchAll(re)) {
    const decls = new Map()
    for (const d of m[2].split(/;(?![^(]*\))/)) {
      const i = d.indexOf(":")
      if (i < 0) continue
      const name = d.slice(0, i).trim()
      if (name.startsWith("--")) decls.set(name, d.slice(i + 1).trim().replace(/\s+/g, " "))
    }
    rules.push({ selector: m[1].trim().replace(/\s+/g, " "), decls })
  }
  return rules
}

export function readThemeBlocks() {
  const rules = parseDecls(readFileSync(join(TOKENS, "theme.css"), "utf8"))
  const light = rules.find((r) => r.selector.startsWith(":root, .light, [data-glin-theme=\"light\"]") && r.decls.has("--color-background"))
  const dark = rules.find((r) => r.selector.startsWith(".dark, [data-glin-theme=\"dark\"]") && r.decls.has("--color-background"))
  return { light: light?.decls ?? new Map(), dark: dark?.decls ?? new Map(), all: rules }
}

const COLOR_VALUE = /oklch\(|#[0-9a-f]{3,8}\b|rgba?\(|linear-gradient|inset /i
export const isColorToken = (name, value) => /^--(color|tone|key|glow|ring|floor|surface|neutral|hl|highlight|sheen|hairline|line|drop|elev|signal)/.test(name) || COLOR_VALUE.test(value)

/** Light color tokens that differ-by-design but have no dark value, and are not allowlisted. */
export const SHARED_LIGHT_ONLY = new Set([
  "--glass-blur-sm", "--glass-blur-md", "--glass-blur-lg", "--glass-blur-xl",
  "--shadow-glass-sm", "--shadow-glass-md", "--shadow-glass-lg", "--shadow-glass-inset", // same in both themes
  "--ring-violet" // brand ring: light uses accent mix, dark has its own, kept for completeness
])

export function parityGaps() {
  const { light, dark } = readThemeBlocks()
  const gaps = []
  for (const [name, value] of light) {
    if (dark.has(name) || SHARED_LIGHT_ONLY.has(name)) continue
    if (!isColorToken(name, value)) continue
    gaps.push(`${name}: ${value}`)
  }
  return gaps
}

export function typedExportGaps() {
  const index = readFileSync(join(TOKENS, "src/index.ts"), "utf8").replace(/\s+/g, " ")
  const { light, dark } = readThemeBlocks()
  const gaps = []
  for (const [theme, map] of [["light", light], ["dark", dark]]) {
    for (const [name, value] of map) {
      if (INTERNAL.has(name) || value.startsWith("var(")) continue
      if (!isColorToken(name, value) && !PUBLIC_NONCOLOR.test(name)) continue
      if (!index.includes(value)) gaps.push(`${theme} ${name}: ${value}`)
    }
  }
  return gaps
}

const PUBLIC_NONCOLOR = /^--(radius|space|shadow|motion|easing|ease|font|text|layout|glass)-/
/** Not part of the typed contract: runtime plumbing, derived helpers, tone/solid internals. */
export const INTERNAL = new Set([
  "--sheen", "--hairline", "--line-soft", "--ring-brand", "--ring-brand-hot", /* edge or accent derived */ "--glass-gpu-transform", "--glass-gpu-backface-visibility", "--glass-gpu-will-change", "--glass-heavy-will-change", "--glass-heavy-contain",
  "--glass-adapt-surface-multiplier", "--glass-adapt-border-multiplier", "--glass-adapt-refraction-multiplier", "--glass-adapt-saturate-multiplier",
  "--glass-base-rgb", "--glass-saturate-base", "--glass-saturate-subtle-base", "--glass-surface-alpha", "--glass-floor", "--glass-border-alpha",
  "--glass-border-strong-alpha", "--glass-refraction-top-alpha", "--edge-rgb", "--ring-top", "--ring-mid", "--ring-bottom"
])
