import test from "node:test"
import assert from "node:assert/strict"
import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"

const root = new URL("..", import.meta.url).pathname
const targets = [
  ["scripts/gen-showcase-s1-code.mjs", "src/lib/showcase-s1-code.ts"],
  ["scripts/gen-showcase-s2-code.mjs", "src/lib/new-components/showcase-s2-code.generated.ts"],
  ["scripts/gen-s3-code.mjs", "src/lib/s3-code.generated.ts"],
  ["scripts/gen-s5-code.mjs", "src/lib/s5-code.generated.ts"]
]

test("generated showcase code files are up to date", () => {
  for (const [script, out] of targets) {
    const before = readFileSync(root + out, "utf8")
    execFileSync("node", [root + script], { cwd: root, stdio: "pipe" })
    assert.equal(readFileSync(root + out, "utf8"), before, `${out} is stale: run pnpm showcase:code`)
  }
})
