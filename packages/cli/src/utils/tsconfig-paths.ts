import fs from "fs-extra"
import path from "path"

export type PathAlias = {
  /** Alias prefix without the wildcard, for example "@/". */
  prefix: string
  /** Absolute directory the alias points to, without trailing separator. */
  directory: string
}

type RawTsConfig = {
  extends?: string
  compilerOptions?: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

/** Strip comments and trailing commas so tsconfig.json (JSONC) can be parsed. */
export function parseJsonc(text: string): unknown {
  let out = ""
  let inString = false
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]
    if (inString) {
      out += char
      if (char === "\\") {
        out += next ?? ""
        i += 1
      } else if (char === '"') {
        inString = false
      }
      continue
    }
    if (char === '"') {
      inString = true
      out += char
    } else if (char === "/" && next === "/") {
      while (i < text.length && text[i] !== "\n") i += 1
      out += "\n"
    } else if (char === "/" && next === "*") {
      i += 2
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i += 1
      i += 1
    } else {
      out += char
    }
  }
  return JSON.parse(out.replace(/,(\s*[}\]])/g, "$1"))
}

function readTsConfig(file: string, depth = 0): { aliases: PathAlias[] } {
  if (depth > 4 || !fs.pathExistsSync(file)) return { aliases: [] }

  let raw: RawTsConfig
  try {
    raw = parseJsonc(fs.readFileSync(file, "utf8")) as RawTsConfig
  } catch {
    return { aliases: [] }
  }

  const dir = path.dirname(file)
  let inherited: PathAlias[] = []
  if (raw.extends && raw.extends.startsWith(".")) {
    const parent = raw.extends.endsWith(".json") ? raw.extends : `${raw.extends}.json`
    inherited = readTsConfig(path.resolve(dir, parent), depth + 1).aliases
  }

  const paths = raw.compilerOptions?.paths
  if (!paths) return { aliases: inherited }

  const baseDir = raw.compilerOptions?.baseUrl ? path.resolve(dir, raw.compilerOptions.baseUrl) : dir
  const own: PathAlias[] = []
  for (const [pattern, targets] of Object.entries(paths)) {
    if (!pattern.endsWith("/*") || !targets?.[0]?.endsWith("/*")) continue
    own.push({
      prefix: pattern.slice(0, -1),
      directory: path.resolve(baseDir, targets[0].slice(0, -2))
    })
  }
  return { aliases: own.length > 0 ? own : inherited }
}

/** Read `compilerOptions.paths` wildcard aliases from tsconfig.json (or jsconfig.json). */
export function readPathAliases(cwd: string): PathAlias[] {
  for (const name of ["tsconfig.json", "jsconfig.json"]) {
    const { aliases } = readTsConfig(path.join(cwd, name))
    if (aliases.length > 0) return aliases
  }
  return []
}

/** Map an alias specifier (for example "@/components/ui") to an absolute directory. */
export function aliasToDirectory(specifier: string, aliases: PathAlias[]): string | null {
  const match = aliases
    .filter((alias) => specifier === alias.prefix.slice(0, -1) || specifier.startsWith(alias.prefix))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0]
  if (!match) return null
  return path.join(match.directory, specifier.slice(match.prefix.length))
}

/** Map an absolute path to the alias specifier that resolves to it, if any. */
export function directoryToAlias(absolute: string, aliases: PathAlias[]): string | null {
  const match = aliases
    .filter((alias) => absolute === alias.directory || absolute.startsWith(alias.directory + path.sep))
    .sort((a, b) => b.directory.length - a.directory.length)[0]
  if (!match) return null
  const rest = path.relative(match.directory, absolute).split(path.sep).join("/")
  return rest ? `${match.prefix}${rest}` : match.prefix.slice(0, -1)
}
