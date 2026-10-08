import path from "path"

export type ImportTargetKind = "utils" | "lib" | "component"

export type ImportTarget = {
  kind: ImportTargetKind
  /** File base name without extension, for example "button" or "use-prefers-reduced-motion". */
  name: string
}

export type ImportResolver = (target: ImportTarget) => string | null

export type RewriteResult = {
  content: string
  /** Relative or alias specifiers that could not be mapped to a project location. */
  unresolved: string[]
  /** Targets that were rewritten, in source order. */
  targets: ImportTarget[]
}

const UTILS_NAMES = new Set(["cn", "utils"])

// Matches `from "x"`, `import "x"` and `import("x")` string specifiers.
const SPECIFIER_PATTERN = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\2/g

/**
 * Classify a module specifier found in a registry source file.
 * Understands the monorepo layout (`../lib/cn`, `./button`, `../components/button`)
 * and the canonical alias layout (`@/lib/utils`, `@/components/ui/button`).
 * Returns null for bare package imports and anything that is not a project file.
 */
export function classifySpecifier(specifier: string, sourcePath: string): ImportTarget | null {
  if (specifier.startsWith("@/")) {
    const aliasMatch = /^@\/(?:components\/ui|components|lib)\/([^/]+)$/.exec(specifier)
    if (!aliasMatch) return null
    const name = aliasMatch[1]
    if (specifier.startsWith("@/lib/")) {
      return { kind: UTILS_NAMES.has(name) ? "utils" : "lib", name }
    }
    return { kind: "component", name }
  }

  if (!specifier.startsWith(".")) return null

  const sourceDir = path.posix.dirname(sourcePath.replace(/\\/g, "/"))
  const resolved = path.posix.normalize(path.posix.join(sourceDir, specifier))
  const match = /(?:^|\/)(components|lib)\/([^/]+)$/.exec(resolved)
  if (!match) return null

  const [, folder, name] = match
  if (folder === "lib") {
    return { kind: UTILS_NAMES.has(name) ? "utils" : "lib", name }
  }
  return { kind: "component", name }
}

/**
 * Rewrite project-local imports of a registry source file so they resolve in the
 * user's project. The resolver returns the final specifier for each target.
 */
export function rewriteImports(content: string, sourcePath: string, resolve: ImportResolver): RewriteResult {
  const unresolved: string[] = []
  const targets: ImportTarget[] = []

  const next = content.replace(SPECIFIER_PATTERN, (full, lead: string, quote: string, specifier: string) => {
    const isLocal = specifier.startsWith(".") || specifier.startsWith("@/")
    if (!isLocal) return full

    const target = classifySpecifier(specifier, sourcePath)
    const replacement = target ? resolve(target) : null
    if (!target || !replacement) {
      unresolved.push(specifier)
      return full
    }

    targets.push(target)
    return `${lead}${quote}${replacement}${quote}`
  })

  return { content: next, unresolved, targets }
}
