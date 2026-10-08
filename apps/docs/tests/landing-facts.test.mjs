import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const read = (p) => readFileSync(join(root, p), "utf8")
const facts = read("src/components/home/landing-facts.ts")
const num = (name) => Number(facts.match(new RegExp(`export const ${name} = (\\d+)`))[1])

test("variant count matches SURFACE_VARIANTS", () => {
  const src = readFileSync(join(root, "../../packages/ui/src/lib/surface.ts"), "utf8")
  const list = src.match(/SURFACE_VARIANTS = \[([^\]]+)\]/)[1].split(",").filter((x) => x.trim())
  assert.equal(num("VARIANT_COUNT"), list.length)
})

test("base color count matches bases.ts", () => {
  const src = readFileSync(join(root, "../../packages/tokens/src/bases.ts"), "utf8")
  const ids = new Set([...src.matchAll(/\{ id: "(\w+)", label:/g)].map((m) => m[1]))
  assert.equal(num("BASE_COUNT"), ids.size)
})

test("component count is derived from the registry, never hardcoded", () => {
  assert.match(facts, /COMPONENT_COUNT = allComponentIds\.length/)
  const dir = join(root, "src/components/home")
  for (const f of readdirSync(dir)) {
    const text = readFileSync(join(dir, f), "utf8")
    assert.doesNotMatch(text, /\b\d{2,3}\+ components/, `${f} hardcodes a component count`)
  }
})

test("CTA hrefs resolve to existing routes", () => {
  const hrefs = [...facts.matchAll(/href: "(\/[^"]+)"/g)].map((m) => m[1])
  for (const m of facts.matchAll(/DOCS_HREFS = \[([^\]]+)\]/g)) hrefs.push(...[...m[1].matchAll(/"(\/[^"]+)"/g)].map((x) => x[1]))
  assert.ok(hrefs.length >= 4)
  for (const h of hrefs) {
    const base = join(root, "src/app", h)
    const ok = existsSync(join(base, "page.tsx")) || existsSync(join(base, "page.mdx")) || existsSync(base) || existsSync(join(root, "src/app/docs/[...slug]"))
    assert.ok(ok, `no route for ${h}`)
  }
})

test("FAQ states React and Tailwind support that package.json backs", () => {
  const ui = JSON.parse(readFileSync(join(root, "../../packages/ui/package.json"), "utf8"))
  assert.equal(ui.peerDependencies.react, "^18.0.0 || ^19.0.0")
  const tok = JSON.parse(readFileSync(join(root, "../../packages/tokens/package.json"), "utf8"))
  assert.ok(tok.exports["./tailwind-preset"] && tok.exports["./tailwind4.css"])
})
