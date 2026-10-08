#!/usr/bin/env node
/**
 * Generates AI-readable docs for static export:
 *   public/md/<id>.md   one markdown page per component
 *   public/llms.txt     index following the llms.txt convention
 *   public/llms-full.txt  every page concatenated
 *
 * Inputs: public/r/items/*.json (registry sources), src/lib/generated-registry-metadata.ts,
 * src/lib/generated-api-metadata.ts, src/lib/taxonomy.ts and the docs example data
 * (evaluated by scripts/docs-data-loader.mjs, with an MDX fallback for signature pages).
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { createDocsLoader } from "./docs-data-loader.mjs"

const docsRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const lib = join(docsRoot, "src", "lib")
const publicDir = join(docsRoot, "public")
const mdDir = join(publicDir, "md")

const EM = String.fromCharCode(0x2014)
const EN = String.fromCharCode(0x2013)
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://glinui.com").replace(/\/+$/, "")

/** Output must never contain em or en dashes. */
function clean(text) {
  return String(text).replaceAll(` ${EM} `, ", ").replaceAll(EM, ", ").replaceAll(` ${EN} `, " to ").replaceAll(EN, "-")
}

function read(path) {
  return readFileSync(path, "utf8")
}

function sliceJson(source, startMarker, open, close) {
  const start = source.indexOf(startMarker)
  if (start < 0) throw new Error(`marker not found: ${startMarker}`)
  const from = source.indexOf(open, start)
  let depth = 0
  let inString = false
  for (let i = from; i < source.length; i += 1) {
    const ch = source[i]
    if (inString) {
      if (ch === "\\") i += 1
      else if (ch === '"') inString = false
    } else if (ch === '"') inString = true
    else if (ch === open) depth += 1
    else if (ch === close) {
      depth -= 1
      if (depth === 0) return JSON.parse(source.slice(from, i + 1))
    }
  }
  throw new Error(`unterminated block: ${startMarker}`)
}

/** Blog posts from src/content/blog/*.mdx (single-line frontmatter), newest first. */
function loadBlogPosts() {
  const dir = join(docsRoot, "src", "content", "blog")
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(join(dir, f)))
      const data = {}
      for (const line of (match?.[1] ?? "").split(/\r?\n/)) {
        const i = line.indexOf(":")
        if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim()
      }
      return { slug: f.replace(/\.mdx$/, ""), title: clean(data.title ?? f), description: clean(data.description ?? ""), date: data.date ?? "" }
    })
    .sort((x, y) => (x.date < y.date ? 1 : -1))
}

// ---------- taxonomy (parsed as text) ----------
function loadTaxonomy() {
  const src = read(join(lib, "taxonomy.ts"))
  const categories = [...src.matchAll(/\{ id: "([a-z]+)", title: "([^"]+)", description: "([^"]+)", icon: "[^"]+", order: (\d+) \}/g)].map(
    (m) => ({ id: m[1], title: m[2], description: m[3], order: Number(m[4]) })
  )
  const byId = new Map()
  const order = []
  for (const m of src.matchAll(/(?:family|single)\("([a-z]+)",\s*(?:"[a-z0-9-]+",\s*)?(\[[^\]]*\]|"[a-z0-9-]+")\)/g)) {
    const ids = m[2].startsWith("[") ? [...m[2].matchAll(/"([a-z0-9-]+)"/g)].map((x) => x[1]) : [m[2].slice(1, -1)]
    for (const id of ids) {
      byId.set(id, m[1])
      order.push(id)
    }
  }
  return { categories: categories.sort((a, b) => a.order - b.order), byId, order }
}

// ---------- docs example data (evaluated, with MDX fallback) ----------
const MAX_EXAMPLES = 3
const MAX_CODE = 4000

function pushUnique(list, value, limit) {
  if (value && !list.includes(value) && list.length < limit) list.push(value)
}

/** Read the template literal that starts at `start` (a backtick) and return its cooked text, or null if it interpolates. */
function readTemplate(src, start) {
  let out = ""
  for (let i = start + 1; i < src.length; i += 1) {
    const ch = src[i]
    if (ch === "\\") {
      const next = src[i + 1] ?? ""
      out += next === "n" ? "\n" : next
      i += 1
    } else if (ch === "$" && src[i + 1] === "{") return null
    else if (ch === "`") return out
    else out += ch
  }
  return null
}

