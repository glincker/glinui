import { mkdtempSync, readFileSync, rmSync, statSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

// Raw size budget. Gzip is roughly 42KB; raise only with a reason.
const MAX_BYTES = 320 * 1024

const scriptUrl = pathToFileURL(resolve(__dirname, "../../scripts/build-styles.mjs")).href

describe("precompiled styles.css", () => {
  let dir = ""
  let css = ""
  let file = ""

  beforeAll(async () => {
    dir = mkdtempSync(join(tmpdir(), "glinui-styles-"))
    const mod = (await import(/* @vite-ignore */ scriptUrl)) as { buildStyles: (out: string) => string }
    file = mod.buildStyles(join(dir, "styles.css"))
    css = readFileSync(file, "utf8")
  }, 60_000)

  afterAll(() => {
    if (dir) rmSync(dir, { recursive: true, force: true })
  })

  it("stays within the size budget", () => {
    expect(statSync(file).size).toBeLessThan(MAX_BYTES)
  })

  it("has no unresolved imports or undefined values", () => {
    expect(css).not.toContain("@import")
    expect(css).not.toContain("undefined")
  })

  it("supports both .dark and data-glin-theme scopes", () => {
    expect(css).toMatch(/\.dark,\[data-glin-theme=dark\]\{/)
    expect(css).toContain("data-glin-theme=light")
    expect(css).toContain("data-glin-theme")
  })

  it("defines color variables for light and dark", () => {
    const light = css.match(/:root[^{]*\{[^}]*--color-background:/)
    const dark = css.match(/\.dark[^{]*\{[^}]*--color-background:/)
    expect(light).not.toBeNull()
    expect(dark).not.toBeNull()
  })

  it("contains component utilities (Button, CodePanel)", () => {
    expect(css).toContain(".inline-flex")
    expect(css).toContain(".focus-visible\\:ring-2")
    expect(css).toContain(".rounded-\\[inherit\\]")
    expect(css).toContain(".motion-reduce\\:transition-none")
  })

  it("compiles box-shadow arbitrary values to box-shadow declarations", () => {
    expect(css).toMatch(/box-shadow:var\(--elev/)
    expect(css).not.toMatch(/shadow-\\\[var\(--elev[^{]*\{[^}]*--tw-shadow-color/)
  })
})
