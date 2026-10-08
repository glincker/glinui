import fs from "fs-extra"
import path from "path"
import { aliasToDirectory, directoryToAlias, readPathAliases, type PathAlias } from "./tsconfig-paths.js"
import type { ImportResolver, ImportTarget } from "./rewrite-imports.js"

export type ConfigSource = "glinui.json" | "components.json"

export type ProjectDir = {
  /** Absolute directory files are written to. */
  directory: string
  /** Import specifier for the directory, or null when it must be imported relatively. */
  specifier: string | null
}

export type ProjectLayout = {
  cwd: string
  source: ConfigSource
  components: ProjectDir
  lib: ProjectDir
  utils: {
    /** Absolute path of the module that exports `cn`, with extension. */
    file: string
    specifier: string | null
    /** True when `cn` has to be created. */
    missing: boolean
  }
}

type ConfigAliases = {
  components?: string
  ui?: string
  utils?: string
  lib?: string
}

type RawConfig = { aliases?: ConfigAliases }

export class ConfigNotFoundError extends Error {
  constructor() {
    super("No glinui.json or components.json found. Run `npx glinui init` first.")
    this.name = "ConfigNotFoundError"
  }
}

const UTILS_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs"]

function isAliasValue(value: string) {
  return value.startsWith("@/") || value.startsWith("~/") || value.startsWith("#")
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

/** Resolve an alias config value (path style or import alias style) to a directory and specifier. */
function resolveAlias(value: string, cwd: string, aliases: PathAlias[]): ProjectDir {
  const clean = stripTrailingSlash(value)

  if (isAliasValue(clean)) {
    const directory = aliasToDirectory(clean, aliases)
    if (directory) return { directory, specifier: clean }
    // Alias style value without a tsconfig mapping: guess src/ layout, import relatively.
    const root = fs.pathExistsSync(path.join(cwd, "src")) ? path.join(cwd, "src") : cwd
    return { directory: path.join(root, clean.slice(2)), specifier: null }
  }

  const directory = path.resolve(cwd, clean)
  return { directory, specifier: directoryToAlias(directory, aliases) }
}

const DEFAULT_CONFIG: RawConfig = {}

async function readConfig(cwd: string): Promise<{ config: RawConfig; source: ConfigSource }> {
  for (const source of ["glinui.json", "components.json"] as const) {
    const file = path.join(cwd, source)
    if (await fs.pathExists(file)) {
      return { config: (await fs.readJson(file)) as RawConfig, source }
    }
  }
  throw new ConfigNotFoundError()
}

function findUtilsModule(base: string): string | null {
  for (const extension of UTILS_EXTENSIONS) {
    if (fs.pathExistsSync(base + extension)) return base + extension
  }
  return null
}

/** Same as loadProjectLayout but assumes the glinui.json defaults when no config file exists. */
export async function loadProjectLayoutWithDefaults(cwd: string): Promise<ProjectLayout> {
  return buildLayout(cwd, DEFAULT_CONFIG, "glinui.json")
}

export async function loadProjectLayout(cwd: string): Promise<ProjectLayout> {
  const { config, source } = await readConfig(cwd)
  return buildLayout(cwd, config, source)
}

function buildLayout(cwd: string, config: RawConfig, source: ConfigSource): ProjectLayout {
  const aliases = readPathAliases(cwd)
  const configured = config.aliases ?? {}

  const componentsValue =
    configured.ui ??
    (source === "components.json"
      ? `${stripTrailingSlash(configured.components ?? "@/components")}/ui`
      : configured.components ?? "src/components/ui")
  const components = resolveAlias(componentsValue, cwd, aliases)

  const utilsValue = configured.utils ?? (source === "components.json" ? "@/lib/utils" : "src/lib/utils")
  const utilsBase = resolveAlias(utilsValue, cwd, aliases)

  let utilsFile = findUtilsModule(utilsBase.directory)
  let utilsSpecifier = utilsBase.specifier
  let lib: ProjectDir

  if (utilsFile) {
    lib = defaultLib(utilsBase, configured.lib, cwd, aliases)
  } else if (fs.pathExistsSync(path.join(utilsBase.directory, "cn.ts"))) {
    // Legacy layout from older `glinui init`: utils is a directory holding cn.ts.
    utilsFile = path.join(utilsBase.directory, "cn.ts")
    utilsSpecifier = utilsBase.specifier ? `${utilsBase.specifier}/cn` : null
    lib = configured.lib ? resolveAlias(configured.lib, cwd, aliases) : utilsBase
  } else {
    lib = defaultLib(utilsBase, configured.lib, cwd, aliases)
  }

  return {
    cwd,
    source,
    components,
    lib,
    utils: {
      file: utilsFile ?? `${utilsBase.directory}.ts`,
      specifier: utilsSpecifier,
      missing: utilsFile === null
    }
  }
}

function defaultLib(utilsBase: ProjectDir, libValue: string | undefined, cwd: string, aliases: PathAlias[]): ProjectDir {
  if (libValue) return resolveAlias(libValue, cwd, aliases)
  const directory = path.dirname(utilsBase.directory)
  return { directory, specifier: directoryToAlias(directory, aliases) }
}

function relativeSpecifier(fromFile: string, toFile: string) {
  const relative = path.relative(path.dirname(fromFile), toFile).split(path.sep).join("/")
  return relative.startsWith(".") ? relative : `./${relative}`
}

/** Absolute destination (no extension) of an import target. */
export function targetBase(layout: ProjectLayout, target: ImportTarget) {
  if (target.kind === "utils") return layout.utils.file.replace(/\.[^./\\]+$/, "")
  if (target.kind === "lib") return path.join(layout.lib.directory, target.name)
  return path.join(layout.components.directory, target.name)
}

/** Build the import resolver for one destination file. */
export function createResolver(layout: ProjectLayout, destinationFile: string): ImportResolver {
  return (target) => {
    let specifier: string | null
    if (target.kind === "utils") specifier = layout.utils.specifier
    else if (target.kind === "lib") specifier = layout.lib.specifier ? `${layout.lib.specifier}/${target.name}` : null
    else specifier = layout.components.specifier ? `${layout.components.specifier}/${target.name}` : null

    return specifier ?? relativeSpecifier(destinationFile, targetBase(layout, target))
  }
}

/** Where a registry source file is written in the project. */
export function destinationFor(layout: ProjectLayout, registryPath: string) {
  const normalized = registryPath.replace(/\\/g, "/")
  const isLib = /(^|\/)lib\/[^/]+$/.test(normalized)
  const directory = isLib ? layout.lib.directory : layout.components.directory
  return path.join(directory, path.posix.basename(normalized))
}
