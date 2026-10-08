import assert from "node:assert/strict"
import test from "node:test"
import { buildShadcnItem, canonicalizeImports, toAliasSpecifier } from "./shadcn.mjs"
import { resolveItemGraph } from "./item-graph.mjs"

test("maps monorepo relative imports to aliases", () => {
  const from = "packages/ui/src/components/button-group.tsx"
  assert.equal(toAliasSpecifier("../lib/cn", from), "@/lib/utils")
  assert.equal(toAliasSpecifier("../lib/utils", from), "@/lib/utils")
  assert.equal(toAliasSpecifier("../lib/use-prefers-reduced-motion", from), "@/lib/use-prefers-reduced-motion")
  assert.equal(toAliasSpecifier("./button", from), "@/components/ui/button")
  assert.equal(toAliasSpecifier("../components/button", from), "@/components/ui/button")
  assert.equal(toAliasSpecifier("react", from), null)
})

test("canonicalizeImports rewrites only relative specifiers and rejects unknown ones", () => {
  const source = 'import * as React from "react"\nimport { cn } from "../lib/cn"\nexport { A } from "./a"\n'
  const out = canonicalizeImports(source, "packages/ui/src/components/x.tsx")
  assert.match(out, /from "react"/)
  assert.match(out, /from "@\/lib\/utils"/)
  assert.match(out, /from "@\/components\/ui\/a"/)
  assert.throws(() => canonicalizeImports('import x from "../weird/thing"', "packages/ui/src/components/x.tsx"))
})

test("buildShadcnItem emits registry:ui and registry:lib files with URL registry dependencies", () => {
  const item = buildShadcnItem(
    { name: "demo", title: "Demo", description: "d", dependencies: ["@glinui/ui", "sonner"], registryDependencies: ["button"], docsPath: "/docs/demo" },
    [
      { path: "packages/ui/src/components/demo.tsx", content: 'import { cn } from "../lib/cn"\nimport { Button } from "./button"\n' },
      { path: "packages/ui/src/lib/use-thing.ts", content: "export const x = 1\n" },
      { path: "packages/ui/src/lib/use-thing.ts", content: "export const x = 1\n" }
    ],
    { sonner: "^2.0.7", clsx: "^2.1.1" }
  )
  assert.equal(item.type, "registry:ui")
  assert.deepEqual(item.registryDependencies, ["https://glinui.com/r/button.json"])
  assert.deepEqual(item.files.map((f) => [f.path, f.type]), [["ui/demo.tsx", "registry:ui"], ["lib/use-thing.ts", "registry:lib"]])
  assert.ok(item.dependencies.includes("sonner@^2.0.7"))
  assert.ok(!item.dependencies.some((d) => d.startsWith("@glinui/ui")))
})

test("resolveItemGraph discovers lib files, sibling items and bare packages", () => {
  const sources = {
    "packages/ui/src/components/demo.tsx":
      'import { cva } from "class-variance-authority"\nimport { cn } from "../lib/cn"\nimport { Button } from "./button"\nimport { useX } from "../lib/use-x"\nimport { ctx } from "./demo-context"\n',
    "packages/ui/src/components/button.tsx": "",
    "packages/ui/src/components/demo-context.tsx": 'import * as React from "react"\n',
    "packages/ui/src/lib/use-x.ts": 'import * as React from "react"\n'
  }
  const graph = resolveItemGraph(
    { name: "demo", dependencies: [], files: ["packages/ui/src/components/demo.tsx"] },
    (file) => sources[file] ?? null,
    new Set(["demo", "button"])
  )
  assert.deepEqual(graph.registryDependencies, ["button"])
  assert.deepEqual(graph.dependencies, ["class-variance-authority"])
  assert.deepEqual(graph.files.map((f) => f.path).sort(), [
    "packages/ui/src/components/demo-context.tsx",
    "packages/ui/src/components/demo.tsx",
    "packages/ui/src/lib/use-x.ts"
  ])
})
