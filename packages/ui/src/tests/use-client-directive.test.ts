import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const dir = join(__dirname, "..", "components")
const HOOK = /(?<![\w.])(use[A-Z]\w*|React\.use[A-Z]\w*)\s*\(/g
// useId is allowed in server components.
const SERVER_SAFE = new Set(["useId"])

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1")
}

describe("client directive", () => {
  it("every component that calls a React or Glin hook declares use client", () => {
    const missing: string[] = []
    for (const file of readdirSync(dir).filter((name) => /\.tsx?$/.test(name))) {
      const source = readFileSync(join(dir, file), "utf8")
      const hasDirective = /^\s*(\/\*[\s\S]*?\*\/\s*|\/\/.*\n\s*)*["']use client["']/.test(source)
      const hooks = [...stripComments(source).matchAll(HOOK)]
        .map((match) => match[1].replace("React.", ""))
        .filter((name) => !SERVER_SAFE.has(name))
      if (hooks.length > 0 && !hasDirective) missing.push(`${file} (${[...new Set(hooks)].slice(0, 3).join(", ")})`)
    }
    expect(missing, `Add "use client" to: ${missing.join("; ")}`).toEqual([])
  })
})
