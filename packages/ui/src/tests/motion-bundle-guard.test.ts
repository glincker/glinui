import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

const dist = join(process.cwd(), "..", "motion", "dist")
const built = existsSync(join(dist, "index.js"))

function coreFiles(): string[] {
  return readdirSync(dist)
    .filter((f) => f.endsWith(".js"))
    .map((f) => join(dist, f))
}

describe.skipIf(!built)("motion bundle guard (requires built dist)", () => {
  it("core entry never references the optional gsap or motion libraries", () => {
    const index = readFileSync(join(dist, "index.js"), "utf8")
    expect(index).not.toContain("gsap")
    expect(index).not.toContain('from "motion"')
    for (const file of coreFiles()) {
      const src = readFileSync(file, "utf8")
      expect(src, file).not.toContain("gsap")
      expect(src, file).not.toMatch(/from "motion"/)
      expect(src, file).not.toMatch(/import\("(gsap|motion)"\)/)
    }
  })

  it("opt-in entry points are built", () => {
    for (const name of ["motion", "gsap"]) {
      expect(existsSync(join(dist, "register", `${name}.js`))).toBe(true)
      expect(existsSync(join(dist, "register", `${name}.d.ts`))).toBe(true)
      expect(existsSync(join(dist, "engines", `${name}.js`))).toBe(true)
    }
  })
})
