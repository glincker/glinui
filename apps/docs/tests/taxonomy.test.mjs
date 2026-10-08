import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (path) => readFileSync(join(process.cwd(), path), "utf8")

function parseIds(source, exportName) {
  const block = source.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\]`))?.[1] ?? ""
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1])
}

const taxonomy = read("src/lib/taxonomy.ts")
const primitives = read("src/lib/primitives.ts")
const newIds = read("src/lib/new-component-ids.ts")

const categoryIds = [...taxonomy.matchAll(/\{ id: "([a-z]+)", title: "[^"]+", description:/g)].map((m) => m[1])

// Parse family("cat", "name", [ids]) and single("cat", "id") definitions.
const defs = []
for (const m of taxonomy.matchAll(/family\("([a-z]+)", "([a-z-]+)", \[([^\]]*)\]\)/g)) {
  defs.push({ category: m[1], family: m[2], ids: [...m[3].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]) })
}
for (const m of taxonomy.matchAll(/single\("([a-z]+)", "([a-z0-9-]+)"\)/g)) {
  defs.push({ category: m[1], ids: [m[2]] })
}
const mappedIds = defs.flatMap((d) => d.ids)

test("taxonomy defines 10 to 14 categories", () => {
  assert.ok(categoryIds.length >= 10 && categoryIds.length <= 14, `got ${categoryIds.length}`)
  assert.equal(new Set(categoryIds).size, categoryIds.length)
})

test("every component id has exactly one taxonomy entry (categorize new components!)", () => {
  const registryIds = readdirSync(join(process.cwd(), "public/r/items")).map((f) => f.replace(/\.json$/, ""))
  const all = new Set([
    ...parseIds(primitives, "primitiveComponentIds"),
    ...parseIds(primitives, "signatureComponentIds"),
    ...parseIds(newIds, "newComponentIds"),
    ...parseIds(newIds, "aiComponentIds"),
    ...registryIds
  ])
  const missing = [...all].filter((id) => !mappedIds.includes(id))
  assert.deepEqual(missing, [], `Add these ids to src/lib/taxonomy.ts: ${missing.join(", ")}`)
  const unknown = mappedIds.filter((id) => !all.has(id))
  assert.deepEqual(unknown, [], `Taxonomy lists ids that do not exist: ${unknown.join(", ")}`)
})

test("no id is mapped twice and every definition uses a known category", () => {
  const dupes = mappedIds.filter((id, i) => mappedIds.indexOf(id) !== i)
  assert.deepEqual(dupes, [])
  for (const d of defs) assert.ok(categoryIds.includes(d.category), `unknown category ${d.category}`)
})

test("every category is non-empty", () => {
  for (const id of categoryIds) assert.ok(defs.some((d) => d.category === id), `category ${id} is empty`)
})

test("each family has exactly one base (its first id) and stays within one category", () => {
  const names = defs.filter((d) => d.family).map((d) => d.family)
  assert.equal(new Set(names).size, names.length, "family names must be unique")
  for (const d of defs.filter((x) => x.family)) {
    assert.ok(d.ids.length >= 2, `family ${d.family} should have 2+ members, otherwise use single()`)
  }
  assert.match(taxonomy, /base: index === 0/, "base must be the first id of each family")
})

test("related helper returns siblings before category peers and excludes itself", () => {
  assert.match(taxonomy, /export function getRelated/)
  assert.match(taxonomy, /\[\.\.\.siblings, \.\.\.peers\]/)
  assert.match(taxonomy, /other !== id/)
  assert.match(taxonomy, /export const allCategorized/)
  assert.match(taxonomy, /FALLBACK_CATEGORY: CategoryId = "motion"/)
})

test("sidebar, palette, gallery and doc layout consume the taxonomy", () => {
  assert.match(read("src/components/layout/docs-sidebar.tsx"), /@\/lib\/taxonomy/)
  assert.match(read("src/components/layout/command-palette.tsx"), /@\/lib\/taxonomy/)
  assert.match(read("src/components/gallery/gallery-types.ts"), /@\/lib\/taxonomy/)
  assert.match(read("src/app/docs/components/gallery-items.ts"), /@\/lib\/taxonomy/)
  const layout = read("src/components/docs/component-doc-layout.tsx")
  assert.match(layout, /RelatedComponents/)
  assert.match(layout, /category\.title/)
  assert.match(read("src/components/gallery/use-gallery-url-state.ts"), /params\.get\("category"\)/)
})
