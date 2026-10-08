#!/usr/bin/env node
// Generates src/lib/new-components/showcase-s2-code.generated.ts: the copyable code strings for the S2
// showcase demos (navigation and overlays) from the demo sources, so the code shown matches the render.
// Stage* overlay wrappers become the plain components. Run: node scripts/gen-showcase-s2-code.mjs
// Pass --check to compare against the committed file without writing (exit 1 when stale).
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sources = ["src/components/demos/nav-demos.tsx", "src/components/demos/overlay-showcase-demos.tsx", "src/components/demos/s2-signature-heroes.tsx"]
const outFile = path.join(root, "src/lib/new-components/showcase-s2-code.generated.ts")
const MODULE_ORDER = (mod) => (mod === "react" ? 0 : mod.startsWith("@phosphor") ? 1 : 2)
const MAX_ONE_LINE = 120

function parseImports(text) {
  const map = new Map()
  for (const m of text.matchAll(/import\s+(\*\s+as\s+(\w+)|\{([^}]*)\})\s+from\s+"([^"]+)"/g)) {
    const mod = m[4].replace("/dist/ssr", "")
    if (m[2]) {
      map.set(m[2], { spec: `* as ${m[2]}`, mod })
      continue
    }
    for (const raw of m[3].split(",")) {
      const spec = raw.trim()
      if (spec) map.set(spec.split(" as ").pop().trim(), { spec, mod })
    }
  }
  return map
}

const esc = (n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const uses = (name, body) => new RegExp(`(?<![\\w$.])${esc(name)}(?![\\w$])`).test(body)
const unstage = (s) => s.replace(/\bStage([A-Z]\w*)/g, "$1")

function topLevelBlocks(text) {
  // Non-exported top-level const/function declarations, keyed by name, in source order.
  const blocks = []
  const re = /^(?:const|function) (\w+)(?:[^\n]*[[{(]\n[\s\S]*?\n[}\])]\)?[^\n]*(?:\n|$)|[^\n]*(?:\n|$))/gm
  let m
  while ((m = re.exec(text))) blocks.push({ name: m[1], text: m[0].trimEnd() })
  return blocks
}

const entries = {}
for (const rel of sources) {
  const text = fs.readFileSync(path.join(root, rel), "utf8")
  const imports = parseImports(text)
  const helpers = topLevelBlocks(text)
  const re = /^export function (\w+)\([^)]*\) \{\n[\s\S]*?\n\}\n/gm
  let m
  while ((m = re.exec(text))) {
    const [body, name] = m
    const chosen = []
    const queue = [unstage(body)]
    let emitted = unstage(body)
    for (let changed = true; changed; ) {
      changed = false
      for (const h of helpers) {
        if (chosen.includes(h) || !uses(h.name, emitted)) continue
        chosen.push(h)
        emitted = `${unstage(h.text)}\n${emitted}`
        changed = true
      }
    }
    chosen.sort((a, b) => text.indexOf(a.text) - text.indexOf(b.text))
    const parts = [...chosen.map((h) => unstage(h.text)), unstage(body).trimEnd()]
    const code = parts.join("\n\n")
    const byMod = new Map()
    for (const [local, { spec, mod }] of imports) {
      if (!uses(local, code)) continue
      byMod.set(mod, [...(byMod.get(mod) ?? []), spec])
    }
    // Names that only existed through Stage* wrappers resolve to the plain components.
    for (const sname of new Set(body.match(/\bStage[A-Z]\w*/g) ?? [])) {
      const plain = sname.slice(5)
      const info = imports.get(plain) ?? { spec: plain, mod: "@glinui/ui" }
      if (!byMod.get(info.mod)?.includes(info.spec)) byMod.set(info.mod, [...(byMod.get(info.mod) ?? []), info.spec])
    }
    const lines = []
    for (const [mod, specs] of [...byMod.entries()].sort((a, b) => MODULE_ORDER(a[0]) - MODULE_ORDER(b[0]))) {
      const names = [...new Set(specs)]
      const sorted = names.some((n) => n.startsWith("*")) ? names : names.sort()
      const one = `import { ${sorted.join(", ")} } from "${mod}"`
      lines.push(sorted[0].startsWith("*") ? `import ${sorted[0]} from "${mod}"` : (mod !== "@glinui/ui" && one.length <= MAX_ONE_LINE) ? one : `import {\n${sorted.map((n) => `  ${n}`).join(",\n")}\n} from "${mod}"`)
    }
    entries[name] = `"use client"\n\n${lines.join("\n")}\n\n${code}\n`
  }
}

const body = Object.entries(entries).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(",\n")
const file = `// Generated from components/demos/{nav-demos,overlay-showcase-demos}.tsx. Do not edit by hand.\n\nexport const showcaseS2Code: Record<string, string> = {\n${body}\n}\n`
if (process.argv.includes("--check")) {
  const same = fs.existsSync(outFile) && fs.readFileSync(outFile, "utf8") === file
  console.log(same ? "showcase-s2 code up to date" : "showcase-s2 code is stale")
  process.exit(same ? 0 : 1)
}
fs.writeFileSync(outFile, file)
console.log(`wrote ${Object.keys(entries).length} snippets to ${path.relative(process.cwd(), outFile)}`)
