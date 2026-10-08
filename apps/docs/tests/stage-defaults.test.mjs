import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

test("stage-defaults has no duplicate keys", () => {
  const src = readFileSync(new URL("../src/lib/stage-defaults.ts", import.meta.url), "utf8")
  const body = src.slice(src.indexOf("const stageDefaults"), src.indexOf("export function getStageDefault"))
  const seen = new Map()
  for (const m of body.matchAll(/^\s*"?([a-z0-9-]+)"?\s*:\s*\{/gm)) seen.set(m[1], (seen.get(m[1]) ?? 0) + 1)
  const dups = [...seen].filter(([, n]) => n > 1).map(([k]) => k)
  assert.deepEqual(dups, [])
  assert.ok(seen.size > 50)
})

test("MDX code template strings have no stray backticks", async () => {
  const { readdirSync, existsSync } = await import("node:fs")
  const dir = new URL("../src/app/docs/components/", import.meta.url).pathname
  const bad = []
  for (const id of readdirSync(dir)) {
    const f = dir + id + "/page.mdx"
    if (!existsSync(f)) continue
    const s = readFileSync(f, "utf8")
    for (const m of s.matchAll(/code=\{`/g)) {
      let i = m.index + m[0].length
      let depth = 0
      for (; i < s.length; i++) {
        const c = s[i]
        if (c === "\\") { i++; continue }
        if (c === "$" && s[i + 1] === "{") { depth++; i++; continue }
        if (c === "}" && depth) { depth--; continue }
        if (c === "`" && !depth) break
      }
      if (!s.slice(i + 1, i + 4).trim().startsWith("}")) bad.push(id)
    }
  }
  assert.deepEqual(bad, [])
})
