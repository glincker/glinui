import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

function walk(dir) {
  const entries = readdirSync(dir)
  let files = []
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      files = files.concat(walk(fullPath))
      continue
    }
    files.push(fullPath)
  }
  return files
}

test("component MDX pages keep required docs sections", () => {
  const componentsDir = join(process.cwd(), "src/app/docs/components")
  const mdxFiles = walk(componentsDir)
    .filter((file) => file.endsWith("page.mdx"))
    .sort()

  const requiredTokens = [
    "## Installation",
    "## Usage",
    "## Accessibility",
    "## Reduced Motion",
    "## API Reference",
    "## Source"
  ]

  for (const file of mdxFiles) {
    const source = readFileSync(file, "utf8")

    assert.match(source, /<(InstallTabs|ComponentInstall)/, `${file} should include an install block`)

    for (const token of requiredTokens) {
      assert.match(
        source,
        new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        `${file} should include ${token}`
      )
    }
  }
})

function primitiveIds() {
  const source = readFileSync(join(process.cwd(), "src/lib/primitives.ts"), "utf8")
  const block = source.match(/primitiveComponentIds = \[([\s\S]*?)\] as const/)?.[1] ?? ""
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1])
}

test("primitive docs are data driven and no legacy MDX duplicates remain", () => {
  const ids = primitiveIds()
  assert.ok(ids.length >= 39, "expected at least the original 39 primitives")

  for (const id of ids) {
    assert.ok(
      !existsSync(join(process.cwd(), `src/app/docs/components/${id}/page.mdx`)),
      `legacy MDX for ${id} should be retired`
    )
  }
})

test("data-driven component page keeps required docs sections", () => {
  const page = readFileSync(join(process.cwd(), "src/components/docs/component-doc-page.tsx"), "utf8")

  assert.match(page, /<(InstallTabs|InstallSourceBlock)/, "page should include an install block")

  for (const heading of ["Installation", "Usage", "Accessibility", "Reduced Motion", "API Reference", "Source"]) {
    assert.match(page, new RegExp(`>${heading}</h2>`), `page should render ${heading}`)
  }
})

test("every primitive has componentDocs data for each required section", () => {
  const docsDir = join(process.cwd(), "src/lib/new-components")
  const docs = [
    readFileSync(join(process.cwd(), "src/lib/component-docs.tsx"), "utf8"),
    ...readdirSync(docsDir)
      .filter((file) => /\.tsx$/.test(file))
      .map((file) => readFileSync(join(docsDir, file), "utf8"))
  ].join("\n")

  for (const id of primitiveIds()) {
    const key = new RegExp(`^  "?${id}"?: \\{$`, "m")
    const start = docs.search(key)
    assert.ok(start >= 0, `componentDocs should define ${id}`)
    const next = docs.slice(start + 1).search(/^  "?[a-z-]+"?: \{$/m)
    const block = docs.slice(start, next < 0 ? undefined : start + 1 + next)

    assert.match(block, /accessibility: \{/, `${id} should define accessibility`)
    assert.match(block, /reducedMotion: (\{|[A-Za-z_]\w*,)/, `${id} should define reducedMotion`)
    assert.match(block, /examples: \[/, `${id} should define examples`)
    assert.match(block, /props: /, `${id} should define props`)
  }
})
