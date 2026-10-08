import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, "..", "..", "..")

const targets = [
  ["animated-gradient", "apps/docs/src/app/docs/components/animated-gradient/page.mdx"],
  ["glass-card", "apps/docs/src/app/docs/components/glass-card/page.mdx"],
  ["pulsating-button", "apps/docs/src/app/docs/components/pulsating-button/page.mdx"],
  ["ripple", "apps/docs/src/app/docs/components/ripple/page.mdx"],
  ["shimmer-button", "apps/docs/src/app/docs/components/shimmer-button/page.mdx"]
]

const tableRegex = /<PropsTable[\s\S]*?rows=\{\[[\s\S]*?\]\}[\s\S]*?\/>/g

let updated = 0

for (const [componentId, relativePath] of targets) {
  const absolutePath = join(root, relativePath)
  const source = readFileSync(absolutePath, "utf8")
  if (!tableRegex.test(source)) {
    // eslint-disable-next-line no-console
    console.warn(`skip ${relativePath}: no hardcoded rows block found`)
    continue
  }

  const next = source.replaceAll(tableRegex, `<PropsTable componentId="${componentId}" autoAppendGenerated />`)
  if (next !== source) {
    writeFileSync(absolutePath, next, "utf8")
    updated += 1
  }
}

// eslint-disable-next-line no-console
console.log(`updated ${updated} mdx files`)
