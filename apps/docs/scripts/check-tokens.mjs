#!/usr/bin/env node
/**
 * Token health: undefined vars, theme parity, typed export coverage, preset consistency, base contrast.
 * Usage: node scripts/check-tokens.mjs [--report]   (exit 1 on any failure; --report also prints every contrast ratio)
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

import { renderCss, renderTs, BASES } from "../../../packages/tokens/scripts/bases.mjs"
import { contrastReport } from "./token-contrast.mjs"
import { parseDecls, parityGaps, readThemeBlocks, typedExportGaps } from "./token-theme.mjs"
import { collect, undefinedVars } from "./token-vars.mjs"

const TOKENS = join(import.meta.dirname, "../../../packages/tokens")

function presetConsistency() {
  const problems = []
  const defined = new Set(collect().definitions.keys())
  for (const file of ["preferences.css", "bases.css"]) {
    const css = readFileSync(join(TOKENS, file), "utf8")
    for (const rule of parseDecls(css)) {
      for (const [name, value] of rule.decls) {
        for (const m of value.matchAll(/var\(\s*(--[A-Za-z0-9_-]+)/g)) {
          if (!defined.has(m[1])) problems.push(`${file}: ${name} references undefined ${m[1]}`)
        }
      }
    }
  }
  // Every base must override the same tokens in both themes, and each token must exist in theme.css.
  const { light, dark } = readThemeBlocks()
  for (const base of BASES) {
    const lk = Object.keys(base.light)
    const dk = Object.keys(base.dark)
    for (const k of lk) if (!dk.includes(k)) problems.push(`base ${base.id}: ${k} has no dark value`)
    for (const k of dk) if (!lk.includes(k)) problems.push(`base ${base.id}: ${k} has no light value`)
    for (const k of lk) if (!light.has(k) && !dark.has(k)) problems.push(`base ${base.id}: ${k} is not a theme.css token`)
  }
  if (readFileSync(join(TOKENS, "bases.css"), "utf8") !== renderCss()) problems.push("bases.css is stale: run `pnpm --filter @glinui/tokens bases:build`")
  if (readFileSync(join(TOKENS, "src/bases.ts"), "utf8") !== renderTs()) problems.push("src/bases.ts is stale: run `pnpm --filter @glinui/tokens bases:build`")
  return problems
}

/** Run every check. Each section is { title, failures: string[] }. */
export function runChecks() {
  const { bad, defined, refs } = undefinedVars()
  const contrast = contrastReport()
  return {
    stats: { definedVars: defined, varReferences: refs, contrastPairs: contrast.length },
    contrast,
    sections: [
      { title: "Undefined custom properties (silent failures)", failures: [...bad].map(([n, w]) => `${n} (${w.length}): ${w.slice(0, 3).join(", ")}`) },
      { title: "Light color tokens without a dark counterpart", failures: parityGaps() },
      { title: "Public tokens missing from packages/tokens/src/index.ts", failures: typedExportGaps() },
      { title: "Preset consistency", failures: presetConsistency() },
      {
        title: "Contrast below WCAG AA in a base color",
        failures: contrast.filter((r) => !r.pass).map((r) => `${r.base} ${r.theme}: ${r.fg} on ${r.bg} = ${r.ratio.toFixed(2)} (need ${r.min})`)
      }
    ]
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = runChecks()
  let failed = 0
  for (const s of result.sections) {
    console.log(`${s.failures.length === 0 ? "ok  " : "FAIL"} ${s.title}${s.failures.length ? ` (${s.failures.length})` : ""}`)
    for (const f of s.failures) console.log(`       ${f}`)
    failed += s.failures.length
  }
  if (process.argv.includes("--report")) {
    for (const r of result.contrast) console.log(`${r.base.padEnd(9)} ${r.theme.padEnd(5)} ${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)}`)
  }
  console.log(JSON.stringify(result.stats))
  process.exit(failed === 0 ? 0 : 1)
}
