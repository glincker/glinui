// Derives the true install graph of a registry item from its sources, so hand-written
// dependency lists in packages/registry/src cannot drift from the imports in the code.
import { posix } from "node:path"

const SPECIFIER_PATTERN = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\1/g
const PROVIDED_BY_HOST = new Set(["react", "react-dom"])
const SRC = "packages/ui/src"

export function packageNameOf(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function specifiersOf(content) {
  return [...content.matchAll(SPECIFIER_PATTERN)].map((match) => match[2])
}

/**
 * Resolve the complete file list, npm dependencies and registry dependencies of an item.
 * `readSource(path)` returns file content or null when the file does not exist.
 * `itemNames` is the set of registry item names.
 */
export function resolveItemGraph(item, readSource, itemNames) {
  const files = []
  const queue = [...(item.files ?? [])].filter(
    (file) => file.startsWith(`${SRC}/`) && !file.startsWith(`${SRC}/tests/`)
  )
  const declared = new Set(queue)
  const seen = new Set()
  const dependencies = new Set(item.dependencies ?? [])
  const registryDependencies = new Set(item.registryDependencies ?? [])

  while (queue.length > 0) {
    const file = queue.shift()
    if (seen.has(file)) continue
    seen.add(file)

    const content = readSource(file)
    if (content === null) throw new Error(`Missing source file ${file} for registry item "${item.name}"`)
    files.push({ path: file, content })

    for (const specifier of specifiersOf(content)) {
      if (!specifier.startsWith(".")) {
        const pkg = packageNameOf(specifier)
        if (!PROVIDED_BY_HOST.has(pkg) && !pkg.startsWith("node:")) dependencies.add(pkg)
        continue
      }

      const resolved = posix.normalize(posix.join(posix.dirname(file), specifier))
      const match = /^(.*\/(components|lib))\/([^/]+)$/.exec(resolved)
      if (!match) throw new Error(`Cannot classify import "${specifier}" in ${file}`)
      const [, directory, folder, name] = match
      if (folder === "lib" && (name === "cn" || name === "utils")) continue

      const candidate = ["tsx", "ts"].map((ext) => `${directory}/${name}.${ext}`).find((p) => readSource(p) !== null)
      if (!candidate) throw new Error(`Import "${specifier}" in ${file} does not resolve to a source file`)

      if (folder === "components" && name !== item.name && itemNames.has(name) && !declared.has(candidate) && !seen.has(candidate)) {
        registryDependencies.add(name)
      } else if (!seen.has(candidate)) {
        queue.push(candidate)
      }
    }
  }

  // Primary file first, then the rest in discovery order.
  const primary = `${SRC}/components/${item.name}.tsx`
  files.sort((a, b) => Number(b.path === primary) - Number(a.path === primary))

  return {
    files,
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort()
  }
}
