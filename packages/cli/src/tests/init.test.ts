import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { buildInitConfig, runInit } from "../commands/init.js"

const tempDirs: string[] = []

async function createTempProject() {
  const dir = await mkdtemp(path.join(tmpdir(), "glinui-cli-init-"))
  tempDirs.push(dir)
  await writeFile(path.join(dir, "package.json"), JSON.stringify({ name: "test-app" }, null, 2), "utf8")
  return dir
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })))
})

describe("init command", () => {
  it("buildInitConfig creates expected schema structure", () => {
    const config = buildInitConfig({
      style: "default",
      tailwindCss: "src/app/globals.css",
      components: "src/components/ui",
      utils: "src/lib/utils"
    })

    expect(config).toEqual({
      $schema: "https://glinui.com/r/schema.json",
      style: "default",
      tailwind: {
        css: "src/app/globals.css"
      },
      aliases: {
        components: "src/components/ui",
        utils: "src/lib/utils"
      }
    })
  })

  it("runInit writes glinui.json and cn helper in yes mode", async () => {
    const cwd = await createTempProject()

    await runInit({ yes: true, cwd })

    const configFile = await readFile(path.join(cwd, "glinui.json"), "utf8")
    const parsed = JSON.parse(configFile) as {
      style: string
      tailwind: { css: string }
      aliases: { components: string; utils: string }
    }

    expect(parsed.style).toBe("default")
    expect(parsed.tailwind.css).toBe("src/app/globals.css")
    expect(parsed.aliases.components).toBe("src/components/ui")
    expect(parsed.aliases.utils).toBe("src/lib/utils")

    const cnFile = await readFile(path.join(cwd, "src/lib/utils.ts"), "utf8")
    expect(cnFile).toContain("export function cn")
  })
})
