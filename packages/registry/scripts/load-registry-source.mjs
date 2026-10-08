// Loads the TypeScript registry data (packages/registry/src) without a build step.
// index.ts re-exports from ./provenance.js, so relative requires are resolved here.
import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import vm from "node:vm"
import ts from "typescript"

const __dirname = dirname(fileURLToPath(import.meta.url))
export const repoRoot = resolve(__dirname, "..", "..", "..")
export const registrySrcDir = join(repoRoot, "packages", "registry", "src")

function loadModule(fileName, cache) {
  if (cache.has(fileName)) return cache.get(fileName).exports
  const filePath = join(registrySrcDir, fileName)
  const transpiled = ts.transpileModule(readFileSync(filePath, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
  }).outputText
  const mod = { exports: {} }
  cache.set(fileName, mod)
  const context = vm.createContext({
    module: mod,
    exports: mod.exports,
    require: (specifier) => {
      if (!specifier.startsWith("./")) throw new Error(`Unsupported import "${specifier}" in ${fileName}`)
      return loadModule(`${specifier.slice(2).replace(/\.js$/, "")}.ts`, cache)
    }
  })
  vm.runInContext(transpiled, context, { filename: filePath })
  return mod.exports
}

/** Returns { baseRegistry, provenanceSources, buildProvenance } from the TypeScript sources. */
export function loadRegistryModule() {
  const exported = loadModule("index.ts", new Map())
  if (!Array.isArray(exported.baseRegistry)) {
    throw new Error("Unable to read baseRegistry from packages/registry/src/index.ts")
  }
  return exported
}

export function loadRegistryItems() {
  return loadRegistryModule().baseRegistry
}

export function loadProvenanceSources() {
  return loadRegistryModule().provenanceSources
}
