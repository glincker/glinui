import assert from "node:assert/strict"
import { createRequire } from "node:module"
import test from "node:test"

const require = createRequire(import.meta.url)
const tailwind = require("tailwindcss")
const postcss = require("postcss")
const preset = require("@glinui/tokens/tailwind-preset")

const SAMPLE =
  "animate-in fade-in-0 zoom-in-95 slide-in-from-right slide-out-to-right data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=top]:slide-in-from-bottom-2 animate-accordion-down duration-200 fill-mode-forwards"

async function compile() {
  const result = await postcss([
    tailwind({ presets: [preset], content: [{ raw: SAMPLE }], corePlugins: { preflight: false } })
  ]).process("@tailwind utilities;", { from: undefined })
  return result.css
}

test("preset ships animation utilities without extra plugins", async () => {
  const css = await compile()
  assert.match(css, /@keyframes enter\b/)
  assert.match(css, /@keyframes exit\b/)
  assert.match(css, /@keyframes accordion-down\b/)
  assert.match(css, /\.animate-in\s*\{/)
  assert.match(css, /--tw-enter-opacity:\s*0/)
  assert.match(css, /--tw-enter-scale:\s*\.95/)
  assert.match(css, /--tw-enter-translate-x:\s*100%/)
  assert.match(css, /--tw-exit-translate-x:\s*100%/)
  assert.match(css, /--tw-exit-opacity:\s*0/)
  assert.match(css, /--tw-enter-translate-y:\s*0\.5rem/)
})

test("state variants wrap the animation utilities", async () => {
  const css = await compile()
  assert.ok(css.includes(".data-\\[state\\=open\\]\\:animate-in"), "open variant")
  assert.ok(css.includes(".data-\\[state\\=closed\\]\\:animate-out"), "closed variant")
  assert.ok(css.includes(".data-\\[state\\=closed\\]\\:fade-out-0"), "fade-out variant")
})

test("reduced motion neutralises movement and keeps opacity", async () => {
  const css = await compile()
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/)
  assert.match(css, /--tw-enter-scale:\s*initial !important/)
  assert.match(css, /--tw-enter-translate-x:\s*initial !important/)
})

test("duration and fill-mode feed animation variables", async () => {
  const css = await compile()
  assert.match(css, /--tw-duration:\s*200ms/)
  assert.match(css, /--tw-animation-fill-mode:\s*forwards/)
})
