import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const source = readFileSync(join(root, "src/lib/site-links.ts"), "utf8")

const REPO_URL = "https://github.com/GLINCKER/glinui"
const resolved = source.replace(/\$\{REPO_URL\}/g, REPO_URL)

function groups() {
  const out = []
  for (const m of resolved.matchAll(/export const (\w+Links): SiteLinkGroup = \{([\s\S]*?)\n\}/g)) {
    out.push({ name: m[1], hrefs: [...m[2].matchAll(/href: [`"]([^`"]+)[`"]/g)].map((x) => x[1]) })
  }
  return out
}

const allHrefs = [...resolved.matchAll(/href: [`"]([^`"]+)[`"]/g)].map((m) => m[1])
const deferredRoutes = new Set(["/blog/rss.xml"])

function routeExists(href) {
  const path = href.split("#")[0].split("?")[0]
  if (path === "/") return true
  if (deferredRoutes.has(path)) return true
  const rel = path.replace(/^\//, "")
  const app = join(root, "src/app", rel)
  if (["page.tsx", "page.mdx", "route.ts"].some((f) => existsSync(join(app, f)))) return true
  if (existsSync(join(root, "public", rel))) return true
  if (rel === "sitemap.xml") return existsSync(join(root, "src/app/sitemap.ts"))
  return false
}

test("found footer link groups", () => {
  assert.equal(groups().length, 4)
  assert.ok(allHrefs.length > 25)
})

test("every internal href resolves to a route or public file", () => {
  const missing = allHrefs.filter((h) => h.startsWith("/") && !routeExists(h))
  assert.deepEqual(missing, [])
})

test("no duplicate hrefs within a column", () => {
  for (const g of groups()) assert.equal(new Set(g.hrefs).size, g.hrefs.length, g.name)
})

test("external links are https", () => {
  for (const h of allHrefs) if (!h.startsWith("/")) assert.ok(h.startsWith("https://"), h)
})

test("no em or en dashes", () => {
  assert.ok(!/[–—]/.test(source))
  for (const f of ["site-footer", "footer-columns", "footer-ecosystem"]) {
    assert.ok(!/[–—]/.test(readFileSync(join(root, `src/components/layout/${f}.tsx`), "utf8")), f)
  }
})

test("footer points to the new routes and CONTRIBUTING.md", () => {
  for (const href of ["/docs/blocks", "/gallery", "/roadmap", "/changelog"]) assert.ok(allHrefs.includes(href), href)
  assert.ok(allHrefs.includes("https://github.com/glincker/glinui/blob/main/CONTRIBUTING.md") || resolved.includes("CONTRIBUTING_URL"))
  assert.ok(existsSync(join(root, "../../CONTRIBUTING.md")))
  assert.ok(allHrefs.includes("https://thegdsks.com"))
})

test("every ecosystem and community link has a known icon", () => {
  const keys = [...resolved.matchAll(/icon: "([a-z]+:[a-z]+)"/g)].map((m) => m[1])
  const eco = resolved.split("export const ecosystemLinks")[1].split("\n]\n")[0]
  const items = eco.split("\n").filter((l) => l.includes("href:"))
  assert.ok(items.length >= 6)
  for (const line of items) assert.match(line, /icon: "[a-z]+:[a-z]+"/, line)
  const community = resolved.split("export const communityLinks")[1].split("\n}\n")[0]
  for (const line of community.split("\n").filter((l) => l.includes("href:") && !l.includes("CONTRIBUTING_URL"))) assert.match(line, /icon: /, line)
  const brands = readFileSync(join(root, "src/components/brand/brands.ts"), "utf8")
  const own = readFileSync(join(root, "src/components/brand/own-logos.tsx"), "utf8")
  const footerIcon = readFileSync(join(root, "src/components/layout/footer-icon.tsx"), "utf8")
  for (const key of keys) {
    const [kind, name] = key.split(":")
    if (kind === "brand") assert.ok(brands.includes(`"${name}"`), key)
    if (kind === "own") assert.ok(own.includes(`${name}:`), key)
    if (kind === "ph") assert.ok(footerIcon.includes(`${name}:`), key)
  }
})
