import assert from "node:assert/strict"
import { createRequire } from "node:module"
import test from "node:test"

const require = createRequire(import.meta.url)
const preset = require("@glinui/tokens/tailwind-preset")
const ext = preset.theme.extend

test("preset maps surface, brand and signal colours", () => {
  for (const key of ["0", "1", "2", "3", "well", "DEFAULT"]) assert.ok(ext.colors.surface[key], `surface.${key}`)
  for (const key of ["background", "foreground", "border", "muted", "subtle"]) assert.ok(ext.colors[key], key)
  assert.ok(ext.colors.brand.DEFAULT && ext.colors.brand.foreground)
  assert.ok(ext.colors.accent.DEFAULT && ext.colors.accent.foreground)
  assert.equal(ext.colors.line.soft, "var(--line-soft)")
  assert.ok(ext.colors.signal.live && ext.colors.signal.ok)
})

test("colour functions support the opacity modifier for OKLCH vars", () => {
  const fn = ext.colors.surface[1]
  assert.equal(fn({}), "var(--surface-1)")
  assert.equal(fn({ opacityValue: "var(--tw-bg-opacity, 1)" }), "var(--surface-1)")
  assert.equal(fn({ opacityValue: "0.5" }), "color-mix(in oklab, var(--surface-1) calc(0.5 * 100%), transparent)")
})

test("preset maps shadows, radii, fonts, type, easing and layout", () => {
  for (const key of ["elev-1", "elev-2", "elev-3", "elev-inset", "drop-1", "drop-2", "drop-3"]) assert.ok(ext.boxShadow[key], key)
  for (const key of ["card", "input", "pill"]) assert.ok(ext.borderRadius[key], key)
  assert.ok(ext.fontFamily.sans && ext.fontFamily.mono)
  for (const key of ["caption", "body", "lead", "sub", "h3", "h2", "display"]) assert.ok(ext.fontSize[key], key)
  for (const key of ["out", "in-out", "drawer"]) assert.ok(ext.transitionTimingFunction[key], key)
  assert.equal(ext.maxWidth.layout, "var(--layout-max)")
  assert.equal(ext.spacing.gutter, "var(--layout-gutter)")
})

test("preset exposes theauth parity tokens", () => {
  for (const key of ["0", "1", "2"]) assert.ok(ext.colors.face[key], `face.${key}`)
  for (const key of ["1", "2"]) assert.ok(ext.colors.floor[key], `floor.${key}`)
  for (const key of ["DEFAULT", "top", "bottom", "white-top", "white-bottom", "foreground"]) assert.ok(ext.colors.key[key], `key.${key}`)
  assert.equal(ext.colors.key.top({}), "var(--key-top)")
  assert.equal(ext.colors.well({}), "var(--well)")
  assert.equal(ext.boxShadow["drop-hover"], "var(--drop-hover)")
  for (const key of ["hl", "hl-top", "hl-strong"]) assert.ok(ext.boxShadow[key], key)
  assert.equal(ext.backgroundImage.grain, "var(--grain)")
  assert.equal(ext.backgroundImage["glow-top"], "var(--glow-top)")
  assert.equal(ext.backgroundImage["ring-hot"], "var(--ring-hot)")
  for (const n of [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 30]) assert.equal(ext.spacing[`s-${n}`], `var(--s-${n})`)
  assert.equal(ext.spacing.nav, "var(--layout-nav-h)")
})

test("theme.css defines the parity tokens in light and dark", async () => {
  const { readFileSync } = await import("node:fs")
  const css = readFileSync(require.resolve("@glinui/tokens/theme.css"), "utf8")
  const darkIdx = css.indexOf('\n.dark,\n[data-glin-theme="dark"] {')
  const light = css.slice(0, darkIdx)
  const dark = css.slice(darkIdx)
  for (const name of ["--floor-1", "--floor-2", "--ring-hot", "--drop-hover", "--hl", "--key-top", "--key-bottom", "--key-white-top", "--key-foreground", "--glow-a"]) {
    assert.ok(light.includes(`${name}:`), `light ${name}`)
    assert.ok(dark.includes(`${name}:`), `dark ${name}`)
  }
  for (const name of ["--grain", "--glow-top", "--face-0", "--s-30", "--obsidian", "--violet", "--teal"]) assert.ok(css.includes(`${name}:`), name)
  for (const prop of ["--face", "--key-top", "--key-bottom"]) assert.match(css, new RegExp(`@property ${prop} \\{ syntax: "<color>"`))
})

test("utilities.css ships the signature classes inside a layer", async () => {
  const { readFileSync } = await import("node:fs")
  const css = readFileSync(require.resolve("@glinui/tokens/utilities.css"), "utf8")
  assert.match(css, /@layer glinui-utilities/)
  for (const cls of [".lift", ".lift-1", ".lift-3", ".face-2", ".ring-hot", ".ring-brand", ".well", ".hairline-top", ".floor-1", ".grain-glow", ".grain-glow-hover", ".key", ".key-white", ".focus-ring", ".skip-link", ".sticky-below-nav", ".lift-hover", ".press", ".eyebrow"]) {
    assert.ok(css.includes(`${cls} `) || css.includes(`${cls},`) || css.includes(`${cls}:`) || css.includes(`${cls}[`) || css.includes(`${cls}::`), cls)
  }
  assert.match(css, /prefers-reduced-motion: reduce/)
  assert.match(css, /prefers-reduced-transparency: reduce/)
})

test("docs config keeps legacy keys alongside the preset", async () => {
  const { readFileSync } = await import("node:fs")
  const src = readFileSync("tailwind.config.ts", "utf8")
  assert.match(src, /presets: \[glinPreset\]/)
  for (const key of ["soft:", "elevated:", "glass:", "standard:", "emphasize:", "fast:"]) assert.ok(src.includes(key), key)
})
