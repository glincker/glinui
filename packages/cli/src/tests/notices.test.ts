import { existsSync, readFileSync } from "node:fs"
import { rm } from "node:fs/promises"
import { join } from "node:path"
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { runAdd } from "../commands/add.js"
import {
  buildAttributionHeader,
  ensureAttributionHeader,
  hasAttributionHeader,
  mergeNotices,
  type ItemProvenance
} from "../utils/notices.js"
import { scaffoldProject } from "./helpers/project.js"

const LICENSE = "MIT License\n\nCopyright (c) Magic UI\n\nPermission is hereby granted."

const provenance: ItemProvenance = {
  sourceId: "magic-ui",
  sourceName: "Magic UI",
  upstreamUrl: "https://github.com/magicuidesign/magicui",
  license: "MIT",
  spdx: "MIT",
  copyright: "Copyright (c) Magic UI",
  commit: "cdb348cb4c72a9b54b554d8617801e479fbc8714",
  adaptedFrom: "apps/www/registry/magicui/demo-fx.tsx",
  licenseText: LICENSE
}

const HEADERED = `"use client"
/**
 * Glin UI demo-fx. Adapted from DemoFx in Magic UI
 * (https://github.com/magicuidesign/magicui), commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 */
export const DemoFx = () => null
`
const BARE = `"use client"

export const DemoFx = () => null
`

describe("attribution header", () => {
  it("detects an existing header and leaves the file untouched", () => {
    expect(hasAttributionHeader(HEADERED)).toBe(true)
    expect(ensureAttributionHeader(HEADERED, "demo-fx", provenance)).toBe(HEADERED)
  })

  it("inserts the header after the use client directive when missing", () => {
    expect(hasAttributionHeader(BARE)).toBe(false)
    const out = ensureAttributionHeader(BARE, "demo-fx", provenance)
    expect(out.startsWith('"use client"\n/**')).toBe(true)
    expect(hasAttributionHeader(out)).toBe(true)
    expect(out).toContain("commit cdb348cb4c72a9b54b554d8617801e479fbc8714")
    expect(out).toContain("Original copyright (c) Magic UI. Licensed under MIT.")
    expect(ensureAttributionHeader(out, "demo-fx", provenance)).toBe(out)
  })

  it("prepends the header to files without a directive and never uses dashes", () => {
    const out = ensureAttributionHeader("export const a = 1\n", "demo-fx", provenance)
    expect(out.startsWith("/**")).toBe(true)
    expect(buildAttributionHeader("demo-fx", provenance)).not.toMatch(/[\u2013\u2014]/)
  })
})

describe("mergeNotices", () => {
  it("creates a file with one section and the license text", () => {
    const text = mergeNotices(null, [{ provenance, components: ["demo-fx"] }])
    expect(text).toContain("# Third party notices")
    expect(text).toContain("## Magic UI")
    expect(text).toContain("  - demo-fx")
    expect(text).toContain(LICENSE)
  })

  it("is idempotent and merges new components without duplicating sections", () => {
    const first = mergeNotices(null, [{ provenance, components: ["demo-fx"] }])
    expect(mergeNotices(first, [{ provenance, components: ["demo-fx"] }])).toBe(first)
    const second = mergeNotices(first, [{ provenance, components: ["other-fx"] }])
    expect(second.match(/## Magic UI/g)).toHaveLength(1)
    expect(second).toContain("  - demo-fx")
    expect(second).toContain("  - other-fx")
  })

  it("appends below existing user content and adds a second source separately", () => {
    const user = "# My notices\n\nSomething else.\n"
    const other: ItemProvenance = { ...provenance, sourceId: "vengeance-ui", sourceName: "Vengeance UI" }
    const out = mergeNotices(user, [{ provenance, components: ["a"] }, { provenance: other, components: ["b"] }])
    expect(out.startsWith("# My notices")).toBe(true)
    expect(out).toContain("## Magic UI")
    expect(out).toContain("## Vengeance UI")
  })
})

describe("runAdd with an adapted component", () => {
  const created: string[] = []

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined)
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input instanceof Request ? input.url : input)
        if (!url.endsWith("/items/demo-fx.json")) return new Response("not found", { status: 404, statusText: "Not Found" })
        return new Response(
          JSON.stringify({
            name: "demo-fx",
            type: "primitive",
            dependencies: [],
            provenance,
            files: [{ path: "packages/ui/src/components/demo-fx.tsx", content: BARE }]
          }),
          { status: 200 }
        )
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await Promise.all(created.map((dir) => rm(dir, { recursive: true, force: true })))
  })

  it("restores the header and writes the notice file once", async () => {
    const cwd = await scaffoldProject("glinui-alias")
    created.push(cwd)
    const summary = await runAdd({ components: ["demo-fx"], cwd, overwrite: true })
    const source = readFileSync(join(cwd, "src/components/ui/demo-fx.tsx"), "utf8")
    expect(hasAttributionHeader(source)).toBe(true)
    const notices = readFileSync(join(cwd, "THIRD_PARTY_NOTICES.md"), "utf8")
    expect(notices).toContain("## Magic UI")
    expect(summary.noticesFile).toBe(join(cwd, "THIRD_PARTY_NOTICES.md"))

    await runAdd({ components: ["demo-fx"], cwd, overwrite: true })
    expect(readFileSync(join(cwd, "THIRD_PARTY_NOTICES.md"), "utf8")).toBe(notices)
  })

  it("skips the notice file with notices: false but keeps the header", async () => {
    const cwd = await scaffoldProject("glinui-alias")
    created.push(cwd)
    await runAdd({ components: ["demo-fx"], cwd, notices: false })
    expect(existsSync(join(cwd, "THIRD_PARTY_NOTICES.md"))).toBe(false)
    expect(hasAttributionHeader(readFileSync(join(cwd, "src/components/ui/demo-fx.tsx"), "utf8"))).toBe(true)
  })

  it("does not write a notice file for items without provenance", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(
          JSON.stringify({ name: "demo-fx", type: "primitive", dependencies: [], files: [{ path: "packages/ui/src/components/demo-fx.tsx", content: BARE }] }),
          { status: 200 }
        )
      )
    )
    const cwd = await scaffoldProject("glinui-alias")
    created.push(cwd)
    await runAdd({ components: ["demo-fx"], cwd })
    expect(existsSync(join(cwd, "THIRD_PARTY_NOTICES.md"))).toBe(false)
  })
})
