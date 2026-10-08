import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { expectedOutputs, renderNotices } from "../scripts/generate-third-party-notices.mjs"

test("committed THIRD_PARTY_NOTICES.md and package copies are up to date", () => {
  const stale = []
  for (const [file, expected] of expectedOutputs()) {
    let actual = null
    try {
      actual = readFileSync(file, "utf8")
    } catch {
      // missing counts as stale
    }
    if (actual !== expected) stale.push(file)
  }
  assert.deepEqual(stale, [], "Run `pnpm --filter @glinui/docs notices:generate`")
})

test("notices contain a section per source, the license text and no dashes", () => {
  const text = readFileSync(new URL("../../../THIRD_PARTY_NOTICES.md", import.meta.url), "utf8")
  for (const heading of ["## Magic UI", "## Vengeance UI"]) assert.ok(text.includes(heading), heading)
  assert.match(text, /Copyright \(c\) Magic UI/)
  assert.match(text, /Copyright \(c\) 2025-2026 Ashutoshx7/)
  assert.match(text, /Permission is hereby granted, free of charge/)
  assert.doesNotMatch(text, /[\u2013\u2014]/)
})

test("renderNotices lists adapted components with our path and theirs", () => {
  const sources = {
    s: {
      id: "s", name: "Src", upstreamUrl: "https://example.com/r", siteUrl: "https://example.com", spdx: "MIT",
      copyright: "Copyright (c) Src", commit: "a".repeat(40), licenseSnapshotPath: "p.txt", licenseSha256: "h"
    }
  }
  const items = [
    { name: "demo-fx", files: ["packages/ui/src/components/motion-engine.tsx", "packages/ui/src/components/demo-fx.tsx"], provenance: { sourceId: "s", adaptedFrom: "src/demo.tsx" } }
  ]
  const out = renderNotices({ sources, items, readLicense: () => "LICENSE TEXT" })
  assert.match(out, /\| <a id="demo-fx"><\/a>demo-fx \| packages\/ui\/src\/components\/demo-fx\.tsx \| src\/demo\.tsx \|/)
  assert.match(out, /LICENSE TEXT/)
  assert.match(renderNotices({ sources, items: [], readLicense: () => "T" }), /No components from this source are registered yet\./)
})
