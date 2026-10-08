import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const read = (path) => readFileSync(join(process.cwd(), path), "utf8")

function primitiveIds() {
  const source = read("src/lib/primitives.ts")
  const block = source.match(/primitiveComponentIds = \[([\s\S]*?)\] as const/)?.[1] ?? ""
  return [...block.matchAll(/"([a-z0-9-]+)"/g)].map((match) => match[1])
}

test("every primitive has a 301 from the legacy MDX path to its implementation route", () => {
  const redirects = read("public/_redirects")
  const ids = primitiveIds()
  assert.ok(ids.length > 0, "expected primitive ids to be parsed")

  for (const id of ids) {
    assert.ok(
      redirects.includes(`/docs/components/${id} /docs/components/radix/${id} 301`),
      `public/_redirects should redirect /docs/components/${id}`
    )
  }
})
