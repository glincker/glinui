import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (p) => readFileSync(join(process.cwd(), p), "utf8")

const { BRANDS, BRAND_NAMES } = await import(join(process.cwd(), "src/components/brand/brands.ts"))
const { sanitizeBrandSvg } = await import(join(process.cwd(), "src/components/brand/brand-sanitize.ts"))

const thesvgDist = join(process.cwd(), "node_modules", "thesvg", "dist")

test("every brand slug resolves to a thesvg module", () => {
  assert.ok(BRAND_NAMES.length >= 25)
  for (const name of BRAND_NAMES) {
    assert.equal(BRANDS[name].slug, name)
    assert.ok(existsSync(join(thesvgDist, `${name}.js`)), `missing thesvg module: ${name}`)
    assert.match(BRANDS[name].url, /^https:\/\//)
  }
})

test("brand-modules statically imports each slug and never the thesvg barrel", () => {
  const src = read("src/components/brand/brand-modules.ts")
  for (const name of BRAND_NAMES) assert.match(src, new RegExp(`from "thesvg/${name}"`))
  assert.doesNotMatch(src, /from "thesvg"/)
  const all = ["brand-icon.tsx", "brand-tag.tsx", "compare-lockup.tsx", "brands.ts", "brand-sanitize.ts"]
  for (const f of all) assert.doesNotMatch(read(`src/components/brand/${f}`), /from "thesvg"/)
})

test("BrandIcon source has no inline style attribute or em/en dashes", () => {
  for (const f of ["brand-icon.tsx", "brand-tag.tsx", "compare-lockup.tsx", "brands.ts", "brand-modules.ts"]) {
    const src = read(`src/components/brand/${f}`)
    assert.doesNotMatch(src, /\sstyle=/, `${f} uses style=`)
    assert.doesNotMatch(src, new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`), `${f} has a dash`)
  }
})

test("sanitizer strips scripts, handlers, style attributes and external refs", () => {
  const dirty = `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" onload="x()" style="margin:3px" role="img">
    <title>x</title><script>alert(1)</script><foreignObject><div/></foreignObject>
    <image href="https://evil.test/a.png"/><a href="javascript:alert(1)"><path d="M0 0"/></a>
    <defs><linearGradient id="g"><stop offset="0"/></linearGradient></defs>
    <path onclick="x()" fill="url(#g)" d="M0 0h1" style="fill:red"/><use xlink:href="https://evil.test/#a"/></svg>`
  const out = sanitizeBrandSvg(dirty, { prefix: "bi-test-default" })
  assert.ok(out.startsWith("<svg"))
  assert.doesNotMatch(out, /<script|<foreignObject|<image|<title|<a[\s>]|onload|onclick|style=|javascript:|evil\.test|<\?xml/i)
  assert.match(out, /viewBox="0 0 10 10"/)
  assert.match(out, /id="bi-test-default-g"/)
  assert.match(out, /url\(#bi-test-default-g\)/)
  assert.match(out, /aria-hidden="true"/)
})

test("sanitizer rejects non-svg input and every shipped mark survives intact", async () => {
  assert.equal(sanitizeBrandSvg("<div>nope</div>", { prefix: "x" }), "")
  for (const name of BRAND_NAMES) {
    const mod = (await import(`thesvg/${name}`)).default
    const variants = { default: mod.svg, ...(mod.variants ?? {}) }
    delete variants.wordmark
    for (const [key, raw] of Object.entries(variants)) {
      const out = sanitizeBrandSvg(raw, { prefix: `bi-${name}-${key}` })
      assert.ok(out.startsWith("<svg"), `${name}/${key} not sanitized`)
      assert.match(out, /viewBox=/, `${name}/${key} lacks viewBox`)
      assert.doesNotMatch(out, /<script|\son[a-z]+=|\sstyle=|javascript:|<image|<foreignObject/i, `${name}/${key} unsafe`)
    }
  }
})

test("getting-started keeps its framework tab labels and logos", () => {
  const data = read("src/components/docs-pages/getting-started-data.ts")
  for (const label of ["Next.js", "Vite", "Remix / other", "Astro", "TanStack Start"]) {
    assert.ok(data.includes(`label: "${label}"`), `missing tab ${label}`)
  }
  assert.match(data, /createCommand: "npm create next-app@latest/)
  assert.match(data, /createCommand: "npm create vite@latest/)
  const setup = read("src/components/docs-pages/framework-setup.tsx")
  assert.match(setup, /role="tablist"/)
  assert.match(setup, /<BrandIcon name=\{s\.brand\}/)
  const frame = read("src/components/docs/code-surface-frame.tsx")
  assert.match(frame, /<BrandIcon name=\{pm\}/)
  assert.match(frame, /role="tablist" aria-label="Package manager"/)
  assert.match(read("src/components/brand/brands.ts"), /Brand marks belong to their owners/)
  assert.match(read("src/app/docs/getting-started/page.tsx"), /<StackRow \/>/)
})
