import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const REPO = join(import.meta.dirname, "../../..")
const SKIP_DIRS = new Set(["node_modules", ".next", ".next-build", "dist", ".git", "coverage", ".turbo"])
const SCAN_EXT = /\.(tsx?|css|mdx|cjs|mjs)$/
const ROOTS = ["packages/ui/src", "apps/docs/src", "packages/tokens"]

/** Framework or documented vars that are set by third parties at runtime. */
export const ALLOW_PREFIXES = ["--radix-", "--tw-", "--next-", "--swipe-", "--font-inter", "--font-jetbrains"]
export const ALLOW_NAMES = new Set([])

function walk(dir, out) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else if (SCAN_EXT.test(name)) out.push(full)
  }
  return out
}

export function scanFiles() {
  return ROOTS.flatMap((root) => walk(join(REPO, root), [])).filter((f) => !/\.d\.ts$/.test(f))
}

const REF = /var\(\s*(--[A-Za-z0-9_-]+)(?![A-Za-z0-9_$-])\s*([,)])/g
const DEFS = [
  /(--[A-Za-z][A-Za-z0-9_-]*)\s*:/g, // css declarations, tailwind [--x:v], quoted object keys
  /setProperty\(\s*["'`](--[A-Za-z0-9_-]+)/g,
  /@property\s+(--[A-Za-z0-9_-]+)/g,
  /["'`](--[A-Za-z][A-Za-z0-9_-]*)["'`]\s*[:\]]/g
]

/** Returns { definitions: Map<name, file>, references: Array<{name, file, line, fallback}> } */
export function collect() {
  const definitions = new Map()
  const references = []
  for (const file of scanFiles()) {
    const text = readFileSync(file, "utf8")
    const rel = relative(REPO, file)
    for (const re of DEFS) {
      for (const m of text.matchAll(re)) {
        if (!definitions.has(m[1])) definitions.set(m[1], rel)
      }
    }
    for (const m of text.matchAll(REF)) {
      if (/var\(\s*--[A-Za-z0-9_-]+\s*,\s*$/.test(text.slice(Math.max(0, m.index - 80), m.index))) continue // nested fallback
      const line = text.slice(0, m.index).split("\n").length
      references.push({ name: m[1], file: rel, line, fallback: m[2] === "," })
    }
  }
  return { definitions, references }
}

function allowed(name) {
  return ALLOW_NAMES.has(name) || ALLOW_PREFIXES.some((p) => name.startsWith(p))
}

/** References with no fallback to a custom property defined nowhere. A missing var silently drops the property. */
export function undefinedVars() {
  const { definitions, references } = collect()
  const bad = new Map()
  for (const ref of references) {
    if (ref.fallback || allowed(ref.name) || definitions.has(ref.name)) continue
    const list = bad.get(ref.name) ?? []
    list.push(`${ref.file}:${ref.line}`)
    bad.set(ref.name, list)
  }
  return { bad, defined: definitions.size, refs: references.length }
}
