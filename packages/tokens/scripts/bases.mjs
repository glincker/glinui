/**
 * Source of truth for the base color presets (data-glin-base).
 * `node scripts/build-bases.mjs` renders ../bases.css and ../src/bases.ts from this file.
 */

const r = (n, d = 3) => Number(n.toFixed(d))
const ok = (l, c, h) => `oklch(${r(l)} ${r(c, 4)} ${r(h, 1)})`

/** Hue-tinted ladder. `c` is the reference chroma, multipliers shape each step. */
function tinted(h, c, edgeLight) {
  const t = (l, m) => ok(l, c * m, h)
  return {
    light: {
      "--color-background": t(0.985, 0.25),
      "--color-foreground": t(0.21, 0.9),
      "--color-surface": t(0.997, 0.12),
      "--color-border": t(0.89, 0.8),
      "--surface-2": t(0.97, 0.4),
      "--surface-3": t(0.94, 0.7),
      "--surface-well": t(0.955, 0.55),
      "--color-muted": t(0.5, 0.85),
      "--color-subtle": t(0.64, 0.8),
      "--floor-1": t(0.955, 0.4),
      "--floor-2": t(0.97, 0.4),
      "--edge-rgb": edgeLight,
      "--neutral-solid": t(0.19, 0.8),
      "--neutral-solid-fg": t(0.99, 0.2),
      "--neutral-solid-hover": t(0.28, 0.8),
      "--neutral-solid-active": t(0.13, 0.8)
    },
    dark: {
      "--color-background": t(0.16, 0.5),
      "--color-foreground": t(0.96, 0.3),
      "--color-surface": t(0.195, 0.55),
      "--color-border": t(0.32, 1),
      "--surface-2": t(0.24, 0.9),
      "--surface-3": t(0.275, 1),
      "--surface-well": t(0.13, 0.4),
      "--color-muted": t(0.7, 0.8),
      "--color-subtle": t(0.53, 0.8),
      "--floor-1": t(0.1, 0.4),
      "--floor-2": t(0.115, 0.4),
      "--edge-rgb": "255 255 255",
      "--neutral-solid": t(0.96, 0.3),
      "--neutral-solid-fg": t(0.17, 0.5),
      "--neutral-solid-hover": ok(1, 0, 0),
      "--neutral-solid-active": t(0.86, 0.4)
    }
  }
}

const OBSIDIAN = {
  light: {
    "--color-background": "oklch(0.985 0.002 240)",
    "--color-foreground": "oklch(0.23 0.01 248)",
    "--color-surface": "oklch(0.997 0.002 245)",
    "--color-border": "oklch(0.89 0.01 246)",
    "--surface-2": "oklch(0.97 0.003 245)",
    "--surface-3": "oklch(0.94 0.005 246)",
    "--surface-well": "oklch(0.955 0.004 246)",
    "--color-muted": "oklch(0.52 0.014 270)",
    "--color-subtle": "oklch(0.65 0.013 280)",
    "--floor-1": "oklch(0.955 0.003 245)",
    "--floor-2": "oklch(0.97 0.003 245)",
    "--edge-rgb": "0 0 0",
    "--neutral-solid": "oklch(0.168 0.004 264)",
    "--neutral-solid-fg": "oklch(0.99 0.002 240)",
    "--neutral-solid-hover": "oklch(0.26 0.006 264)",
    "--neutral-solid-active": "oklch(0.12 0.004 264)"
  },
  dark: {
    "--color-background": "oklch(0.168 0.004 264.4)",
    "--color-foreground": "oklch(0.95 0.01 247)",
    "--color-surface": "oklch(0.198 0.004 229)",
    "--color-border": "oklch(0.323 0.009 248.1)",
    "--surface-2": "oklch(0.242 0.007 248.1)",
    "--surface-3": "oklch(0.263 0.045 281)",
    "--surface-well": "oklch(0.139 0.003 246.3)",
    "--color-muted": "oklch(0.646 0.013 286)",
    "--color-subtle": "oklch(0.498 0.014 281)",
    "--floor-1": "#050506",
    "--floor-2": "#08090b",
    "--edge-rgb": "255 255 255",
    "--neutral-solid": "oklch(0.96 0.004 247)",
    "--neutral-solid-fg": "oklch(0.168 0.004 264)",
    "--neutral-solid-hover": "oklch(1 0 0)",
    "--neutral-solid-active": "oklch(0.86 0.006 247)"
  }
}

export const BASES = [
  { id: "obsidian", label: "Obsidian", description: "Default theauth tones, cool and tonal.", ...OBSIDIAN },
  { id: "neutral", label: "Neutral", description: "Pure gray, no tint.", ...tinted(0, 0, "0 0 0") },
  { id: "zinc", label: "Zinc", description: "Cool, barely blue gray.", ...tinted(286, 0.012, "24 24 27") },
  { id: "slate", label: "Slate", description: "Cool blue gray.", ...tinted(255, 0.04, "15 23 42") },
  { id: "stone", label: "Stone", description: "Warm gray.", ...tinted(70, 0.016, "28 25 23") },
  { id: "gray", label: "Gray", description: "Neutral blue-leaning gray.", ...tinted(260, 0.02, "17 24 39") }
]

