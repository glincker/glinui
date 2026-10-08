import {
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { loadRegistryModule } from "./load-registry-source.mjs"
import { verifyLicenseSnapshots } from "./provenance-files.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, "..", "..", "..")

const artifactsDir = join(root, "packages", "registry", "artifacts")
const itemsDir = join(artifactsDir, "items")
const typesDir = join(artifactsDir, "types")
const indexFile = join(artifactsDir, "index.json")

function loadRegistryItems() {
  const { baseRegistry: items, provenanceSources } = loadRegistryModule()
  const problems = verifyLicenseSnapshots(provenanceSources)
  if (problems.length > 0) {
    throw new Error(`License snapshot verification failed:\n${problems.join("\n")}`)
  }

  return items.map((item) => ({
    name: String(item.name),
    namespace: "@glinui",
    type: item.type === "signature" ? "signature" : "primitive",
    title: String(item.title),
    description: String(item.description),
    docsPath: String(item.docsPath),
    importPath: String(item.importPath),
    dependencies: Array.isArray(item.dependencies)
      ? item.dependencies.map((dep) => String(dep))
      : [],
    ...(typeof item.category === "string" ? { category: item.category } : {}),
    ...(Array.isArray(item.registryDependencies)
      ? { registryDependencies: item.registryDependencies.map((dep) => String(dep)) }
      : {}),
    files: Array.isArray(item.files) ? item.files.map((file) => String(file)) : [],
    install: {
      package: String(item.install?.package ?? ""),
      registry: String(item.install?.registry ?? "")
    },
    ...(item.provenance ? { provenance: item.provenance } : {})
  }))
}

function stableStringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function writeJsonIfChanged(filePath, value) {
  const next = stableStringify(value)
  try {
    const prev = readFileSync(filePath, "utf8")
    if (prev === next) {
      return false
    }
  } catch {
    // File does not exist yet.
  }
  writeFileSync(filePath, next, "utf8")
  return true
}

function cleanupStaleItemFiles(validNames) {
  const existing = readdirSync(itemsDir, { withFileTypes: true })
  for (const entry of existing) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) {
      continue
    }
    const componentName = entry.name.replace(/\.json$/, "")
    if (!validNames.has(componentName)) {
      rmSync(join(itemsDir, entry.name))
    }
  }
}

function build() {
  const generatedAt = new Date().toISOString()
  const items = loadRegistryItems().sort((a, b) => a.name.localeCompare(b.name))

  mkdirSync(artifactsDir, { recursive: true })
  mkdirSync(itemsDir, { recursive: true })
  mkdirSync(typesDir, { recursive: true })

  let changedFiles = 0

  const allByName = Object.fromEntries(items.map((item) => [item.name, item]))
  const primitiveItems = items.filter((item) => item.type === "primitive")
  const signatureItems = items.filter((item) => item.type === "signature")

  changedFiles += Number(
    writeJsonIfChanged(indexFile, {
      generatedAt,
      count: items.length,
      primitives: primitiveItems.length,
      signatures: signatureItems.length,
      items
    })
  )
  changedFiles += Number(writeJsonIfChanged(join(typesDir, "primitive.json"), primitiveItems))
  changedFiles += Number(writeJsonIfChanged(join(typesDir, "signature.json"), signatureItems))
  changedFiles += Number(writeJsonIfChanged(join(artifactsDir, "by-name.json"), allByName))

  const validNames = new Set(items.map((item) => item.name))
  cleanupStaleItemFiles(validNames)

  for (const item of items) {
    changedFiles += Number(writeJsonIfChanged(join(itemsDir, `${item.name}.json`), item))
  }

  // eslint-disable-next-line no-console
  console.log(
    `generated registry artifacts (${items.length} items, ${changedFiles} files changed) -> ${artifactsDir}`
  )
}

build()
