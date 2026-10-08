import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const roadmap = readFileSync(join(root, "src/lib/roadmap.ts"), "utf8")
const changelog = readFileSync(join(root, "src/lib/changelog.ts"), "utf8")

test("roadmap has unique ids and every status is used", () => {
  const ids = [...roadmap.matchAll(/^\s+id: "([a-z0-9-]+)",\n\s+title/gm)].map((m) => m[1])
  assert.ok(ids.length >= 8)
  assert.equal(new Set(ids).size, ids.length)
  for (const status of ["now", "next", "later"]) assert.ok(roadmap.includes(`status: "${status}"`), status)
})

test("roadmap has no dates and no dashes", () => {
  assert.ok(!/\b20\d\d-\d\d-\d\d\b/.test(roadmap))
  assert.ok(!/[–—]/.test(roadmap + changelog))
})

test("internal roadmap links resolve to routes", () => {
  for (const m of roadmap.matchAll(/href: "(\/[^"#]*)"/g)) {
    const rel = m[1].replace(/^\//, "")
    assert.ok(existsSync(join(root, "src/app", rel, "page.tsx")), m[1])
  }
})

test("changelog covers the five packages that exist", () => {
  for (const dir of ["ui", "tokens", "cli", "registry", "motion"]) {
    assert.ok(changelog.includes(`packages/${dir}`), dir)
    assert.ok(existsSync(join(root, "../../packages", dir, "package.json")), dir)
  }
})

test("new route pages exist", () => {
  for (const p of ["docs/blocks", "gallery", "roadmap", "changelog"]) assert.ok(existsSync(join(root, "src/app", p, "page.tsx")), p)
})
