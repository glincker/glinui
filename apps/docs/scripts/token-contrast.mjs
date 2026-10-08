import { BASES, ACCENT } from "../../../packages/tokens/scripts/bases.mjs"
import { parseOklch, contrastRatio } from "../src/lib/oklch.ts"

/** [foreground token, background token, minimum ratio] */
const PAIRS = [
  ["--color-foreground", "--color-background", 4.5],
  ["--color-foreground", "--color-surface", 4.5],
  ["--color-foreground", "--surface-2", 4.5],
  ["--color-foreground", "--surface-3", 4.5],
  ["--color-foreground", "--surface-well", 4.5],
  ["--color-muted", "--color-background", 4.5],
  ["--color-muted", "--color-surface", 4.5],
  ["--color-muted", "--surface-2", 4.5],
  ["--color-muted", "--surface-3", 4.5],
  ["--color-muted", "--surface-well", 4.5],
  ["--neutral-solid-fg", "--neutral-solid", 4.5],
  ["--neutral-solid-fg", "--neutral-solid-hover", 4.5],
  ["--color-subtle", "--color-surface", 2.5]
]

/** Contrast failures and the full report across every base and theme. */
export function contrastReport() {
  const rows = []
  for (const base of BASES) {
    for (const theme of ["light", "dark"]) {
      const tokens = base[theme]
      for (const [fg, bg, min] of PAIRS) {
        const a = parseOklch(tokens[fg])
        const b = parseOklch(tokens[bg])
        if (!a || !b) continue
        const ratio = contrastRatio(a, b)
        rows.push({ base: base.id, theme, fg, bg, min, ratio, pass: ratio >= min })
      }
    }
  }
  for (const theme of ["light", "dark"]) {
    const ratio = contrastRatio(parseOklch(ACCENT[theme].fg), parseOklch(ACCENT[theme].accent))
    rows.push({ base: "(all)", theme, fg: "--color-accent-foreground", bg: "--color-accent", min: 4.5, ratio, pass: ratio >= 4.5 })
  }
  return rows
}
