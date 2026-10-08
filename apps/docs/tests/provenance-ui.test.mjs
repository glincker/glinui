import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import {
  ORIGINAL_DISCLAIMER,
  STATUS_UNAVAILABLE_MESSAGE,
  buildAttributionRows,
  buildInstallSources,
  buildShadcnCommand,
  getOriginalModel,
  resolveInstallSource,
  summarizeSources
} from "../src/lib/provenance.ts"
import { FAQ, PLEDGE_SENTENCES } from "../src/lib/pledge.ts"

const read = (path) => readFileSync(join(process.cwd(), path), "utf8")

const provenance = {
  sourceId: "magic-ui",
  sourceName: "Magic UI",
  upstreamUrl: "https://github.com/magicuidesign/magicui",
  upstreamComponentUrl: "https://magicui.design/docs/components/shine-border",
  license: "MIT",
  spdx: "MIT",
  copyright: "Copyright (c) Magic UI",
  commit: "cdb348cb4c72a9b54b554d8617801e479fbc8714",
  status: "active",
  licenseSha256: "x",
  licenseSnapshotPath: "packages/registry/licenses/magic-ui-cdb348c.txt",
  upstreamInstall: { shadcn: 'npx shadcn@latest add "https://magicui.design/r/shine-border"' }
}

test("install sources: Glin and shadcn always, Original only for adapted items", () => {
  assert.deepEqual(buildInstallSources(null).map((s) => s.id), ["glin", "shadcn"])
  assert.deepEqual(buildInstallSources(undefined).map((s) => s.id), ["glin", "shadcn"])
  assert.deepEqual(buildInstallSources(provenance).map((s) => s.id), ["glin", "shadcn", "original"])
  assert.equal(buildInstallSources(provenance)[0].label, "Glin")
})

test("a stale selection falls back to Glin", () => {
  assert.equal(resolveInstallSource("original", buildInstallSources(null)), "glin")
  assert.equal(resolveInstallSource("original", buildInstallSources(provenance)), "original")
})

test("shadcn command uses the served registry JSON", () => {
  assert.equal(buildShadcnCommand("button"), "npx shadcn@latest add https://glinui.com/r/button.json")
})

test("original card model for an active source", () => {
  const model = getOriginalModel(provenance)
  assert.equal(model.heading, "Original by Magic UI")
  assert.equal(model.creditUrl, provenance.upstreamComponentUrl)
  assert.equal(model.installCommand, provenance.upstreamInstall.shadcn)
  assert.equal(model.statusLabel, "Active")
  assert.equal(model.statusMessage, null)
  assert.equal(model.disclaimer, ORIGINAL_DISCLAIMER)
  assert.match(ORIGINAL_DISCLAIMER, /We link to the original; our version is adapted and maintained here\./)
})

test("non active status shows the unavailable message and keeps the credit link", () => {
  for (const status of ["archived", "relicensed", "gone"]) {
    const model = getOriginalModel({ ...provenance, status })
    assert.equal(model.statusMessage, STATUS_UNAVAILABLE_MESSAGE)
    assert.equal(model.creditUrl, provenance.upstreamComponentUrl)
    assert.notEqual(model.statusTone, "ok")
  }
  assert.equal(STATUS_UNAVAILABLE_MESSAGE, "The original is no longer available or its license changed; our MIT copy stays available.")
})

test("original card falls back to the repo url and handles unknown install commands", () => {
  const model = getOriginalModel({ ...provenance, upstreamComponentUrl: undefined, upstreamInstall: undefined })
  assert.equal(model.creditUrl, provenance.upstreamUrl)
  assert.equal(model.installCommand, null)
})

test("attribution rows are sorted and carry a change summary", () => {
  const items = [
    { name: "b-fx", title: "B Fx", provenance: { ...provenance, changes: "Rewritten in CSS" } },
    { name: "plain", title: "Plain" },
    { name: "a-fx", title: "A Fx", provenance }
  ]
  const rows = buildAttributionRows(items)
  assert.deepEqual(rows.map((r) => r.id), ["a-fx", "b-fx"])
  assert.equal(rows[1].changes, "Rewritten in CSS")
  assert.ok(rows[0].changes.length > 0)
  assert.equal(summarizeSources(items)[0].count, 2)
  assert.deepEqual(buildAttributionRows([]), [])
})

test("pledge uses the audited wording", () => {
  assert.equal(PLEDGE_SENTENCES.length, 6)
  assert.equal(PLEDGE_SENTENCES[0], "The code in this repository is MIT-licensed today.")
  assert.match(PLEDGE_SENTENCES[2], /A version that has already been released cannot be revoked\./)
  for (const banned of [/we will never charge/i, /never change the license/i, /100% original/i]) {
    assert.doesNotMatch(PLEDGE_SENTENCES.join(" "), banned)
  }
  const questions = FAQ.map((entry) => entry.question)
  for (const q of ["Can the original authors take it back?", "What if an upstream goes paid?", "How do I request removal?"]) {
    assert.ok(questions.includes(q), q)
  }
})

test("about pages exist and are wired into sitemap, sidebar, palette and footer", () => {
  for (const [route, label] of [
    ["attribution", "Attribution"],
    ["free-forever", "Free forever pledge"]
  ]) {
    const page = `src/app/docs/${route}/page.tsx`
    assert.ok(existsSync(join(process.cwd(), page)))
    assert.match(read(page), new RegExp(`path: "/docs/${route}"`))
    assert.match(read(page), /createDocsMetadata/)
    assert.match(read("src/app/sitemap.ts"), new RegExp(`route: "/docs/${route}"`))
    assert.match(read("src/components/layout/docs-sidebar.tsx"), new RegExp(`href: "/docs/${route}", label: "${label}"`))
    assert.match(read("src/components/layout/command-palette.tsx"), new RegExp(`href: "/docs/${route}"`))
    assert.match(read("src/components/layout/site-footer.tsx"), new RegExp(`href: "/docs/${route}"`))
  }
})

test("provenance UI wiring: selector, badge, gallery pill and adapted tag", () => {
  assert.match(read("src/components/docs/component-hero.tsx"), /InstallSourceBlock/)
  assert.match(read("src/components/docs/component-doc-page.tsx"), /InstallSourceBlock/)
  assert.match(read("src/components/docs/component-doc-layout.tsx"), /AdaptedBadge/)
  assert.match(read("src/components/gallery/gallery-card.tsx"), /provenance-pill/)
  assert.match(read("src/components/gallery/gallery-types.ts"), /id: "adapted", label: "Adapted"/)
  assert.match(read("src/lib/taxonomy.ts"), /tags\.push\("adapted"\)/)
})

test("new provenance files avoid inline styles, any and dashes", () => {
  for (const file of [
    "src/lib/provenance.ts",
    "src/lib/pledge.ts",
    "src/components/docs/install-source-block.tsx",
    "src/components/docs/original-source-card.tsx",
    "src/components/docs/adapted-badge.tsx",
    "src/app/docs/attribution/page.tsx",
    "src/app/docs/free-forever/page.tsx"
  ]) {
    const source = read(file)
    assert.doesNotMatch(source, /style=\{/, file)
    assert.doesNotMatch(source, /: any\b|as any\b/, file)
    assert.doesNotMatch(source, /[\u2013\u2014]/, file)
    assert.ok(source.split("\n").length < 500, file)
  }
})
