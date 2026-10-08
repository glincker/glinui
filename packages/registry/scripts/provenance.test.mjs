import assert from "node:assert/strict"
import test from "node:test"
import { loadRegistryModule } from "./load-registry-source.mjs"
import { crossCheckProvenance, checkAll, checkHeaderTemplate } from "./provenance-check.mjs"
import { readLicenseSnapshot, sha256, verifyLicenseSnapshots } from "./provenance-files.mjs"

const { baseRegistry, provenanceSources, buildProvenance } = loadRegistryModule()
const adaptedItems = baseRegistry.filter((item) => item.provenance)

test("every source has a tracked license snapshot whose sha256 matches", () => {
  assert.deepEqual(verifyLicenseSnapshots(provenanceSources), [])
  for (const source of Object.values(provenanceSources)) {
    assert.equal(sha256(readLicenseSnapshot(source)), source.licenseSha256)
    assert.match(source.commit, /^[0-9a-f]{40}$/)
    assert.equal(source.spdx, "MIT")
    assert.doesNotMatch(source.copyright, /[\u2013\u2014]/)
  }
})

test("pinned sources match the recorded upstream facts", () => {
  assert.equal(provenanceSources["magic-ui"].commit, "cdb348cb4c72a9b54b554d8617801e479fbc8714")
  assert.equal(provenanceSources["magic-ui"].copyright, "Copyright (c) Magic UI")
  assert.equal(provenanceSources["vengeance-ui"].commit, "0376d8e37b4a565016cce1064d7b96905c4494ab")
  assert.equal(provenanceSources["vengeance-ui"].copyright, "Copyright (c) 2025-2026 Ashutoshx7")
})

test("buildProvenance fills fields, hash and snapshot from the source register", () => {
  const p = buildProvenance("magic-ui", { component: "shine-border", adaptedFrom: ["apps/www/registry/magicui/shine-border.tsx"] })
  assert.equal(p.sourceId, "magic-ui")
  assert.equal(p.status, "active")
  assert.equal(p.licenseSha256, provenanceSources["magic-ui"].licenseSha256)
  assert.equal(p.licenseSnapshotPath, "packages/registry/licenses/magic-ui-cdb348c.txt")
  assert.equal(p.upstreamComponentUrl, "https://magicui.design/docs/components/shine-border")
  assert.equal(p.upstreamInstall?.shadcn, 'npx shadcn@latest add "https://magicui.design/r/shine-border"')
  assert.equal(p.adaptedFrom, "apps/www/registry/magicui/shine-border.tsx")

  const v = buildProvenance("vengeance-ui", { component: "generate-button", adaptedFrom: "src/components/ui/generate-button.tsx" })
  assert.match(v.upstreamComponentUrl, /\/blob\/0376d8e37b4a565016cce1064d7b96905c4494ab\/src\/components\/ui\/generate-button\.tsx$/)
  assert.equal(v.upstreamInstall, undefined)
  assert.throws(() => buildProvenance("nope", { component: "x" }))
})

test("registry items with provenance are consistent with their headers", () => {
  assert.equal(adaptedItems.length, 21, "16 Batch A ports and 5 Batch B ports are registered with provenance")
  assert.deepEqual(checkAll({ items: baseRegistry, sources: provenanceSources }), [])
})

test("every adapted item has a change summary and no dashes in provenance text", () => {
  for (const item of adaptedItems) {
    assert.ok(item.provenance.changes && item.provenance.changes.length > 20, `${item.name} needs a changes summary`)
    assert.doesNotMatch(JSON.stringify(item), /[\u2013\u2014]/, `${item.name} contains an em or en dash`)
    assert.equal(item.provenance.status, "active")
  }
})

test("cross-check passes with zero adapted items and zero headers", () => {
  assert.deepEqual(crossCheckProvenance({ items: [], sources: provenanceSources, headered: [], readComponent: () => null }), [])
})

test("cross-check fails on mismatches", () => {
  const good = { name: "demo", provenance: buildProvenance("magic-ui", { component: "demo" }) }
  const header = `/**\n * Adapted from Demo in Magic UI, commit ${provenanceSources["magic-ui"].commit}.\n */`
  const run = (over) =>
    crossCheckProvenance({ items: [good], sources: provenanceSources, headered: [{ id: "demo", content: header }], readComponent: () => header, ...over })

  assert.deepEqual(run({}), [])
  assert.match(run({ readComponent: () => "export const x = 1" }).join("\n"), /lacks the "Adapted from" header/)
  assert.match(run({ readComponent: () => null }).join("\n"), /source file not found/)
  assert.match(run({ headered: [{ id: "orphan", content: header }] }).join("\n"), /orphan: has an "Adapted from" header but no registry provenance/)
  assert.match(
    run({ items: [{ name: "demo", provenance: { ...good.provenance, licenseSha256: "0".repeat(64) } }] }).join("\n"),
    /licenseSha256 does not match/
  )
  assert.match(run({ items: [{ name: "demo", provenance: { ...good.provenance, sourceId: "x" } }] }).join("\n"), /unknown provenance source/)
  assert.match(run({ items: [{ name: "demo", provenance: { ...good.provenance, commit: "main" } }] }).join("\n"), /40 char sha/)
})

test("header template check flags missing parts and dashes", () => {
  const ok = "/**\n * Glin UI Demo (demo). Adapted from Demo in Magic UI\n * (https://x), commit abc.\n * Original copyright (c) Magic UI. Licensed under MIT.\n * Modified for Glin UI: tokens.\n * See THIRD_PARTY_NOTICES.md#demo.\n */"
  assert.deepEqual(checkHeaderTemplate({ id: "demo", content: ok }), [])
  assert.ok(checkHeaderTemplate({ id: "demo", content: ok.replace("tokens", "tokens \u2014 x") }).length > 0)
  assert.ok(checkHeaderTemplate({ id: "demo", content: ok.replace("Licensed under MIT.", "") }).length > 0)
})

test("motion-primitives source matches its pinned license snapshot", () => {
  const src = provenanceSources["motion-primitives"]
  assert.equal(src.copyright, "Copyright (c) 2024 ibelick")
  assert.equal(src.commit.length, 40)
  const m = buildProvenance("motion-primitives", { component: "spinning-text", adaptedFrom: "components/core/spinning-text.tsx" })
  assert.equal(m.upstreamInstall.shadcn, 'npx shadcn@latest add "https://motion-primitives.com/c/spinning-text.json"')
})
