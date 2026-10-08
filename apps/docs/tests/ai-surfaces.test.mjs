import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const read = (p) => readFileSync(join(root, p), "utf8")
const DASH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`)

test("hero frame has Preview and Code tabs only, no Prompt tab or panel", () => {
  const frame = read("src/components/docs/preview-frame.tsx")
  assert.match(frame, /label: "Preview"/)
  assert.match(frame, /label: "Code"/)
  assert.doesNotMatch(frame, /label: "Prompt"|panel-prompt|Copy prompt/)
  assert.match(frame, /InstallChip/)
  assert.match(frame, /BackgroundSwitcher/)
  assert.match(frame, /StageContainerProvider/)
})

test("component layout uses AiCopyMenu and a fixed-width placeholder", () => {
  const layout = read("src/components/docs/component-doc-layout.tsx")
  assert.match(layout, /<AiCopyMenu/)
  assert.match(layout, /Edit on GitHub/)
  assert.match(layout, /w-\[9\.5rem\]/)
  assert.doesNotMatch(layout, /Copy prompt for AI|label="Copy Markdown"/)
  assert.match(read("src/components/ai/use-markdown-url.ts"), /window\.location\.origin/)
})

test("gallery and hub cards use AiCopyButton, landing shows the split button", () => {
  assert.match(read("src/components/gallery/gallery-card.tsx"), /<AiCopyButton/)
  const hub = read("src/components/hub/animation-card.tsx")
  assert.match(hub, /<AiCopyButton/)
  assert.doesNotMatch(hub, /Copy prompt/)
  const landing = read("src/components/home/ai-docs.tsx")
  assert.match(landing, /AiMenuPreview/)
  assert.match(landing, /Works with Claude, ChatGPT, Codex, Gemini, Grok, Cursor and more/)
  assert.match(landing, /href="\/docs\/ai"/)
  assert.doesNotMatch(landing, /TabsTrigger|value="prompt"/)
  assert.doesNotMatch(landing, DASH)
})

test("/docs/ai and /docs/variants are registered in every nav surface", () => {
  assert.match(read("src/components/layout/docs-sidebar.tsx"), /href: "\/docs\/ai", label: "AI-ready docs"/)
  assert.match(read("src/components/layout/docs-sidebar.tsx"), /href: "\/docs\/variants", label: "Variants"/)
  assert.match(read("src/components/layout/docs-shell.tsx"), /href: "\/docs\/ai", label: "AI-ready docs"/)
  assert.match(read("src/components/layout/docs-shell.tsx"), /href: "\/docs\/variants", label: "Variants"/)
  const palette = read("src/components/layout/command-palette.tsx")
  assert.match(palette, /href: "\/docs\/ai"/)
  assert.match(palette, /href: "\/docs\/variants"/)
  const sitemap = read("src/app/sitemap.ts")
  assert.match(sitemap, /route: "\/docs\/ai"/)
  assert.match(sitemap, /route: "\/docs\/variants"/)
  assert.match(read("src/components/layout/site-footer.tsx"), /href: "\/docs\/ai", label: "AI-ready docs"/)
})
