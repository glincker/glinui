import { execFileSync } from "node:child_process"
import { createServer, type Server } from "node:http"
import { existsSync } from "node:fs"
import { mkdtemp, readFile, readFile as readFileAsync, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path, { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, "..", "..", "..", "..")
const docsRoot = join(repoRoot, "apps", "docs")
const docsPublicRoot = join(docsRoot, "public")

const tempDirs: string[] = []

let server: Server | null = null
let registryBaseUrl = ""
const originalRegistryUrl = process.env.GLINUI_REGISTRY_URL

function toText(value: unknown) {
  if (typeof value === "string") return value
  return String(value)
}

function withCapturedConsole<T>(run: () => Promise<T>) {
  const logs: string[] = []
  const errors: string[] = []

  const logSpy = vi.spyOn(console, "log").mockImplementation((...args: unknown[]) => {
    logs.push(args.map(toText).join(" "))
  })

  const errorSpy = vi.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
    errors.push(args.map(toText).join(" "))
  })

  return run()
    .then((result) => ({ result, logs, errors }))
    .finally(() => {
      logSpy.mockRestore()
      errorSpy.mockRestore()
    })
}

async function createTempProject() {
  const cwd = await mkdtemp(path.join(tmpdir(), "glinui-cli-e2e-"))
  tempDirs.push(cwd)

  await writeFile(path.join(cwd, "package.json"), JSON.stringify({ name: "e2e-project" }, null, 2), "utf8")

  return cwd
}

function startDocsPublicServer() {
  return new Promise<{ server: Server; baseUrl: string }>((resolveServer, reject) => {
    const nextServer = createServer((request, response) => {
      const method = request.method ?? "GET"
      const url = request.url ?? "/"

      if (method !== "GET") {
        response.statusCode = 405
        response.end("Method Not Allowed")
        return
      }

      const routePath = url.split("?")[0] ?? "/"
      const targetPath = resolve(docsPublicRoot, `.${routePath}`)
      const publicRoot = resolve(docsPublicRoot)

      if (!targetPath.startsWith(publicRoot)) {
        response.statusCode = 403
        response.end("Forbidden")
        return
      }

      if (!existsSync(targetPath)) {
        response.statusCode = 404
        response.end("Not Found")
        return
      }

      void readFile(targetPath)
        .then((content) => {
          if (targetPath.endsWith(".json")) {
            response.setHeader("content-type", "application/json; charset=utf-8")
          }
          response.statusCode = 200
          response.end(content)
        })
        .catch(() => {
          response.statusCode = 500
          response.end("Internal Server Error")
        })
    })

    nextServer.listen(0, "127.0.0.1", () => {
      const address = nextServer.address()
      if (!address || typeof address === "string") {
        reject(new Error("Unable to determine E2E server address"))
        return
      }

      resolveServer({
        server: nextServer,
        baseUrl: `http://127.0.0.1:${address.port}`
      })
    })
  })
}

beforeAll(async () => {
  execFileSync("node", ["scripts/build-registry-endpoints.mjs"], {
    cwd: docsRoot,
    stdio: "pipe"
  })

  const running = await startDocsPublicServer()
  server = running.server
  registryBaseUrl = `${running.baseUrl}/r`

  process.env.GLINUI_REGISTRY_URL = registryBaseUrl
})

afterAll(async () => {
  if (server) {
    await new Promise<void>((resolveServer, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error)
          return
        }

        resolveServer()
      })
    })
  }

  process.env.GLINUI_REGISTRY_URL = originalRegistryUrl

  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })))
})

describe("cli e2e smoke", () => {
  it("runs init, add, list, and diff against generated /r endpoints", async () => {
    const cwd = await createTempProject()

    vi.resetModules()

    const { createInitCommand } = await import("../commands/init.js")
    await createInitCommand().parseAsync(["--yes", "--cwd", cwd], { from: "user" })

    const configRaw = await readFileAsync(path.join(cwd, "glinui.json"), "utf8")
    const config = JSON.parse(configRaw) as { $schema: string }
    expect(config.$schema).toBe(`${registryBaseUrl}/schema.json`)
    expect(existsSync(path.join(cwd, "src/lib/utils.ts"))).toBe(true)

    const { addCommand } = await import("../commands/add.js")
    await addCommand.parseAsync(["button", "--cwd", cwd], { from: "user" })

    const buttonPath = path.join(cwd, "src/components/ui/button.tsx")
    expect(existsSync(buttonPath)).toBe(true)

    const { listCommand } = await import("../commands/list.js")
    const listOutput = await withCapturedConsole(async () => {
      await listCommand.parseAsync([], { from: "user" })
    })
    expect(listOutput.errors).toEqual([])
    expect(listOutput.logs.join("\n")).toContain("button")

    const { createDiffCommand } = await import("../commands/diff.js")
    const diffOutput = await withCapturedConsole(async () => {
      await createDiffCommand().parseAsync(["button", "--cwd", cwd, "--json"], { from: "user" })
    })

    expect(diffOutput.errors).toEqual([])
    const payloadRaw = diffOutput.logs.at(-1) ?? "{}"
    const payload = JSON.parse(payloadRaw) as {
      component: string
      upToDate: boolean
      stats: { added: number; removed: number }
      hunks: unknown[]
      localPath: string
      registryPath: string
    }

    expect(payload.component).toBe("button")
    expect(payload.upToDate).toBe(true)
    expect(payload.localPath).toBe("src/components/ui/button.tsx")
    expect(payload.registryPath).toBe("registry/button.tsx")
    expect(payload.stats).toEqual({ added: 0, removed: 0 })
    expect(payload.hunks).toEqual([])
  })

  it("adds new items with registry dependencies, helper files and lib hooks", async () => {
    const cwd = await createTempProject()

    vi.resetModules()

    const { createInitCommand } = await import("../commands/init.js")
    await createInitCommand().parseAsync(["--yes", "--cwd", cwd], { from: "user" })

    const { addCommand } = await import("../commands/add.js")
    await withCapturedConsole(async () => {
      await addCommand.parseAsync(["button-group", "sidebar", "message-scroller", "--cwd", cwd], { from: "user" })
    })

    const components = path.join(cwd, "src/components/ui")
    // sidebar ships sidebar-context as a helper file.
    expect(existsSync(path.join(components, "button-group.tsx"))).toBe(true)
    expect(existsSync(path.join(components, "sidebar.tsx"))).toBe(true)
    expect(existsSync(path.join(components, "sidebar-context.tsx"))).toBe(true)
    // sidebar requires sheet and tooltip through registryDependencies.
    expect(existsSync(path.join(components, "sheet.tsx"))).toBe(true)
    expect(existsSync(path.join(components, "tooltip.tsx"))).toBe(true)
    // message-scroller helper hook lands next to the utils module, with aliasable imports.
    expect(existsSync(path.join(cwd, "src/lib/use-prefers-reduced-motion.ts"))).toBe(true)
    expect(await readFile(path.join(components, "button-group.tsx"), "utf8")).toContain("../../lib/utils")
  })
})
