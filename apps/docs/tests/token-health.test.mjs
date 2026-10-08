import assert from "node:assert/strict"
import test from "node:test"

import { runChecks } from "../scripts/check-tokens.mjs"

const result = runChecks()

for (const section of result.sections) {
  test(section.title, () => {
    assert.equal(section.failures.length, 0, `\n${section.failures.map((f) => `  - ${f}`).join("\n")}\n`)
  })
}

test("contrast covers every base in both themes", () => {
  const bases = new Set(result.contrast.map((r) => r.base))
  for (const id of ["obsidian", "neutral", "zinc", "slate", "stone", "gray"]) assert.ok(bases.has(id), `missing ${id}`)
  assert.ok(result.contrast.every((r) => r.theme === "light" || r.theme === "dark"))
})
