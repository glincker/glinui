import { compile } from "@tailwindcss/node"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const html = readFileSync(resolve(root, "tests/fixtures/tw4.html"), "utf8")
const candidates = [...new Set(html.split(/[\s"<>=]+/).filter(Boolean))]

async function build(entry: string): Promise<string> {
  const compiler = await compile(entry, { base: root, onDependency: () => {} })
  return compiler.build(candidates)
}

const prefixed = `
@import "tailwindcss";
@import "./theme.css";
@import "./tailwind4.css";
`

describe("tailwind4.css", () => {
  it("compiles utilities, animations and the dark variant", async () => {
    const css = await build(prefixed)
    const has = (s: string) => expect(css, s).toContain(s)
    has(".bg-surface-1")
    has("var(--surface-1)")
    has(".text-glin-muted")
    has("var(--color-muted)")
    has(".rounded-lg")
    has(".shadow-elev-2")
    has("var(--elev-2)")
    has(".animate-in")
    has("@keyframes enter")
    has(".fade-in")
    has("--tw-enter-opacity: 0")
    has("--tw-enter-scale: calc(95 / 100)")
    has(".slide-in-from-top-2")
    has(".slide-in-from-bottom-1\\/2")
    has(".animate-marquee-x")
    has(".animate-accordion-down")
    has("@keyframes accordion-down")
    has(".font-glin-sans")
    has(".rounded-glin-card")
    has(".max-w-layout")
    has(".bg-grain")
    has(".bg-glin-brand\\/50")
    has("[data-glin-theme=dark]")
    expect(css).toMatch(/dark\\:bg-surface-2/)
  })

  it("emits no undefined or unresolved variables", async () => {
    const css = await build(prefixed)
    expect(css).not.toMatch(/undefined|NaN|--value\(/)
  })

  it("unprefixed opt-in maps exact preset names", async () => {
    const css = await build(`${prefixed}\n@import "./tailwind4-unprefixed.css";`)
    for (const s of [".bg-muted", ".text-body", ".rounded-card", ".font-sans", ".bg-ring"]) {
      expect(css, s).toContain(s)
    }
    expect(css).toContain("var(--glin-muted)")
    expect(css).not.toMatch(/undefined|--value\(/)
  })
})
