import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

function read(relativePath) {
  return readFileSync(join(process.cwd(), relativePath), "utf8")
}

for (const [route, label] of [
  ["animations", "Animations"],
  ["colors", "Colors"]
]) {
  test(`${route} hub route exists and is wired into sitemap, sidebar, and topbar`, () => {
    const pagePath = `src/app/docs/${route}/page.tsx`
    assert.ok(existsSync(join(process.cwd(), pagePath)))
    assert.match(read(pagePath), new RegExp(`path: "/docs/${route}"`))
    assert.match(read("src/app/sitemap.ts"), new RegExp(`route: "/docs/${route}"`))
    assert.match(read("src/components/layout/docs-sidebar.tsx"), new RegExp(`href: "/docs/${route}", label: "${label}"`))
    assert.match(read("src/components/layout/docs-topbar.tsx"), new RegExp(`href: "/docs/${route}", label: "${label}"`))
  })
}

test("hub components avoid inline styles, any, and dashes", () => {
  for (const file of [
    "src/components/hub/animation-card.tsx",
    "src/components/hub/color-ramp.tsx",
    "src/components/hub/color-sample-ui.tsx",
    "src/lib/oklch.ts"
  ]) {
    const source = read(file)
    assert.doesNotMatch(source, /style=\{/)
    assert.doesNotMatch(source, /: any\b/)
    assert.doesNotMatch(source, /[\u2013\u2014]/)
  }
})
