import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (p) => readFileSync(join(process.cwd(), p), "utf8")

test("variants page exists and renders the matrix sections", () => {
  assert.ok(existsSync(join(process.cwd(), "src/app/docs/variants/page.tsx")))
  const page = read("src/app/docs/variants/page.tsx")
  assert.match(page, /path: "\/docs\/variants"/)
  for (const id of ["vocabulary", "styles", "matrix", "button", "badge", "card", "alert", "theme-scope", "pick"]) {
    assert.ok(page.includes(`id="${id}"`), id)
  }
})

test("VariantMatrix collapses an empty tone list to one untoned column", () => {
  const utils = read("src/components/variants/matrix-utils.ts")
  assert.match(utils, /tones\.length > 0 \? tones : \[undefined\]/)
  const matrix = read("src/components/variants/variant-matrix.tsx")
  assert.match(matrix, /matrixColumns\(tones\)/)
  assert.match(matrix, /tones = \[\]/)
})

test("stage backdrops map to theme scopes", () => {
  const src = read("src/components/docs/preview-backdrops.tsx")
  assert.match(src, /case "light":\s*return \{ "data-glin-theme": "light", "data-glass-luminance": "bright" \}/)
  assert.match(src, /case "dark":\s*return \{ "data-glin-theme": "dark", "data-glass-luminance": "dim" \}/)
  assert.match(src, /Preview on dark background/)
  assert.match(read("src/components/docs/preview-frame.tsx"), /\{\.\.\.backdropScope\(bg\)\}/)
  assert.match(read("src/components/docs/example-block.tsx"), /\{\.\.\.backdropScope\(previewBg\)\}/)
})

test("variants files avoid dashes and inline styles", () => {
  for (const f of [
    "src/app/docs/variants/page.tsx",
    "src/components/variants/variant-matrix.tsx",
    "src/components/variants/variant-demos.tsx",
    "src/components/variants/matrix-utils.ts"
  ]) {
    const text = read(f)
    assert.doesNotMatch(text, /[–—]/, f)
    assert.doesNotMatch(text, /style=\{/, f)
  }
})
