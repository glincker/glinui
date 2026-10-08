import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const registryRoot = join(process.cwd(), "public", "r")
const RESERVED = new Set(["index", "schema", "registry"])

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"))
const importSpecifiers = (content) =>
  [...content.matchAll(/(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])([^"'\n]+)\1/g)].map((m) => m[2])

const itemFiles = readdirSync(registryRoot).filter(
  (entry) => entry.endsWith(".json") && !RESERVED.has(entry.replace(/\.json$/, ""))
)

test("shadcn registry exposes one item per Glin item plus a registry.json index", () => {
  const glinIndex = readJson(join(registryRoot, "index.json"))
  assert.equal(itemFiles.length, glinIndex.length)

  const registry = readJson(join(registryRoot, "registry.json"))
  assert.equal(registry.$schema, "https://ui.shadcn.com/schema/registry.json")
  assert.equal(registry.items.length, glinIndex.length)
  for (const entry of registry.items) {
    assert.ok(existsSync(join(registryRoot, `${entry.name}.json`)), `${entry.name}.json should exist`)
  }
})

test("shadcn items use aliasable imports only", () => {
  for (const entry of itemFiles) {
    const item = readJson(join(registryRoot, entry))
    assert.equal(item.$schema, "https://ui.shadcn.com/schema/registry-item.json")
    assert.equal(item.type, "registry:ui")
    assert.ok(item.files.length > 0, `${item.name} should have files`)
    assert.ok(!item.dependencies.some((dep) => dep.startsWith("@glinui/ui")), `${item.name} must not depend on @glinui/ui`)

    for (const dep of item.registryDependencies ?? []) {
      assert.match(dep, /^https:\/\/glinui\.com\/r\/[a-z0-9-]+\.json$/)
      assert.ok(existsSync(join(registryRoot, dep.split("/").pop())), `${item.name} -> ${dep} must exist`)
    }

    for (const file of item.files) {
      assert.ok(["registry:ui", "registry:lib", "registry:hook"].includes(file.type))
      for (const specifier of importSpecifiers(file.content)) {
        assert.ok(!specifier.startsWith("."), `${item.name}/${file.path} has relative import ${specifier}`)
        assert.ok(!specifier.startsWith("@glinui/ui"), `${item.name}/${file.path} imports ${specifier}`)
        if (specifier.startsWith("@/")) {
          assert.match(specifier, /^@\/(lib\/[a-z0-9-]+|components\/ui\/[a-z0-9-]+)$/, `${item.name}: ${specifier}`)
        }
      }
    }
  }
})

test("every aliased import in a shadcn item resolves to a file or registry dependency", () => {
  for (const entry of itemFiles) {
    const item = readJson(join(registryRoot, entry))
    const own = new Set(item.files.map((file) => file.path.replace(/\.tsx?$/, "")))
    const required = new Set((item.registryDependencies ?? []).map((url) => url.split("/").pop().replace(/\.json$/, "")))

    for (const file of item.files) {
      for (const specifier of importSpecifiers(file.content)) {
        if (specifier === "@/lib/utils") continue
        const local = /^@\/(lib|components\/ui)\/(.+)$/.exec(specifier)
        if (!local) continue
        const folder = local[1] === "lib" ? "lib" : "ui"
        assert.ok(
          own.has(`${folder}/${local[2]}`) || required.has(local[2]),
          `${item.name}: ${specifier} is neither a bundled file nor a registryDependency`
        )
      }
    }
  }
})

test("Glin item payloads declare every bare import as a dependency", () => {
  for (const entry of readdirSync(join(registryRoot, "items"))) {
    const item = readJson(join(registryRoot, "items", entry))
    const declared = new Set(item.dependencies)
    for (const file of item.files) {
      for (const specifier of importSpecifiers(file.content)) {
        if (specifier.startsWith(".") || specifier.startsWith("@/")) continue
        const parts = specifier.split("/")
        const pkg = specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
        if (pkg === "react" || pkg === "react-dom") continue
        assert.ok(declared.has(pkg), `${item.name} imports ${pkg} but does not declare it`)
      }
    }
  }
})
