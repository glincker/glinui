#!/usr/bin/env node
/**
 * Codemod: Tailwind 3 parses `shadow-[var(--x)]` as a shadow COLOR (it sets
 * `--tw-shadow-color`), so the shadow never renders. Rewrite to the arbitrary
 * property form `[box-shadow:var(--x)]`, keeping variant prefixes and `!`.
 *
 * Also repairs `ring-[var(--ring)]` (`--ring` is a gradient image token, not a color).
 *
 * Usage: node scripts/fix-ambiguous-shadows.mjs [--write] [--dir <path>]...
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(here, "../../..")
const EXT = /\.(tsx?|mdx?|css|json)$/
const SKIP_DIRS = new Set(["node_modules", ".next", "dist", ".turbo", "coverage"])

/** Files owned by another workstream; reported, never rewritten. */
const EXCLUDED = []

const SHADOW_OPEN = /(?<![\w-])shadow-\[/g
const RING_GRADIENT = /(?<![\w-])ring-\[var\(--ring\)\]/g

/** True when any top-level comma item of a shadow list is a bare `var(...)` (Tailwind reads it as a color). */
export function hasBareVarItem(body) {
  let depth = 0
  let start = 0
  const items = []
  for (let i = 0; i <= body.length; i++) {
    const ch = body[i]
    if (ch === "(" || ch === "[") depth++
    else if (ch === ")" || ch === "]") depth--
    else if ((ch === "," && depth === 0) || i === body.length) {
      items.push(body.slice(start, i))
      start = i + 1
    }
  }
  return items.some((item) => /^var\(/.test(item.trim()))
}

export function fixSource(text) {
  let shadows = 0
  let rings = 0
  let out = ""
  let last = 0
  for (const m of text.matchAll(SHADOW_OPEN)) {
    const open = m.index + m[0].length
    let depth = 1
    let i = open
    while (i < text.length && depth > 0) {
      if (text[i] === "[") depth++
      else if (text[i] === "]") depth--
      i++
    }
    const body = text.slice(open, i - 1)
    if (/\s/.test(body) || !hasBareVarItem(body)) continue
    out += text.slice(last, m.index) + "[box-shadow:"
    last = open
    shadows++
  }
  out += text.slice(last)
  out = out.replace(RING_GRADIENT, () => {
    rings++
    return "ring-[var(--line-soft)]"
  })
  return { out, shadows, rings }
}

function walk(dir, acc = []) {
  if (!existsSync(dir)) return acc
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (EXT.test(name)) acc.push(full)
  }
  return acc
}

function main() {
  const args = process.argv.slice(2)
  const write = args.includes("--write")
  const dirs = []
  for (let i = 0; i < args.length; i++) if (args[i] === "--dir") dirs.push(path.resolve(args[++i]))
  if (dirs.length === 0) dirs.push(path.join(repoRoot, "packages/ui"), path.join(repoRoot, "apps/docs/src"))
  const totals = {}
  const skipped = []
  for (const file of dirs.flatMap((d) => walk(d))) {
    const rel = path.relative(repoRoot, file)
    const text = readFileSync(file, "utf8")
    const { out, shadows, rings } = fixSource(text)
    if (!shadows && !rings) continue
    if (EXCLUDED.some((e) => rel.startsWith(e))) {
      skipped.push(`${rel} (shadow ${shadows}, ring ${rings})`)
      continue
    }
    console.log(`${rel}: shadow ${shadows}, ring ${rings}`)
    const pkg = rel.split("/").slice(0, 2).join("/")
    totals[pkg] = (totals[pkg] ?? 0) + shadows + rings
    if (write) writeFileSync(file, out)
  }
  console.log(write ? "written" : "dry run", JSON.stringify(totals))
  if (skipped.length) console.log("excluded (not modified):\n  " + skipped.join("\n  "))
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
