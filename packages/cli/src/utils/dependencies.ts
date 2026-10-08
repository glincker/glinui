import fs from "fs-extra"
import path from "path"
import { spawnSync } from "node:child_process"

/** Packages that exist only in the monorepo layout and must never be installed by the CLI. */
const NON_INSTALLABLE = new Set(["@glinui/ui"])

export const CN_DEPENDENCIES = ["clsx", "tailwind-merge"]

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  [key: string]: unknown
}

export function installableDependencies(dependencies: string[]) {
  return dependencies.filter((dep) => !NON_INSTALLABLE.has(dep))
}

/**
 * Add missing packages to package.json `dependencies`. Returns the names that were added.
 * Packages already declared in any dependency section are left untouched.
 */
export async function addPackageDependencies(
  cwd: string,
  names: string[],
  versions: Record<string, string>,
  dryRun: boolean
): Promise<string[]> {
  const file = path.join(cwd, "package.json")
  if (!(await fs.pathExists(file))) return []

  const pkg = (await fs.readJson(file)) as PackageJson
  const declared = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.devDependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {})
  ])

  const missing = [...new Set(names)].filter((name) => !declared.has(name)).sort()
  if (missing.length === 0 || dryRun) return missing

  const next: Record<string, string> = { ...(pkg.dependencies ?? {}) }
  for (const name of missing) next[name] = versions[name] ?? "latest"
  pkg.dependencies = Object.fromEntries(Object.entries(next).sort(([a], [b]) => a.localeCompare(b)))

  await fs.writeJson(file, pkg, { spaces: 2 })
  await fs.appendFile(file, "\n")
  return missing
}

export type PackageManager = "pnpm" | "yarn" | "bun" | "npm"

export function detectPackageManager(cwd: string): PackageManager {
  if (fs.pathExistsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm"
  if (fs.pathExistsSync(path.join(cwd, "yarn.lock"))) return "yarn"
  if (fs.pathExistsSync(path.join(cwd, "bun.lockb")) || fs.pathExistsSync(path.join(cwd, "bun.lock"))) return "bun"
  return "npm"
}

export function runInstall(cwd: string): boolean {
  const manager = detectPackageManager(cwd)
  const result = spawnSync(manager, ["install"], { cwd, stdio: "inherit" })
  return result.status === 0
}
