import { existsSync, readFileSync, readdirSync, statSync, symlinkSync } from "node:fs"
import { mkdir, mkdtemp, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path, { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"
import { vi } from "vitest"

const here = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(here, "..", "..", "..", "..", "..")
export const publicRegistry = join(repoRoot, "apps", "docs", "public", "r")
const uiNodeModules = join(repoRoot, "packages", "ui", "node_modules")

export type ProjectKind = "glinui-alias" | "glinui-legacy" | "components-json" | "no-paths"

/** Serve the generated /r endpoints from disk instead of the network. */
export function stubRegistryFetch() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = String(input instanceof Request ? input.url : input)
      const relative = url.replace(/^https?:\/\/[^/]+\/r\//, "")
      const file = join(publicRegistry, relative)
      if (!existsSync(file)) return new Response("not found", { status: 404, statusText: "Not Found" })
      return new Response(readFileSync(file, "utf8"), { status: 200 })
    })
  )
}

const TSCONFIG_WITH_PATHS = {
  compilerOptions: {
    target: "ES2022",
    module: "ESNext",
    moduleResolution: "bundler",
    jsx: "react-jsx",
    strict: true,
    skipLibCheck: true,
    noEmit: true,
    baseUrl: ".",
    paths: { "@/*": ["./src/*"] }
  },
  include: ["src"]
}

/** A DOM app always has react and react-dom, so both count as host provided (morphing-text uses flushSync). */
export async function scaffoldProject(kind: ProjectKind): Promise<string> {
  const cwd = await mkdtemp(join(tmpdir(), `glinui-install-${kind}-`))
  await mkdir(join(cwd, "src"), { recursive: true })
  await writeFile(join(cwd, "package.json"), JSON.stringify({ name: "fresh-app", dependencies: { react: "^19.0.0", "react-dom": "^19.0.0" } }, null, 2))

  if (kind === "no-paths") {
    const { baseUrl: _baseUrl, paths: _paths, ...options } = TSCONFIG_WITH_PATHS.compilerOptions
    await writeFile(join(cwd, "tsconfig.json"), JSON.stringify({ compilerOptions: options, include: ["src"] }))
  } else {
    // JSONC on purpose: comments and trailing commas are valid in tsconfig.json.
    await writeFile(join(cwd, "tsconfig.json"), `// project config\n${JSON.stringify(TSCONFIG_WITH_PATHS, null, 2).replace(/\n}$/, ",\n}")}`)
  }

  if (kind === "components-json") {
    await writeFile(
      join(cwd, "components.json"),
      JSON.stringify({ aliases: { components: "@/components", ui: "@/components/ui", utils: "@/lib/utils", lib: "@/lib" } })
    )
  } else if (kind === "glinui-legacy") {
    await writeFile(join(cwd, "glinui.json"), JSON.stringify({ aliases: { components: "src/components/ui", utils: "src/lib/utils" } }))
    await mkdir(join(cwd, "src/lib/utils"), { recursive: true })
    await writeFile(join(cwd, "src/lib/utils/cn.ts"), 'export { cn } from "../cn-impl"\n')
    await writeFile(join(cwd, "src/lib/cn-impl.ts"), 'import { clsx, type ClassValue } from "clsx"\nimport { twMerge } from "tailwind-merge"\nexport function cn(...i: ClassValue[]) { return twMerge(clsx(i)) }\n')
  } else {
    const components = kind === "no-paths" ? "src/components/ui" : "@/components/ui"
    await writeFile(join(cwd, "glinui.json"), JSON.stringify({ aliases: { components, utils: kind === "no-paths" ? "src/lib/utils" : "@/lib/utils" } }))
  }

  // Real react/radix typings come from the ui package install.
  symlinkSync(uiNodeModules, join(cwd, "node_modules"), "dir")
  return cwd
}

export function listSourceFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (entry === "node_modules") continue
    if (statSync(full).isDirectory()) out.push(...listSourceFiles(full))
    else if (/\.(tsx?|jsx?)$/.test(entry)) out.push(full)
  }
  return out
}

export function importSpecifiers(file: string): string[] {
  const info = ts.preProcessFile(readFileSync(file, "utf8"), true, true)
  return info.importedFiles.map((entry) => entry.fileName)
}

function packageName(specifier: string) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function fileExists(base: string) {
  return [".ts", ".tsx", "/index.ts", "/index.tsx"].some((suffix) => existsSync(base + suffix))
}

/** Verify every import of every file resolves in the tree or is a declared package. Returns problems. */
export function checkImportResolution(cwd: string, files: string[], declared: Set<string>): string[] {
  const problems: string[] = []
  for (const file of files) {
    for (const specifier of importSpecifiers(file)) {
      const label = `${path.relative(cwd, file)}: ${specifier}`
      if (specifier.startsWith(".")) {
        if (specifier.includes("packages/ui") || !fileExists(resolve(dirname(file), specifier))) problems.push(label)
      } else if (specifier.startsWith("@/")) {
        if (!fileExists(join(cwd, "src", specifier.slice(2)))) problems.push(label)
      } else if (!declared.has(packageName(specifier))) {
        problems.push(`${label} (undeclared package)`)
      }
    }
  }
  return problems
}

export function readDeclaredPackages(cwd: string): Set<string> {
  const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")) as { dependencies?: Record<string, string> }
  return new Set(Object.keys(pkg.dependencies ?? {}))
}

/** Type-check files with the TypeScript compiler API. Returns formatted diagnostics. */
export function typecheck(cwd: string, files: string[]): string[] {
  const configFile = ts.readConfigFile(join(cwd, "tsconfig.json"), ts.sys.readFile)
  const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, cwd)
  const program = ts.createProgram(files, { ...parsed.options, noEmit: true })
  return ts
    .getPreEmitDiagnostics(program)
    .filter((diagnostic) => diagnostic.file && !diagnostic.file.fileName.includes("node_modules"))
    .map((diagnostic) => {
      const { line } = diagnostic.file?.getLineAndCharacterOfPosition(diagnostic.start ?? 0) ?? { line: 0 }
      return `${path.relative(cwd, diagnostic.file?.fileName ?? "")}:${line + 1} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
    })
}
