import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (p) => readFileSync(join(process.cwd(), p), "utf8")

test("docs topbar exposes the Customize trigger and keeps existing controls", () => {
  const topbar = read("src/components/layout/docs-topbar.tsx")
  assert.match(topbar, /CustomizeTrigger/)
  assert.match(topbar, /Open command palette/)
  assert.match(topbar, /Open GitHub/)
  const trigger = read("src/components/customize/customize-trigger.tsx")
  assert.match(trigger, /aria-label="Customize"/)
  assert.match(trigger, /CustomizePanel/)
})

test("root layout mounts GlinProvider and the pre-paint script", () => {
  const layout = read("src/app/layout.tsx")
  assert.match(layout, /getGlinConfigScript\(DOCS_OPTIONS_KEY\)/)
  assert.match(layout, /<DocsGlinProvider>/)
  assert.match(layout, /preferences\.css/)
  const provider = read("src/components/customize/docs-glin-provider.tsx")
  assert.match(provider, /glin-docs-options/)
  assert.match(provider, /target="document"/)
})

test("customize panel has every control group and export", () => {
  const panel = read("src/components/customize/customize-panel.tsx")
  for (const label of ["Theme", "Accent", "Radius", "Motion", "Animation engine", "Icon weight", "Design style", "Reset", "AI prompt"]) {
    assert.ok(panel.includes(label), `missing ${label}`)
  }
  assert.doesNotMatch(panel, /style=\{/)
  const seg = read("src/components/customize/segmented.tsx")
  assert.match(seg, /role="radiogroup"/)
})

test("topbar has the quick animations toggle wired to the shared provider", () => {
  const topbar = read("src/components/layout/docs-topbar.tsx")
  assert.match(topbar, /AnimationsToggle/)
  const toggle = read("src/components/customize/animations-toggle.tsx")
  assert.match(toggle, /aria-pressed/)
  assert.match(toggle, /Animations on/)
  assert.match(toggle, /Animations off/)
  assert.match(toggle, /useGlinConfig/)
  assert.match(toggle, /LightningSlash/)
})

test("docs provider registers the opt-in engines and the panel exports mention them", () => {
  assert.match(read("src/components/customize/docs-glin-provider.tsx"), /register-engines/)
  const exp = read("src/components/customize/export-config.ts")
  assert.match(exp, /@glinui\/motion\/register/)
})

test("customize panel exposes the Design style control with three styles", () => {
  const panel = readFileSync(join(process.cwd(), "src/components/customize/customize-panel.tsx"), "utf8")
  assert.match(panel, /label="Design style"/)
  for (const label of ["Glinr", "Minimal (plain)", "Glass"]) assert.ok(panel.includes(label), label)
  const exportsSrc = readFileSync(join(process.cwd(), "src/components/customize/export-config.ts"), "utf8")
  assert.match(exportsSrc, /key !== "surface"/)
})
