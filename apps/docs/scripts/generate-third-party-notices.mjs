// Generates THIRD_PARTY_NOTICES.md from the registry provenance data.
// Usage: node scripts/generate-third-party-notices.mjs [--check]
//   (no flag)  write THIRD_PARTY_NOTICES.md at the repo root and sync copies into the published packages
//   --check    exit 1 when the committed files are out of date
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { loadRegistryModule, repoRoot } from "../../../packages/registry/scripts/load-registry-source.mjs"
import { readLicenseSnapshot } from "../../../packages/registry/scripts/provenance-files.mjs"

export const NOTICES_FILE = "THIRD_PARTY_NOTICES.md"
/** Packages that ship the notice file and the license snapshots. */
export const PACKAGE_DIRS = ["packages/ui", "packages/cli", "packages/registry"]

function escapeCell(text) {
  return String(text).replace(/\|/g, "\\|")
}

function ourPath(item) {
  const files = item.files ?? []
  return (
    files.find((file) => file.endsWith(`/components/${item.name}.tsx`)) ??
    files.find((file) => /\/components\/[^/]+\.tsx$/.test(file)) ??
    files[0] ??
    ""
  )
}

function upstreamPaths(provenance) {
  return provenance.adaptedFrom ?? ""
}

/** Pure renderer: sources map, registry items and a license reader in, markdown out. */
export function renderNotices({ sources, items, readLicense }) {
  const lines = [
    "# Third party notices",
    "",
    "Glin UI is MIT licensed. Some components are adapted from the open source projects below.",
    "Each entry reproduces the upstream copyright and license. This file is generated from the",
    "registry provenance data by `pnpm --filter @glinui/docs notices:generate`. Do not edit it by hand.",
    ""
  ]

  for (const source of Object.values(sources)) {
    const adapted = items
      .filter((item) => item.provenance?.sourceId === source.id)
      .sort((a, b) => a.name.localeCompare(b.name))

    lines.push(`## ${source.name}`, "")
    lines.push(`- Source: ${source.upstreamUrl}`)
    lines.push(`- Website: ${source.siteUrl}`)
    lines.push(`- License: ${source.spdx}`)
    lines.push(`- Copyright holder: ${source.copyright}`)
    lines.push(`- Commit adapted from: ${source.commit}`)
    lines.push(`- License snapshot: ${source.licenseSnapshotPath} (sha256 ${source.licenseSha256})`)
    lines.push("", "### Adapted components", "")
    if (adapted.length === 0) {
      lines.push("No components from this source are registered yet.", "")
    } else {
      lines.push("| Component | Glin UI path | Upstream path |", "| --- | --- | --- |")
      for (const item of adapted) {
        lines.push(
          `| <a id="${item.name}"></a>${escapeCell(item.name)} | ${escapeCell(ourPath(item))} | ${escapeCell(upstreamPaths(item.provenance))} |`
        )
      }
      lines.push("")
    }
    lines.push("### License text", "", "```text", readLicense(source).trimEnd(), "```", "")
  }

  return `${lines.join("\n").trimEnd()}\n`
}

export function buildNotices(root = repoRoot) {
  const { baseRegistry, provenanceSources } = loadRegistryModule()
  return renderNotices({
    sources: provenanceSources,
    items: baseRegistry,
    readLicense: (source) => readLicenseSnapshot(source, root)
  })
}

/** Files that must exist and match: [absolute path, expected content]. */
export function expectedOutputs(root = repoRoot) {
  const notices = buildNotices(root)
  const { provenanceSources } = loadRegistryModule()
  const outputs = [[join(root, NOTICES_FILE), notices]]
  for (const dir of PACKAGE_DIRS) {
    outputs.push([join(root, dir, NOTICES_FILE), notices])
  }
  for (const dir of ["packages/ui", "packages/cli"]) {
    for (const source of Object.values(provenanceSources)) {
      const name = source.licenseSnapshotPath.split("/").pop()
      outputs.push([join(root, dir, "licenses", name), readLicenseSnapshot(source, root)])
    }
  }
  return outputs
}

function isUpToDate([file, expected]) {
  try {
    return readFileSync(file, "utf8") === expected
  } catch {
    return false
  }
}

function main() {
  const outputs = expectedOutputs()
  if (process.argv.includes("--check")) {
    const stale = outputs.filter((entry) => !isUpToDate(entry)).map(([file]) => relative(repoRoot, file))
    if (stale.length > 0) {
      console.error(`Out of date, run \`pnpm --filter @glinui/docs notices:generate\`:\n${stale.join("\n")}`)
      process.exit(1)
    }
    console.log("third party notices are up to date")
    return
  }
  for (const [file, content] of outputs) {
    mkdirSync(join(file, ".."), { recursive: true })
    writeFileSync(file, content, "utf8")
  }
  console.log(`wrote ${outputs.length} notice files`)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main()
}

