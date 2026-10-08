import { describe, expect, it } from "vitest"
import { classifySpecifier, rewriteImports } from "../utils/rewrite-imports.js"
import { aliasToDirectory, directoryToAlias, parseJsonc } from "../utils/tsconfig-paths.js"

const SOURCE = "packages/ui/src/components/button-group.tsx"

describe("classifySpecifier", () => {
  it("classifies monorepo and alias specifiers", () => {
    expect(classifySpecifier("../lib/cn", SOURCE)).toEqual({ kind: "utils", name: "cn" })
    expect(classifySpecifier("../lib/utils", SOURCE)).toEqual({ kind: "utils", name: "utils" })
    expect(classifySpecifier("../lib/use-prefers-reduced-motion", SOURCE)).toEqual({ kind: "lib", name: "use-prefers-reduced-motion" })
    expect(classifySpecifier("./button", SOURCE)).toEqual({ kind: "component", name: "button" })
    expect(classifySpecifier("../components/button", SOURCE)).toEqual({ kind: "component", name: "button" })
    expect(classifySpecifier("@/components/ui/button", SOURCE)).toEqual({ kind: "component", name: "button" })
    expect(classifySpecifier("@/lib/utils", SOURCE)).toEqual({ kind: "utils", name: "utils" })
    expect(classifySpecifier("react", SOURCE)).toBeNull()
  })
})

describe("rewriteImports", () => {
  it("rewrites static, side effect, dynamic and re-export specifiers but leaves packages alone", () => {
    const input = [
      'import * as React from "react"',
      'import { cn } from "../lib/cn"',
      "import { Button } from './button'",
      'export { A } from "./a"',
      'const lazy = import("./b")',
      'import { Slot } from "@radix-ui/react-slot"'
    ].join("\n")
    const result = rewriteImports(input, SOURCE, (t) => `X/${t.kind}/${t.name}`)
    expect(result.content).toContain('from "X/utils/cn"')
    expect(result.content).toContain("from 'X/component/button'")
    expect(result.content).toContain('from "X/component/a"')
    expect(result.content).toContain('import("X/component/b")')
    expect(result.content).toContain('from "@radix-ui/react-slot"')
    expect(result.unresolved).toEqual([])
  })

  it("reports specifiers it cannot map", () => {
    const result = rewriteImports('import x from "../weird/thing"', SOURCE, () => "y")
    expect(result.unresolved).toEqual(["../weird/thing"])
    expect(result.content).toContain("../weird/thing")
  })
})

describe("tsconfig paths", () => {
  it("parses JSONC and maps aliases both ways", () => {
    const parsed = parseJsonc('{\n // c\n "a": [1, 2,], /* x */ "b": "//not a comment",\n}') as { a: number[]; b: string }
    expect(parsed.a).toEqual([1, 2])
    expect(parsed.b).toBe("//not a comment")

    const aliases = [{ prefix: "@/", directory: "/p/src" }]
    expect(aliasToDirectory("@/components/ui", aliases)).toBe("/p/src/components/ui")
    expect(directoryToAlias("/p/src/lib/utils", aliases)).toBe("@/lib/utils")
    expect(directoryToAlias("/p/other/lib", aliases)).toBeNull()
  })
})
