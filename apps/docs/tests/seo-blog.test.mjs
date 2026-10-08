import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const read = (path) => readFileSync(join(root, path), "utf8")
const posts = readdirSync(join(root, "src/content/blog")).filter((f) => f.endsWith(".mdx"))
const DASH = /[\u2013\u2014]/

function frontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  assert.ok(match, "post must start with frontmatter")
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(":")
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return data
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) walk(full, out)
    else if (/^page\.(tsx|mdx)$/.test(entry.name)) out.push(full)
  }
  return out
}

test("blog posts have complete frontmatter, no dashes, and valid dates", () => {
  assert.ok(posts.length >= 1)
  for (const file of posts) {
    const source = read(`src/content/blog/${file}`)
    const data = frontmatter(source)
    for (const key of ["title", "description", "date", "author", "tags"]) assert.ok(data[key], `${file} missing ${key}`)
    assert.match(data.date, /^\d{4}-\d{2}-\d{2}$/)
    assert.ok(data.description.length >= 50 && data.description.length <= 200, `${file} description length`)
    assert.ok(!DASH.test(source), `${file} contains an em or en dash`)
    assert.ok(!/^# /m.test(source.replace(/```[\s\S]*?```/g, "")), `${file} body must not add an h1`)
  }
})

test("sitemap covers blog, legal pages and every key hub", () => {
  const sitemap = read("src/app/sitemap.ts")
  for (const route of ["/", "/docs", "/docs/colors", "/docs/tokens", "/docs/engines", "/docs/variants", "/docs/ai", "/docs/attribution", "/docs/free-forever"]) {
    assert.ok(sitemap.includes(`route: "${route}"`), `sitemap missing ${route}`)
  }
  assert.match(sitemap, /getAllPosts/)
  assert.match(sitemap, /\/blog\/\$\{post\.slug\}/)
  assert.match(sitemap, /"\/privacy", "\/terms"/)
})

test("every static page exposes metadata with a title and description", () => {
  const missing = []
  for (const file of walk(join(root, "src/app"))) {
    const source = readFileSync(file, "utf8")
    if (/index: false/.test(source)) continue // noindex redirect routes
    if (file.includes("[")) {
      if (!/generateMetadata|createDocsMetadata/.test(source)) missing.push(file)
      continue
    }
    if (!/createDocsMetadata\(|export const metadata|generateMetadata/.test(source)) missing.push(file)
  }
  assert.deepEqual(missing.map((f) => f.replace(root, "")), [])
  for (const page of ["src/app/blog/page.tsx", "src/app/privacy/page.tsx", "src/app/terms/page.tsx"]) {
    const source = read(page)
    assert.match(source, /title:/)
    assert.match(source, /description:/)
  }
})

test("llms.txt links resolve to a generated file or a route", () => {
  const llms = read("public/llms.txt")
  const urls = [...llms.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => new URL(m[1]))
  assert.ok(urls.length > 100)
  assert.match(llms, /^## Blog$/m)
  assert.match(llms, /^## Optional$/m)
  const seen = new Set()
  for (const url of urls) {
    assert.ok(!seen.has(url.href), `duplicate ${url.href}`)
    seen.add(url.href)
    const path = url.pathname
    let ok = false
    if (path.startsWith("/md/") || path === "/llms-full.txt") ok = existsSync(join(root, "public", path))
    else if (path === "/sitemap.xml") ok = existsSync(join(root, "src/app/sitemap.ts"))
    else if (path === "/blog/rss.xml") ok = existsSync(join(root, "src/app/blog/rss.xml/route.ts"))
    else if (path.startsWith("/blog/")) ok = existsSync(join(root, "src/content/blog", `${path.slice(6)}.mdx`))
    else ok = ["page.tsx", "page.mdx"].some((f) => existsSync(join(root, "src/app", path, f)))
    assert.ok(ok, `llms.txt link does not resolve: ${url.href}`)
  }
})

test("social image is generated at build time and the old static image is gone", () => {
  assert.ok(existsSync(join(root, "src/app/og.png/route.tsx")))
  assert.match(read("src/app/og.png/route.tsx"), /force-static/)
  assert.ok(!existsSync(join(root, "src/app/opengraph-image.png")))
  assert.match(read("src/lib/seo.ts"), /DEFAULT_OG_IMAGE_PATH = "\/og\.png"/)
})

test("robots allows AI crawlers and IndexNow key file matches its name", () => {
  const robots = read("src/app/robots.ts")
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot"]) assert.ok(robots.includes(bot))
  const keyFile = readdirSync(join(root, "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  assert.ok(keyFile)
  assert.equal(read(`public/${keyFile}`).trim(), keyFile.replace(".txt", ""))
  assert.ok(!/seo:ping|seo-ping/.test(read("package.json").match(/"(prebuild|build|predev|pretest|test)":[^\n]*/g)?.join("\n") ?? ""))
})
