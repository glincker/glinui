import { existsSync, readFileSync, readdirSync } from "node:fs"
import { rm } from "node:fs/promises"
import { join } from "node:path"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { runAdd } from "../commands/add.js"
import {
  checkImportResolution,
  listSourceFiles,
  publicRegistry,
  readDeclaredPackages,
  scaffoldProject,
  stubRegistryFetch,
  typecheck,
  type ProjectKind
} from "./helpers/project.js"

const created: string[] = []
const FIVE = ["button", "button-group", "sidebar", "message-scroller", "input-otp"]

async function project(kind: ProjectKind) {
  const cwd = await scaffoldProject(kind)
  created.push(cwd)
  return cwd
}

function readFile(cwd: string, relative: string) {
  return readFileSync(join(cwd, relative), "utf8")
}

beforeAll(() => {
  stubRegistryFetch()
  vi.spyOn(console, "log").mockImplementation(() => undefined)
})

afterAll(async () => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  await Promise.all(created.map((dir) => rm(dir, { recursive: true, force: true })))
})

describe("add into a fresh project with tsconfig aliases", () => {
  it("writes files, rewrites imports, creates cn and declares dependencies", async () => {
    const cwd = await project("glinui-alias")
    const summary = await runAdd({ components: FIVE, cwd })

    for (const file of [
      "src/components/ui/button.tsx",
      "src/components/ui/button-group.tsx",
      "src/components/ui/sidebar.tsx",
      "src/components/ui/sidebar-context.tsx",
      "src/components/ui/sheet.tsx",
      "src/components/ui/tooltip.tsx",
      "src/components/ui/message-scroller.tsx",
      "src/components/ui/input-otp.tsx",
      "src/lib/use-prefers-reduced-motion.ts",
      "src/lib/utils.ts"
    ]) {
      expect(existsSync(join(cwd, file)), file).toBe(true)
    }

    expect(readFile(cwd, "src/lib/utils.ts")).toContain("export function cn")
    expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(true)
    expect(readFile(cwd, "src/components/ui/button-group.tsx")).toContain('from "@/lib/utils"')
    expect(readFile(cwd, "src/components/ui/message-scroller.tsx")).toContain('from "@/lib/use-prefers-reduced-motion"')
    expect(readFile(cwd, "src/components/ui/sidebar.tsx")).toContain('from "@/components/ui/sidebar-context"')
    expect(readFile(cwd, "src/components/ui/sidebar.tsx")).not.toContain("../")

    const pkg = JSON.parse(readFile(cwd, "package.json")) as { dependencies: Record<string, string> }
    for (const dep of ["clsx", "tailwind-merge", "class-variance-authority", "@phosphor-icons/react", "@radix-ui/react-slot", "@glinui/tokens"]) {
      expect(pkg.dependencies[dep], dep).toMatch(/^\^/)
    }
    expect(pkg.dependencies["@glinui/ui"]).toBeUndefined()
    expect(summary.addedDependencies).toContain("clsx")

    const files = listSourceFiles(join(cwd, "src"))
    expect(checkImportResolution(cwd, files, readDeclaredPackages(cwd))).toEqual([])
    expect(typecheck(cwd, files)).toEqual([])
  })

  it("does not touch the project on dry-run", async () => {
    const cwd = await project("glinui-alias")
    const before = readFile(cwd, "package.json")
    await runAdd({ components: ["button"], cwd, dryRun: true })
    expect(existsSync(join(cwd, "src/components/ui/button.tsx"))).toBe(false)
    expect(existsSync(join(cwd, "src/lib/utils.ts"))).toBe(false)
    expect(readFile(cwd, "package.json")).toBe(before)
  })

  it("keeps an existing utils module and does not overwrite files without --overwrite", async () => {
    const cwd = await project("glinui-alias")
    const first = await runAdd({ components: ["button"], cwd })
    const custom = `${readFile(cwd, "src/lib/utils.ts")}// custom\n`
    await import("node:fs/promises").then((fs) => fs.writeFile(join(cwd, "src/lib/utils.ts"), custom))
    const second = await runAdd({ components: ["button"], cwd })
    expect(second.written).toEqual([])
    expect(second.skipped.length).toBeGreaterThan(0)
    expect(second.skipped.length).toBeLessThanOrEqual(first.written.length)
    expect(readFile(cwd, "src/lib/utils.ts")).toBe(custom)
  })
})

