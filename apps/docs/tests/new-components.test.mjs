import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (path) => readFileSync(join(process.cwd(), path), "utf8")

function parseIds(source, exportName) {
  const block = source.match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\]`))?.[1] ?? ""
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1])
}

const idsSource = read("src/lib/new-component-ids.ts")
const newIds = parseIds(idsSource, "newComponentIds")
const aiIds = parseIds(idsSource, "aiComponentIds")
const primitivesSource = read("src/lib/primitives.ts")
const primitiveIds = parseIds(primitivesSource, "primitiveComponentIds")

const docsSources = readdirSync(join(process.cwd(), "src/lib/new-components"))
  .filter((file) => file.endsWith(".tsx"))
  .map((file) => read(`src/lib/new-components/${file}`))
  .join("\n")

test("new component id list is complete", () => {
  assert.equal(newIds.length, 66)
  assert.equal(new Set(newIds).size, newIds.length, "new ids are unique")
  for (const id of aiIds) assert.ok(newIds.includes(id), `${id} (AI) should be a new id`)
  assert.equal(aiIds.length, 8)
})

test("every new id is a primitive with docs data", () => {
  for (const id of newIds) {
    assert.ok(primitiveIds.includes(id), `${id} should be in primitiveComponentIds`)
    const start = docsSources.search(new RegExp(`^  "?${id}"?: \\{$`, "m"))
    assert.ok(start >= 0, `docs data should define ${id}`)
    const rest = docsSources.slice(start + 1)
    const next = rest.search(/^  "?[a-z-]+"?: \{$/m)
    const block = docsSources.slice(start, next < 0 ? undefined : start + 1 + next)
    assert.match(block, /examples: \[/, `${id} should define examples`)
    assert.match(block, /accessibility: \{/, `${id} should define accessibility`)
    assert.match(block, /props: /, `${id} should define props`)
  }
})

test("docs data is merged through component-docs-all and imports only public exports", () => {
  const all = read("src/lib/component-docs-all.ts")
  for (const batch of ["batch1Docs", "batch2Docs", "batch3Docs", "batch4Docs", "batchA1Docs", "batchA2Docs", "batchA3Docs", "batchA4Docs", "batchB1Docs", "batchB2Docs", "batchB3Docs", "batchB4Docs", "variantsTheauthDocs"]) {
    assert.ok(all.includes(batch), `component-docs-all should spread ${batch}`)
  }
  assert.ok(read("src/lib/component-docs-extra.ts").includes("variantsTheauthExtras"))
  assert.doesNotMatch(docsSources, /from "@glinui\/ui\/(components|lib)\//, "docs data should import from @glinui/ui")
})

test("sidebar lists new components, tags them new and has an AI group", () => {
  const sidebar = read("src/components/layout/docs-sidebar.tsx")
  assert.match(sidebar, /newComponentIds/)
  assert.match(sidebar, /"new"/)
  assert.match(sidebar, /getComponentsByCategory/)
  assert.match(read("src/lib/taxonomy.ts"), /id: "ai", title: "AI"/)
  assert.match(read("src/lib/taxonomy.ts"), /aiComponentIds/)
})

test("command palette makes new components searchable with an AI group", () => {
  const palette = read("src/components/layout/command-palette.tsx")
  assert.match(palette, /getComponentsByCategory/)
  assert.match(palette, /category\.title/)
  assert.match(read("src/lib/taxonomy.ts"), /id: "ai", title: "AI"/)
})

test("sitemap enumerates registry items and the registry metadata includes new ids", () => {
  assert.match(read("src/app/sitemap.ts"), /generatedRegistryItems/)
  const registry = read("src/lib/generated-registry-metadata.ts")
  const api = read("src/lib/generated-api-metadata.ts")
  for (const id of newIds) {
    assert.ok(registry.includes(`"${id}"`), `registry metadata should include ${id}`)
    assert.ok(api.includes(`"${id}"`) || api.includes(`${id}:`), `api metadata should include ${id}`)
    assert.ok(existsSync(join(process.cwd(), `public/r/items/${id}.json`)), `public/r/items/${id}.json should exist`)
  }
})

test("gallery flags new ids and has task based categories", () => {
  const types = read("src/components/gallery/gallery-types.ts")
  assert.match(types, /NEW_COMPONENT_IDS: readonly ComponentId\[\] = newComponentIds/)
  const taxonomy = read("src/lib/taxonomy.ts")
  for (const category of ['title: "AI"', 'title: "Navigation"', 'title: "Forms and inputs"', 'title: "Layout and structure"']) {
    assert.ok(taxonomy.includes(category), `taxonomy categories should include ${category}`)
  }
  assert.match(types, /galleryCategoryOrder/)
  assert.match(read("src/app/docs/components/page.tsx"), /buildGalleryItems/)
})

test("usage notes exist for Field, Sidebar, Combobox and contained overlays", () => {
  const notes = read("src/lib/component-docs-extra-notes.ts")
  for (const key of ["field", "sidebar", "combobox", "modal", '"alert-dialog"', "sheet"]) {
    assert.ok(notes.includes(`${key}:`), `notes should cover ${key}`)
  }
  assert.match(notes, /FieldControl/)
  assert.match(notes, /containerClassName/)
  assert.match(notes, /single select only/)
})

test("no em or en dashes in new docs sources", () => {
  for (const file of ["src/lib/new-component-ids.ts", "src/lib/component-docs-extra-notes.ts", "src/lib/component-docs-all.ts"]) {
    assert.doesNotMatch(read(file), /[\u2013\u2014]/, `${file} should not contain em or en dashes`)
  }
  assert.doesNotMatch(docsSources, /[\u2013\u2014]/)
})

const batchAIds = [
  "hyper-text", "morphing-text", "sparkles-text", "gradient-text", "shine-border", "magic-card", "neon-gradient-card", "bento-grid",
  "light-rays", "grid-pattern", "animated-beam", "flickering-grid", "interactive-hover-button", "generate-button", "browser-frame", "terminal"
]

test("Batch A ports are new ids, in the taxonomy, redirected and tagged adapted from provenance", () => {
  const taxonomy = read("src/lib/taxonomy.ts")
  const redirects = read("public/_redirects")
  for (const id of batchAIds) {
    assert.ok(newIds.includes(id), `${id} should be a new id`)
    assert.ok(taxonomy.includes(`"${id}"`), `${id} should be in the taxonomy`)
    assert.ok(redirects.includes(`/docs/components/${id} /docs/components/radix/${id} 301`), `${id} should have a short URL`)
  }
  assert.match(taxonomy, /getRegistryItem\(id\)\?\.provenance\) tags\.push\("adapted"\)/)
})

test("docs page maps notes and always renders a Credits note for adapted items", () => {
  const page = read("src/components/docs/component-doc-page.tsx")
  assert.match(page, /meta\.notes/)
  assert.match(page, /data-testid="credits-note"/)
  assert.match(page, /<InstallSourceBlock/)
})

test("beam demos avoid a flex root, which the preview stage forces to justify-center", () => {
  const beam = read("src/lib/new-components/batch-a3b.tsx")
  assert.doesNotMatch(beam, /FRAME\} flex /)
  assert.match(beam, /grid-flow-col/)
})