/** Accent pair used for the accent-on-accent contrast check. */
export const ACCENT = {
  light: { accent: "oklch(0.55 0.2 289)", fg: "oklch(0.99 0.003 290)" },
  dark: { accent: "oklch(0.782 0.118 289.4)", fg: "oklch(0.168 0.004 264.4)" }
}

const q = (id) => `"${id}"`
function selectors(id, theme) {
  const b = `[data-glin-base=${q(id)}]`
  if (theme === "light") {
    return [`${b}${b}`, `[data-glin-theme="light"][data-glin-theme="light"]${b}`, `${b} .light`, `${b} [data-glin-theme="light"]`]
  }
  return [
    `.dark ${b}`,
    `.dark${b}${b}`,
    `[data-glin-theme="dark"] ${b}`,
    `[data-glin-theme="dark"]${b}${b}`,
    `${b} .dark`,
    `${b} [data-glin-theme="dark"]`
  ]
}

const DERIVED = `[data-glin-base][data-glin-base] {
  --surface-0: var(--color-background);
  --surface-1: var(--color-surface);
  --face-0: var(--surface-0);
  --face-1: var(--surface-1);
  --face-2: var(--surface-2);
  --well: var(--surface-well);
  --ring: linear-gradient(180deg, rgb(var(--edge-rgb) / var(--ring-top)), rgb(var(--edge-rgb) / var(--ring-mid)) 40%, rgb(var(--edge-rgb) / var(--ring-bottom)));
  --line-soft: rgb(var(--edge-rgb) / 0.07);
  --hairline: linear-gradient(90deg, transparent, rgb(var(--edge-rgb) / 0.12) 50%, transparent);
  --elev-1: var(--highlight), var(--drop-1);
  --elev-2: var(--highlight), var(--drop-2);
  --elev-3: var(--highlight), var(--drop-3);
  --solid-elev-1: var(--solid-hl), var(--drop-1);
  --solid-elev-2: var(--solid-hl), var(--drop-2);
  --solid-elev-3: var(--solid-hl), var(--drop-3);
  --glass-readable: color-mix(in oklab, var(--surface-1) min(100%, calc(var(--glass-floor) * 100% * var(--glass-adapt-surface-multiplier))), transparent);
  --tone-accent-text: color-mix(in oklab, var(--color-accent) 82%, var(--color-foreground));
  --void: var(--floor-1);
  --obsidian: var(--face-0);
  --carbon: var(--face-1);
  --graphite: var(--face-2);
  --slate: var(--surface-3);
  --ash: var(--color-border);
  --steel: color-mix(in oklab, var(--color-border) 82%, var(--color-foreground));
  --fog: var(--color-subtle);
  --smoke: var(--color-muted);
  --cloud: color-mix(in oklab, var(--color-muted) 75%, var(--color-foreground));
  --silver: color-mix(in oklab, var(--color-foreground) 85%, var(--color-background));
  --white: var(--color-foreground);
}
`

export function renderCss() {
  const out = [
    "/*",
    " * GENERATED by scripts/build-bases.mjs from scripts/bases.mjs. Do not edit by hand.",
    " * Base color presets: <html data-glin-base=\"zinc\"> or any element (scoped), light and dark.",
    " * Doubled attributes beat the unlayered theme.css. Derived tokens are re-declared at the end.",
    " */",
    ""
  ]
  for (const base of BASES) {
    for (const theme of ["light", "dark"]) {
      out.push(`/* ${base.id} ${theme} */`)
      out.push(`${selectors(base.id, theme).join(",\n")} {`)
      for (const [k, v] of Object.entries(base[theme])) out.push(`  ${k}: ${v};`)
      out.push("}", "")
    }
  }
  out.push("/* Derived tokens re-resolve on every base element */", DERIVED)
  return out.join("\n")
}

export function renderTs() {
  const rows = BASES.map((b) => {
    const pick = (t) =>
      `{ background: ${JSON.stringify(b[t]["--color-background"])}, surface: ${JSON.stringify(b[t]["--color-surface"])}, foreground: ${JSON.stringify(b[t]["--color-foreground"])}, border: ${JSON.stringify(b[t]["--color-border"])}, muted: ${JSON.stringify(b[t]["--color-muted"])}, solid: ${JSON.stringify(b[t]["--neutral-solid"])} }`
    return `  { id: ${JSON.stringify(b.id)}, label: ${JSON.stringify(b.label)}, description: ${JSON.stringify(b.description)}, light: ${pick("light")}, dark: ${pick("dark")} }`
  })
  return `/* GENERATED by scripts/build-bases.mjs. Do not edit by hand. */

export type BaseColorId = "obsidian" | "neutral" | "zinc" | "slate" | "stone" | "gray"

export type BaseSwatch = {
  background: string
  surface: string
  foreground: string
  border: string
  muted: string
  /** Neutral solid fill (default solid button). */
  solid: string
}

export type BaseColor = { id: BaseColorId; label: string; description: string; light: BaseSwatch; dark: BaseSwatch }

/** Values for \`data-glin-base\`. Obsidian is the default and matches theme.css. */
export const baseColors: readonly BaseColor[] = [
${rows.join(",\n")}
]
`
}