describe("other project layouts", () => {
  it("supports components.json aliases", async () => {
    const cwd = await project("components-json")
    await runAdd({ components: ["message-scroller", "liquid-button"], cwd })
    expect(readFile(cwd, "src/components/ui/liquid-button.tsx")).toContain('from "@/components/ui/button"')
    expect(existsSync(join(cwd, "src/lib/use-prefers-reduced-motion.ts"))).toBe(true)
    const files = listSourceFiles(join(cwd, "src"))
    expect(checkImportResolution(cwd, files, readDeclaredPackages(cwd))).toEqual([])
    expect(typecheck(cwd, files)).toEqual([])
  })

  it("falls back to relative imports when no path alias exists", async () => {
    const cwd = await project("no-paths")
    await runAdd({ components: ["message-scroller", "liquid-button"], cwd })
    expect(readFile(cwd, "src/components/ui/liquid-button.tsx")).toContain('from "./button"')
    expect(readFile(cwd, "src/components/ui/liquid-button.tsx")).toContain('from "../../lib/utils"')
    expect(readFile(cwd, "src/components/ui/message-scroller.tsx")).toContain('from "../../lib/use-prefers-reduced-motion"')
    const files = listSourceFiles(join(cwd, "src"))
    expect(checkImportResolution(cwd, files, readDeclaredPackages(cwd))).toEqual([])
    expect(typecheck(cwd, files)).toEqual([])
  })

  it("reuses the legacy src/lib/utils/cn.ts layout from older init", async () => {
    const cwd = await project("glinui-legacy")
    await runAdd({ components: ["button"], cwd })
    expect(readFile(cwd, "src/components/ui/button.tsx")).toContain('from "@/lib/utils/cn"')
    expect(existsSync(join(cwd, "src/lib/utils.ts"))).toBe(false)
    const files = listSourceFiles(join(cwd, "src"))
    expect(typecheck(cwd, files)).toEqual([])
  })
})

describe("engine components", () => {
  it("installs reveal and split-text with @glinui/motion written to package.json", async () => {
    const cwd = await project("glinui-alias")
    const summary = await runAdd({ components: ["split-text"], cwd })
    for (const file of ["split-text.tsx", "reveal.tsx", "motion-engine.tsx"]) {
      expect(existsSync(join(cwd, "src/components/ui", file))).toBe(true)
    }
    expect(readFile(cwd, "src/components/ui/reveal.tsx")).toContain('from "@glinui/motion"')
    const pkg = JSON.parse(readFile(cwd, "package.json")) as { dependencies: Record<string, string> }
    expect(pkg.dependencies["@glinui/motion"]).toMatch(/^\^\d/)
    expect(summary.addedDependencies).toContain("@glinui/motion")
    expect(typecheck(cwd, listSourceFiles(join(cwd, "src")))).toEqual([])
  })
})

describe("verification harness", () => {
  it("reports broken imports and type errors", async () => {
    const cwd = await project("glinui-alias")
    await runAdd({ components: ["button"], cwd })
    const broken = join(cwd, "src/components/ui/broken.tsx")
    await import("node:fs/promises").then((fs) =>
      fs.writeFile(broken, 'import { cn } from "../lib/cn"\nexport const value: number = "x"\nexport { cn }\n')
    )
    const files = listSourceFiles(join(cwd, "src"))
    expect(checkImportResolution(cwd, files, readDeclaredPackages(cwd)).length).toBe(1)
    expect(typecheck(cwd, files).length).toBeGreaterThan(0)
  })
})

describe("coverage across the whole registry", () => {
  const names = readdirSync(join(publicRegistry, "items"))
    .filter((entry) => entry.endsWith(".json"))
    .map((entry) => entry.replace(/\.json$/, ""))
    .sort()

  it("has the expected number of items", () => {
    expect(names.length).toBe(142)
  })

  it("every item installs with fully resolvable imports", async () => {
    const failures: string[] = []
    for (const name of names) {
      const cwd = await project("glinui-alias")
      await runAdd({ components: [name], cwd })
      const files = listSourceFiles(join(cwd, "src"))
      const problems = checkImportResolution(cwd, files, readDeclaredPackages(cwd))
      if (problems.length > 0) failures.push(`${name}: ${problems.join("; ")}`)
      await rm(cwd, { recursive: true, force: true })
    }
    expect(failures).toEqual([])
  }, 120_000)

  it("all items together type-check", async () => {
    const cwd = await project("glinui-alias")
    await runAdd({ components: names, cwd })
    const diagnostics = typecheck(cwd, listSourceFiles(join(cwd, "src")))
    expect(diagnostics).toEqual([])
  }, 240_000)
})