/** Signature pages still written as MDX: pull code={`...`} examples and the Accessibility bullets. */
function mdxHints(file, helpers = {}) {
  const src = read(file)
  const entry = { examples: [], accessibility: [], notes: [], keyboard: [], aria: [], reducedMotion: null }
  // Showcase helpers (S4Hero / S4Example) take their code from the generated demo example maps.
  for (const m of src.matchAll(/<S4(Hero|Example)\s+id="([^"]+)"(?:\s+index=\{(\d+)\})?/g)) {
    const code = helpers.s4?.[m[2]]?.[m[1] === "Hero" ? 0 : Number(m[3] ?? 0)]?.code
    if (typeof code === "string" && code.trim() && code.length < MAX_CODE) pushUnique(entry.examples, { title: null, description: null, code: code.trim() }, MAX_EXAMPLES)
  }
  for (const m of src.matchAll(/code=\{`/g)) {
    const code = readTemplate(src, m.index + m[0].length - 1)
    if (code && code.length < MAX_CODE) pushUnique(entry.examples, { title: null, description: null, code: code.trim() }, MAX_EXAMPLES)
  }
  const strip = (text) => text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  let heading = ""
  for (const raw of src.split("\n")) {
    const h = raw.match(/^\s*#{2,3} (.+?)\s*$/)
    if (h) {
      heading = h[1]
      continue
    }
    const line = raw.trim()
    if (!line || line.startsWith("<") || line.startsWith("{")) continue
    if (heading === "Accessibility") {
      const bullet = line.match(/^[-*] (.+)$/)
      pushUnique(entry.accessibility, strip(bullet ? bullet[1] : line), 8)
    } else if (heading === "Reduced Motion" && !entry.reducedMotion) entry.reducedMotion = strip(line)
  }
  return entry
}

function loadDocHints() {
  const hints = new Map()
  const loader = createDocsLoader()
  const docs = loader.docs()
  const extras = loader.extras()
  for (const [id, meta] of Object.entries(docs)) {
    const entry = { examples: [], accessibility: [], notes: [], keyboard: [], aria: [], reducedMotion: null }
    for (const ex of meta.examples ?? []) {
      if (typeof ex.code === "string" && ex.code.trim() && ex.code.length < MAX_CODE) {
        const code = ex.code.trim()
        if (!entry.examples.some((e) => e.code === code)) entry.examples.push({ title: ex.title ?? null, description: ex.description ?? null, code })
      }
    }
    entry.accessibility.push(...(meta.accessibility?.summary ?? []))
    entry.keyboard = (meta.accessibility?.keyboard ?? []).map((k) => ({ key: k.key, description: k.description }))
    entry.aria = meta.accessibility?.aria ?? []
    entry.notes = meta.notes ?? []
    entry.reducedMotion = meta.reducedMotion?.description ?? null
    hints.set(id, entry)
  }
  for (const [id, extra] of Object.entries(extras)) {
    const entry = hints.get(id) ?? { examples: [], accessibility: [], notes: [], keyboard: [], aria: [], reducedMotion: null }
    for (const ex of extra.examples ?? []) {
      if (ex.code && ex.code.trim() && ex.code.length < MAX_CODE && !entry.examples.some((e) => e.code === ex.code.trim())) {
        entry.examples.push({ title: ex.title ?? null, description: ex.description ?? null, code: ex.code.trim() })
      }
    }
    entry.accessibility.push(...(extra.accessibility ?? []))
    entry.notes.push(...(extra.notes ?? []))
    if (extra.reducedMotion) entry.reducedMotion = [entry.reducedMotion, extra.reducedMotion].filter(Boolean).join(" ")
    hints.set(id, entry)
  }
  // MDX fallback for ids that the evaluated data does not cover.
  const pagesDir = join(docsRoot, "src", "app", "docs", "components")
  const s4 = {}
  for (const name of ["s4-backgrounds", "s4-bg-extra", "s4-type"]) {
    try {
      const mod = loader.demo(name)
      Object.assign(s4, mod.bgExamples, mod.bgExtraExamples, mod.typeExamples)
    } catch (error) {
      console.warn(`[ai-docs] could not read ${name}: ${error.message}`)
    }
  }
  if (existsSync(pagesDir)) {
    for (const id of readdirSync(pagesDir)) {
      const mdx = join(pagesDir, id, "page.mdx")
      if (!existsSync(mdx)) continue
      const from = mdxHints(mdx, { s4 })
      const entry = hints.get(id) ?? { examples: [], accessibility: [], notes: [], keyboard: [], aria: [], reducedMotion: null }
      if (!entry.examples.length) entry.examples = from.examples
      if (!entry.accessibility.length) entry.accessibility = from.accessibility
      if (!entry.reducedMotion) entry.reducedMotion = from.reducedMotion
      hints.set(id, entry)
    }
  }
  return hints
}

// ---------- rendering ----------
function exportedNames(item) {
  const names = new Set()
  for (const file of item.files ?? []) {
    if (!/\.tsx?$/.test(file.path) || /test\./.test(file.path)) continue
    for (const m of file.content.matchAll(/export\s+(?:const|function|class)\s+([A-Z]\w*)/g)) names.add(m[1])
    for (const m of file.content.matchAll(/export\s*\{([^}]*)\}/g)) {
      for (const part of m[1].split(",")) {
        const name = part.trim().split(/\s+as\s+/).pop()
        if (name && /^[A-Z]\w*$/.test(name) && !/Variants$/.test(name)) names.add(name)
      }
    }
  }
  return [...names].filter((n) => !/(Props|Variants)$/.test(n))
}

function cell(value, max = 140) {
  const text = clean(String(value ?? "")).replace(/\|/g, "\\|").replace(/\s+/g, " ").trim()
  return text.length > max ? `${text.slice(0, max - 3)}...` : text
}

function propsSection(api) {
  if (!api || !api.propsTypes?.length) return null
  const lines = []
  for (const type of api.propsTypes) {
    if (!type.fields?.length) continue
    lines.push(`### ${type.name}`, "", "| Prop | Type | Default | Description |", "| --- | --- | --- | --- |")
    for (const f of type.fields) {
      lines.push(`| \`${f.name}${f.optional ? "?" : ""}\` | \`${cell(f.type, 110)}\` | ${f.defaultValue ? `\`${cell(f.defaultValue, 40)}\`` : ""} | ${cell(f.description ?? "")} |`)
    }
    lines.push("")
  }
  return lines.length ? lines.join("\n") : null
}

function variantList(api) {
  if (!api) return []
  const out = new Set()
  for (const type of api.propsTypes ?? []) {
    for (const f of type.fields ?? []) {
      if (f.name !== "variant") continue
      for (const m of String(f.type).matchAll(/\\"([a-z0-9-]+)\\"|"([a-z0-9-]+)"/g)) out.add(m[1] ?? m[2])
    }
  }
  return [...out]
}

function renderComponent({ meta, item, api, hints, category, tags }) {
  const id = meta.name
  const names = item ? exportedNames(item) : []
  const importLine = `import { ${(names.length ? names : [meta.title.replace(/\s+/g, "")]).slice(0, 8).join(", ")} } from "${meta.importPath}"`
  const out = []
  out.push(`# ${meta.title}`, "", `> ${meta.description}`, "")
  out.push(`- id: \`${id}\``, `- type: ${meta.type}`, `- category: ${category}`)
  if (tags.length) out.push(`- tags: ${tags.join(", ")}`)
  out.push(`- docs: ${SITE_URL}${meta.docsPath}`, `- markdown: ${SITE_URL}/md/${id}.md`, "")
  out.push("## Install", "", "Glin CLI (copies the source into your project):", "", "```bash", meta.install.registry, "```", "")
  out.push("shadcn CLI:", "", "```bash", `npx shadcn@latest add ${SITE_URL}/r/${id}.json`, "```", "")
  out.push("Package:", "", "```bash", meta.install.package, "```", "")
  out.push("## Import", "", "```tsx", importLine, "```", "")
  out.push("## Usage", "")
  const examples = (hints?.examples ?? []).slice(0, MAX_EXAMPLES)
  for (const note of hints?.notes ?? []) out.push(clean(note), "")
  if (examples.length) {
    examples.forEach((ex, i) => {
      if (i > 0 && ex.title) out.push(`### ${clean(ex.title)}`, "")
      if (ex.description) out.push(clean(ex.description), "")
      out.push("```tsx", clean(ex.code), "```", "")
    })
  } else {
    const root = names[0] ?? meta.title.replace(/\s+/g, "")
    out.push("```tsx", importLine, "", `export function Example() {`, `  return <${root} />`, `}`, "```", "", "Check the props table for required props and sub-components.", "")
  }
  const props = propsSection(api)
  if (props) out.push("## Props", "", props)
  const variants = variantList(api)
  out.push("## Tokens and variants", "")
  out.push("- Style with CSS variables from `@glinui/tokens` (for example `var(--color-border)`, `var(--color-accent)`, `var(--surface-1)`). Do not hardcode colors.")
  out.push("- Use Tailwind utility classes only. No inline style attributes.")
  out.push("- Use Phosphor icons (`@phosphor-icons/react`) for any icon.")
  out.push("- GLINUI variant vocabulary: solid, soft, outline, ghost, gradient, glass.")
  if (variants.length) out.push(`- Variants available on this component: ${variants.map((v) => `\`${v}\``).join(", ")}.`)
  out.push("")
  out.push("## Accessibility", "")
  const a11y = hints?.accessibility ?? []
  if (a11y.length) a11y.slice(0, 10).forEach((line) => out.push(`- ${clean(line)}`))
  else out.push("- Keyboard operable with a visible focus ring. Keep labels and descriptions intact when adapting the example.")
  if (hints?.keyboard?.length) {
    out.push("", "Keyboard:", "", "| Key | Action |", "| --- | --- |")
    for (const row of hints.keyboard) out.push(`| ${cell(row.key, 40)} | ${cell(row.description, 160)} |`)
  }
  if (hints?.aria?.length) out.push("", "ARIA:", "", ...hints.aria.slice(0, 8).map((line) => `- ${clean(line)}`))
  if (hints?.keyboard?.length || hints?.aria?.length) out.push("")
  out.push(hints?.reducedMotion ? `- Reduced motion: ${clean(hints.reducedMotion)}` : "- Motion honors `prefers-reduced-motion`. Animate only transform and opacity.", "")
  if (meta.provenance) {
    const p = meta.provenance
    out.push("## Provenance", "", `Adapted from ${p.sourceName} (${p.spdx}, ${p.copyright}). Upstream: ${p.upstreamComponentUrl ?? p.upstreamUrl}. Restyled to Glin tokens with accessibility and reduced motion review. Keep the attribution when you copy this component.`, "")
  }
  return clean(out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()) + "\n"
}

// ---------- main ----------
function main() {
  const registrySrc = read(join(lib, "generated-registry-metadata.ts"))
  const items = sliceJson(registrySrc, "export const generatedRegistryItems =", "[", "]")
  const apiSrc = read(join(lib, "generated-api-metadata.ts"))
  const apiMeta = sliceJson(apiSrc, "export const generatedApiMetadata =", "{", "}")
  const taxonomy = loadTaxonomy()
  const hints = loadDocHints()
  const itemsDir = join(publicDir, "r", "items")

  mkdirSync(mdDir, { recursive: true })

  const catTitle = new Map(taxonomy.categories.map((c) => [c.id, c.title]))
  const rendered = []
  for (const meta of items) {
    const itemPath = join(itemsDir, `${meta.name}.json`)
    const item = existsSync(itemPath) ? JSON.parse(read(itemPath)) : null
    const categoryId = taxonomy.byId.get(meta.name) ?? "motion"
    const tags = [meta.type, ...(meta.provenance ? ["adapted"] : [])]
    const text = renderComponent({
      meta,
      item,
      api: apiMeta[meta.name],
      hints: hints.get(meta.name),
      category: catTitle.get(categoryId) ?? categoryId,
      tags
    })
    writeFileSync(join(mdDir, `${meta.name}.md`), text)
    rendered.push({ meta, categoryId, text })
  }

  const keep = new Set(rendered.map((r) => `${r.meta.name}.md`))
  for (const f of readdirSync(mdDir)) if (!keep.has(f)) rmSync(join(mdDir, f), { force: true })

  const rank = new Map(taxonomy.order.map((id, i) => [id, i]))
  const idx = (id) => rank.get(id) ?? Number.MAX_SAFE_INTEGER
  const sections = taxonomy.categories
    .map((cat) => ({ cat, list: rendered.filter((r) => r.categoryId === cat.id).sort((a, b) => idx(a.meta.name) - idx(b.meta.name) || a.meta.name.localeCompare(b.meta.name)) }))
    .filter((s) => s.list.length)

  const u = (path) => `${SITE_URL}${path}`
  const llms = [
    "# Glin UI",
    "",
    `> Glin UI is a free, open-source design hub for the modern web: ${rendered.length} accessible React components, animations, OKLCH colors, design tokens and AI-ready docs. MIT licensed, Tailwind only, Phosphor icons, reduced-motion aware. Each component has a plain Markdown page for AI assistants.`,
    "",
    "Conventions for generated code: tokens from `@glinui/tokens`, Tailwind utilities only (no inline styles), Phosphor icons, honor `prefers-reduced-motion`, variants glinr, solid, plain, soft, outline, ghost, gradient and glass (opt-in). Install with `npx glinui add <id>` or `npx shadcn@latest add " + SITE_URL + "/r/<id>.json`.",
    "",
    "## Docs",
    "",
    `- [Getting started](${u("/docs/getting-started")}): install and setup`,
    `- [AI-ready docs](${u("/docs/ai")}): how to use these files and the Copy for AI button`,
    `- [Variants](${u("/docs/variants")}): the surface variant and tone vocabulary`,
    `- [Animation engines](${u("/docs/engines")}): CSS built in, motion and GSAP opt-in`,
    `- [Animations](${u("/docs/animations")}): the animation hub`,
    `- [Accessibility](${u("/docs/accessibility")}): keyboard, focus and screen reader practices`,
    `- [Full text](${u("/llms-full.txt")}): every component page in one file`,
    "",
    "## Tokens and Colors",
    "",
    `- [Design tokens](${u("/docs/tokens")}): colors, surfaces, elevation, type, radius and motion tokens`,
    `- [Colors](${u("/docs/colors")}): OKLCH color ramps and base colors`,
    `- [Color contrast](${u("/docs/color-contrast")}): AA contrast guidance`,
    ""
  ]
  for (const { cat, list } of sections) {
    llms.push(`## Components: ${cat.title}`, "")
    for (const r of list) llms.push(`- [${r.meta.title}](${u(`/md/${r.meta.name}.md`)}): ${clean(r.meta.description)}`)
    llms.push("")
  }
  const posts = loadBlogPosts()
  llms.push("## Blog", "")
  for (const post of posts) llms.push(`- [${post.title}](${u(`/blog/${post.slug}`)}): ${post.description}`)
  llms.push(`- [Blog index](${u("/blog")}): all posts, newest first`, "")
  llms.push(
    "## Optional",
    "",
    `- [Attribution](${u("/docs/attribution")}): credits for adapted components`,
    `- [Free forever pledge](${u("/docs/free-forever")}): the MIT license pledge`,
    `- [Privacy](${u("/privacy")}): what the site stores and loads`,
    `- [Terms](${u("/terms")}): terms for the site and code`,
    `- [Sitemap](${u("/sitemap.xml")}): every indexable URL`,
    `- [RSS feed](${u("/blog/rss.xml")}): blog updates`,
    ""
  )
  writeFileSync(join(publicDir, "llms.txt"), clean(llms.join("\n")).trimEnd() + "\n")

  const body = sections.flatMap((s) => s.list.map((r) => r.text)).join("\n---\n\n")
  const bytes = Buffer.byteLength(body)
  const header = `# GLINUI full documentation\n\n> ${rendered.length} components concatenated. Size: about ${Math.round(bytes / 1024)} KB (roughly ${Math.round(bytes / 4000)}k tokens). For one component, fetch ${SITE_URL}/md/<id>.md instead.\n\n---\n\n`
  writeFileSync(join(publicDir, "llms-full.txt"), header + body)
  console.log(`[ai-docs] wrote ${rendered.length} markdown pages, llms.txt, llms-full.txt (${Math.round(bytes / 1024)} KB)`)
}

main()
