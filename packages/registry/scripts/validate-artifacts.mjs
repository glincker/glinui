import { readFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { loadRegistryItems } from "./load-registry-source.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const root = resolve(__dirname, "..", "..", "..")

const artifactsIndexFile = join(root, "packages", "registry", "artifacts", "index.json")

function normalizeItems(items) {
  return items
    .map((item) => ({
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
    .sort((a, b) => a.name.localeCompare(b.name))
}

function loadItemsFromSource() {
  return normalizeItems(loadRegistryItems())
}

function loadItemsFromArtifacts() {
  const source = readFileSync(artifactsIndexFile, "utf8")
  const parsed = JSON.parse(source)

  if (!Array.isArray(parsed.items)) {
    throw new Error("Invalid artifacts index: expected `items` array")
  }

  return normalizeItems(parsed.items)
}

function main() {
  const sourceItems = loadItemsFromSource()
  const artifactItems = loadItemsFromArtifacts()

  const sourceJson = JSON.stringify(sourceItems)
  const artifactJson = JSON.stringify(artifactItems)

  if (sourceJson !== artifactJson) {
    // eslint-disable-next-line no-console
    console.error(
      "registry artifacts are out of date. Run `pnpm --filter @glinui/registry registry:generate`."
    )
    process.exit(1)
  }

  // eslint-disable-next-line no-console
  console.log(`registry artifacts are up to date (${sourceItems.length} items).`)
}

main()
