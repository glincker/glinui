// Shared helpers that turn Glin registry items into shadcn-compatible registry items.
// Source files in packages/ui use monorepo relative imports; shadcn consumers need aliases.
import { posix } from "node:path"

export const REGISTRY_BASE_URL = "https://glinui.com/r"
export const ITEM_SCHEMA_URL = "https://ui.shadcn.com/schema/registry-item.json"
export const REGISTRY_SCHEMA_URL = "https://ui.shadcn.com/schema/registry.json"

/** Packages every copied component needs, in addition to its own dependency list. */
export const BASE_DEPENDENCIES = ["clsx", "tailwind-merge", "@glinui/tokens"]

const NON_INSTALLABLE = new Set(["@glinui/ui"])
const UTILS_NAMES = new Set(["cn", "utils"])
const SPECIFIER_PATTERN = /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\2/g

/** Map a relative monorepo specifier to its aliasable equivalent, or null if it is not a project file. */
export function toAliasSpecifier(specifier, sourcePath) {
  if (!specifier.startsWith(".")) return null
  const resolved = posix.normalize(posix.join(posix.dirname(sourcePath), specifier))
  const match = /(?:^|\/)(components|lib)\/([^/]+)$/.exec(resolved)
  if (!match) return null
  const [, folder, name] = match
  if (folder === "lib") return UTILS_NAMES.has(name) ? "@/lib/utils" : `@/lib/${name}`
  return `@/components/ui/${name}`
}

/** Rewrite relative imports of a source file to `@/` aliases. Throws on unmappable relative imports. */
export function canonicalizeImports(content, sourcePath) {
  return content.replace(SPECIFIER_PATTERN, (full, lead, quote, specifier) => {
    if (!specifier.startsWith(".")) return full
    const alias = toAliasSpecifier(specifier, sourcePath)
    if (!alias) {
      throw new Error(`Cannot map import "${specifier}" in ${sourcePath} to an alias`)
    }
    return `${lead}${quote}${alias}${quote}`
  })
}

export function installableDependencies(dependencies) {
  return dependencies.filter((dep) => !NON_INSTALLABLE.has(dep))
}

export function isLibFile(sourcePath) {
  return /(^|\/)lib\/[^/]+$/.test(sourcePath)
}

/**
 * Build one shadcn registry item.
 * `files` is [{ path, content }] with monorepo paths; `versions` maps package name to range.
 */
export function buildShadcnItem(item, files, versions, baseUrl = REGISTRY_BASE_URL) {
  const dependencies = [
    ...new Set([...installableDependencies(item.dependencies ?? []), ...BASE_DEPENDENCIES])
  ].sort()

  const seen = new Set()
  const outFiles = []
  for (const file of files) {
    const base = posix.basename(file.path)
    const lib = isLibFile(file.path)
    const publishedPath = lib ? `lib/${base}` : `ui/${base}`
    if (seen.has(publishedPath)) continue
    seen.add(publishedPath)
    outFiles.push({
      path: publishedPath,
      type: lib ? "registry:lib" : "registry:ui",
      content: canonicalizeImports(file.content, file.path)
    })
  }

  return {
    $schema: ITEM_SCHEMA_URL,
    name: item.name,
    type: "registry:ui",
    title: item.title,
    description: item.description,
    dependencies: dependencies.map((dep) => (versions[dep] ? `${dep}@${versions[dep]}` : dep)),
    ...(item.registryDependencies?.length
      ? { registryDependencies: item.registryDependencies.map((dep) => `${baseUrl}/${dep}.json`) }
      : {}),
    files: outFiles,
    ...(item.category ? { categories: [item.category] } : {}),
    ...(item.provenance ? { meta: { provenance: item.provenance } } : {}),
    docs: `Requires the @glinui/tokens stylesheet. Add: @import "@glinui/tokens/theme.css"; to your global CSS. Docs: https://glinui.com${item.docsPath ?? ""}`
  }
}

/** Build the shadcn registry.json index (items without file contents). */
export function buildShadcnIndex(items, builtItems) {
  return {
    $schema: REGISTRY_SCHEMA_URL,
    name: "glinui",
    homepage: "https://glinui.com",
    items: builtItems.map((built) => ({
      name: built.name,
      type: built.type,
      title: built.title,
      description: built.description,
      dependencies: built.dependencies,
      ...(built.registryDependencies ? { registryDependencies: built.registryDependencies } : {}),
      files: built.files.map((file) => ({ path: file.path, type: file.type }))
    }))
  }
}
