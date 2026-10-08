// The sources use extensionless relative imports (webpack in the docs app resolves them from src).
// Node ESM needs explicit extensions, so add ".js" to relative specifiers in the built output.
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist")
const pattern = /(\bfrom\s+["'])(\.{1,2}\/[^"']+?)(["'])/g

for (const name of readdirSync(dist)) {
  if (!/\.(js|d\.ts)$/.test(name)) continue
  const file = join(dist, name)
  const text = readFileSync(file, "utf8")
  const next = text.replace(pattern, (full, lead, spec, tail) => (/\.[cm]?js$/.test(spec) ? full : `${lead}${spec}.js${tail}`))
  if (next !== text) writeFileSync(file, next, "utf8")
}
