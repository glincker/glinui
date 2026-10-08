import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()
const read = (p) => readFileSync(join(root, p), "utf8")
const DASH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`)

execFileSync("node", ["scripts/generate-ai-docs.mjs"], { cwd: root, stdio: "pipe" })

const { AI_TARGETS, resolveAiAction, aiTargetHint } = await import(join(root, "src/lib/ai-targets.ts"))
const { buildShortAiPrompt, buildAiPrompt, buildMarkdownUrl } = await import(join(root, "src/lib/ai-prompt.ts"))

function ids(exportName) {
  const block = read("src/lib/primitives.ts").match(new RegExp(`export const ${exportName} = \\[([\\s\\S]*?)\\]`))?.[1] ?? ""
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1])
}

test("generator writes a markdown page per primitive and signature id", () => {
  const all = [...ids("primitiveComponentIds"), ...ids("signatureComponentIds")]
  assert.ok(all.length >= 100)
  for (const id of all) assert.ok(existsSync(join(root, "public/md", `${id}.md`)), `missing md for ${id}`)
})

test("each page has install and import lines and no em or en dashes", () => {
  const files = readdirSync(join(root, "public/md")).filter((f) => f.endsWith(".md"))
  assert.ok(files.length >= 142)
  for (const f of files) {
    const text = read(`public/md/${f}`)
    assert.match(text, /## Install/, f)
    assert.match(text, /npx shadcn@latest add https?:\/\/[^\s]+\/r\/[a-z0-9-]+\.json/, f)
    assert.match(text, /^import \{ [^}]+ \} from "[^"]+"$/m, f)
    assert.doesNotMatch(text, DASH, `${f} has a dash`)
  }
})

test("llms.txt lists every page and llms-full.txt carries a size note", () => {
  const index = read("public/llms.txt")
  const files = readdirSync(join(root, "public/md")).filter((f) => f.endsWith(".md"))
  for (const f of files) assert.ok(index.includes(`/md/${f})`), `llms.txt misses ${f}`)
  assert.match(index, /^# GLINUI/)
  const full = read("public/llms-full.txt")
  assert.match(full, /Size: about \d+ KB/)
  assert.doesNotMatch(index + full, DASH)
})

test("short prompt stays small and points at the markdown url", () => {
  const url = buildMarkdownUrl("glass-card", "https://glinui.com/")
  assert.equal(url, "https://glinui.com/md/glass-card.md")
  const short = buildShortAiPrompt({ title: "Glass Card", id: "glass-card", markdownUrl: url })
  assert.ok(short.length < 400, `short prompt is ${short.length} chars`)
  assert.ok(short.includes(url))
  assert.doesNotMatch(short, DASH)
})

test("full prompt keeps old shape and adds variants, attribution and markdown link", () => {
  const input = { title: "T", id: "t", registryCommand: "r", packageCommand: "p", importPath: "@glinui/ui", exampleCode: "<T />" }
  const base = buildAiPrompt(input)
  assert.match(base, /Install \(pick one\)/)
  assert.match(base, /solid, soft, outline, ghost, gradient, glass/)
  const rich = buildAiPrompt({ ...input, markdownUrl: "https://x.test/md/t.md", attribution: "Adapted from Foo (MIT)" })
  assert.match(rich, /Adapted from Foo/)
  assert.match(rich, /Full reference: https:\/\/x\.test\/md\/t\.md/)
})

test("ai targets: valid urls, safe encoding, fallback and no user data", () => {
  assert.ok(AI_TARGETS.length >= 10)
  const probe = 'Read https://glinui.com/md/a.md & "quote" #hash ?x=1 and implement'
  for (const t of AI_TARGETS) {
    assert.ok(t.label && t.docsUrl.startsWith("https://"), t.id)
    assert.ok(["prefill", "copy-then-open"].includes(t.mode), t.id)
    const url = t.buildUrl(probe)
    if (t.mode === "prefill") {
      assert.ok(url, `${t.id} should build a url`)
      const parsed = new URL(url)
      assert.ok(parsed.protocol === "https:" || parsed.protocol === "cursor:", t.id)
      assert.ok([...parsed.searchParams.values()].includes(probe), `${t.id} round-trips the prompt`)
      assert.equal(parsed.hash, "", `${t.id} leaks into hash`)
      assert.ok(url.length <= t.maxUrlLength)
      const long = "x".repeat(t.maxUrlLength + 10)
      assert.equal(resolveAiAction(t, long).kind, "copy-then-open", `${t.id} falls back`)
      assert.equal(resolveAiAction(t, probe).kind, "prefill")
    } else {
      assert.equal(url, null, t.id)
      assert.equal(resolveAiAction(t, probe).kind, "copy-then-open")
    }
    assert.ok(["prefilled", "copies prompt"].includes(aiTargetHint(t)))
  }
  const ids = AI_TARGETS.map((t) => t.id)
  assert.equal(new Set(ids).size, ids.length)
  const cursor = AI_TARGETS.find((t) => t.id === "cursor")
  assert.ok(cursor.buildUrl("hi").startsWith("https://cursor.com/link/prompt?text="))
  assert.equal(AI_TARGETS.find((t) => t.id === "codex").cliSnippet("it's"), "codex 'it'\\''s'")
  assert.equal(AI_TARGETS.find((t) => t.id === "any").openUrl, null)
})

test("AI component sources: no inline style, BrandIcon, Phosphor only, under 500 lines, no dashes", () => {
  const dir = join(root, "src/components/ai")
  for (const f of readdirSync(dir)) {
    const src = read(`src/components/ai/${f}`)
    assert.doesNotMatch(src, /\sstyle=/, `${f} uses style=`)
    assert.doesNotMatch(src, DASH, `${f} has a dash`)
    assert.ok(src.split("\n").length < 500, f)
    assert.doesNotMatch(src, /from "(lucide-react|react-icons|@heroicons)/, f)
  }
  assert.match(read("src/components/ai/ai-copy-menu.tsx"), /BrandIcon[^\n]*variant="mono"/)
  assert.match(read("src/components/ai/ai-copy-menu.tsx"), /DropdownMenu/)
  for (const label of ["Copy for AI", "Copy prompt", "Copy as Markdown", "View as Markdown", "View prompt", "Open in"]) {
    assert.ok(read("src/components/ai/ai-copy-menu.tsx").includes(label), label)
  }
  assert.match(read("src/components/ai/use-ai-actions.ts"), /noopener/)
  const page = read("src/app/docs/ai/page.tsx")
  assert.match(page, /createDocsMetadata/)
  assert.doesNotMatch(page, DASH)
})

test("every markdown page has a real fenced usage example and real accessibility notes", () => {
  const files = readdirSync(join(root, "public/md")).filter((f) => f.endsWith(".md"))
  for (const f of files) {
    const text = read(`public/md/${f}`)
    const usage = text.split("## Usage")[1]?.split(/\n## /)[0] ?? ""
    assert.match(usage, /```tsx\n[\s\S]+?\n```/, `${f} has no usage code`)
    assert.doesNotMatch(usage, /Check the props table for required props/, `${f} uses the skeleton usage`)
    assert.doesNotMatch(text, /Keyboard operable with a visible focus ring\. Keep labels/, `${f} uses the generic a11y line`)
  }
})

test("docs data loader evaluates the docs data quickly without JSX or components", async () => {
  const { createDocsLoader } = await import(join(root, "scripts/docs-data-loader.mjs"))
  const started = Date.now()
  const loader = createDocsLoader()
  const docs = loader.docs()
  assert.ok(Object.keys(docs).length >= 80)
  assert.ok(Date.now() - started < 20000)
  const button = docs.button
  assert.ok(button.examples[0].code.includes("Button"))
  assert.ok(button.accessibility.summary.length > 0)
})
