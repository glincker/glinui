import assert from "node:assert/strict"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { ambiguousVarFinding, baseUtility, runAudit, splitTokens } from "../scripts/audit-classes.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const components = path.resolve(here, "../../../packages/ui/src/components")

test("tokenizer keeps arbitrary values and variants whole", () => {
  assert.deepEqual(splitTokens("a  data-[state=open]:bg-[color-mix(in_oklab,var(--x)_50%,transparent)] !p-2 -mt-1"), [
    "a",
    "data-[state=open]:bg-[color-mix(in_oklab,var(--x)_50%,transparent)]",
    "!p-2",
    "-mt-1"
  ])
})

test("component classes all compile to CSS (no silent failures)", { timeout: 120000 }, async () => {
  const { findings } = await runAudit({ dirs: [components] })
  const errors = findings.filter((f) => f.level !== "review")
  const message = errors.map((f) => `  ${f.file}:${f.line}  [${f.rule}]  ${f.token}`).join("\n")
  assert.equal(
    errors.length,
    0,
    `\nclass audit found ${errors.length} problem(s). Fix them or run \`pnpm --filter @glinui/docs audit:classes\`:\n${message}\n`
  )
})

test("baseUtility strips variants and the important flag", () => {
  assert.equal(baseUtility("hover:!shadow-[var(--elev-2)]"), "shadow-[var(--elev-2)]")
  assert.equal(baseUtility("data-[state=open]:dark:shadow-[var(--elev-1)]"), "shadow-[var(--elev-1)]")
})

test("ambiguous-var-utility flags shadow-[var()] that compiles to a shadow color", () => {
  const colorOnly = "--tw-shadow-color: var(--elev-1); --tw-shadow: var(--tw-shadow-colored); "
  assert.ok(ambiguousVarFinding("shadow-[var(--elev-1)]", colorOnly))
  assert.ok(ambiguousVarFinding("hover:shadow-[var(--elev-2)]", colorOnly))
  assert.ok(ambiguousVarFinding("shadow-[0_0_0_1px_red_inset,var(--shadow-soft)]", colorOnly))
  assert.equal(ambiguousVarFinding("[box-shadow:var(--elev-1)]", "box-shadow: var(--elev-1); "), null)
  assert.equal(ambiguousVarFinding("shadow-[0_1px_2px_rgb(0_0_0_/_0.1)]", "--tw-shadow: 0 1px 2px; box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-shadow); "), null)
})

test("ambiguous-var-utility flags size, family and image variables bound to color or weight", () => {
  assert.ok(ambiguousVarFinding("text-[var(--text-sm)]", "color: var(--text-sm); "))
  assert.equal(ambiguousVarFinding("text-[var(--color-muted)]", "color: var(--color-muted); "), null)
  assert.ok(ambiguousVarFinding("border-[var(--border-width)]", "border-color: var(--border-width); "))
  assert.ok(ambiguousVarFinding("font-[var(--font-sans)]", "font-weight: var(--font-sans); "))
  assert.ok(ambiguousVarFinding("ring-[var(--ring)]", "--tw-ring-color: var(--ring); "))
  assert.ok(ambiguousVarFinding("bg-[var(--sheen-gradient)]", "background-color: var(--sheen-gradient); "))
  assert.equal(ambiguousVarFinding("bg-[var(--surface-1)]", "background-color: var(--surface-1); "), null)
})
