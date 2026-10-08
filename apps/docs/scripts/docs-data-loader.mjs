/**
 * Evaluates the docs data modules (src/lib/component-docs-all.ts, component-docs-extra.ts and
 * everything they import from src/lib) without a TS runtime or a Next build.
 *
 * Each file under src/lib is transpiled in memory with TypeScript's transpileModule (CJS, automatic
 * JSX) and run in a tiny module system. Anything outside src/lib (React components, @glinui/ui,
 * react, next, icons) resolves to an inert stub, so `render` JSX becomes null-like and we keep
 * only titles, descriptions, example code strings, props tables, accessibility and notes.
 */
import { existsSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const ts = require("typescript")

const docsRoot = resolve(fileURLToPath(new URL("..", import.meta.url)))
const srcRoot = join(docsRoot, "src")
const libRoot = join(srcRoot, "lib")
// Showcase demo modules carry the copyable example code strings; their JSX and UI imports resolve to inert stubs.
const demosRoot = join(srcRoot, "components", "demos")

/** Callable, chainable, inert value. Never throws and never recurses when coerced. */
function makeStub() {
  const target = function stub() {}
  const proxy = new Proxy(target, {
    get(_t, key) {
      if (key === "__esModule") return true
      if (key === Symbol.toPrimitive) return () => ""
      if (key === "then") return undefined
      if (key === Symbol.iterator) return function* empty() {}
      if (key === "prototype") return {}
      return proxy
    },
    apply: () => proxy,
    construct: () => proxy,
    has: () => true
  })
  return proxy
}

const stub = makeStub()
const reactStub = new Proxy(
  {},
  {
    get(_t, key) {
      if (key === "__esModule") return true
      if (key === "createElement" || key === "cloneElement") return () => null
      if (key === "Fragment") return "Fragment"
      return stub
    }
  }
)

const jsxRuntimeStub = { jsx: () => null, jsxs: () => null, Fragment: "Fragment" }

const EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ""]

function resolveLocal(spec, fromFile) {
  let base = null
  if (spec.startsWith("@/")) base = join(srcRoot, spec.slice(2))
  else if (spec.startsWith(".")) base = resolve(dirname(fromFile), spec)
  if (!base || !(base.startsWith(libRoot) || base.startsWith(demosRoot))) return null
  for (const ext of EXTENSIONS) if (existsSync(base + ext) && /\.(tsx?|js|mjs)$/.test(base + ext)) return base + ext
  for (const ext of EXTENSIONS.slice(0, 2)) if (existsSync(join(base, `index${ext}`))) return join(base, `index${ext}`)
  return null
}

/** Load the docs data modules. Returns the evaluated module exports for `entry` (a src/lib path). */
export function createDocsLoader() {
  const cache = new Map()

  function load(file) {
    if (cache.has(file)) return cache.get(file).exports
    const module = { exports: {} }
    cache.set(file, module)
    const source = readFileSync(file, "utf8")
    const { outputText } = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true
      }
    })
    const localRequire = (spec) => {
      if (spec === "react") return reactStub
      if (spec === "react/jsx-runtime") return jsxRuntimeStub
      const target = resolveLocal(spec, file)
      if (!target) return stub
      try {
        return load(target)
      } catch (error) {
        console.warn(`[docs-loader] ${target.replace(docsRoot, "")} failed to evaluate, using stub: ${error.message}`)
        return stub
      }
    }
    const run = new Function("exports", "require", "module", "__filename", "__dirname", outputText)
    run(module.exports, localRequire, module, file, dirname(file))
    return module.exports
  }

  return {
    docs: () => load(join(libRoot, "component-docs-all.ts")).allComponentDocs ?? {},
    /** Evaluated exports of a demo module (src/components/demos/<name>.tsx). */
    demo: (name) => load(join(demosRoot, `${name}.tsx`)),
    extras: () => load(join(libRoot, "component-docs-extra.ts")).componentDocExtras ?? {}
  }
}
