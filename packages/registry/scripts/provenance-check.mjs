// Consistency checks between registry provenance data, license snapshots and source file headers.
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { repoRoot } from "./load-registry-source.mjs"
import { verifyLicenseSnapshots } from "./provenance-files.mjs"

const COMMIT_PATTERN = /^[0-9a-f]{40}$/
const HEADER_MARKER = /Adapted from/

export function componentsDir(root = repoRoot) {
  return join(root, "packages", "ui", "src", "components")
}

/** [{ id, content }] for every component source that carries an "Adapted from" header. */
export function readHeaderedComponents(root = repoRoot) {
  const dir = componentsDir(root)
  return readdirSync(dir)
    .filter((name) => /\.tsx?$/.test(name))
    .map((name) => ({ id: name.replace(/\.tsx?$/, ""), content: readFileSync(join(dir, name), "utf8") }))
    .filter((file) => HEADER_MARKER.test(file.content.slice(0, 2500)))
}

/** Header template (see docs-local/PORTING.md section 3): attribution lines present, no em or en dashes. */
export function checkHeaderTemplate(file) {
  const problems = []
  const match = /\/\*\*[\s\S]*?\*\//.exec(file.content.slice(0, 2500))
  const header = match ? match[0] : ""
  if (!/^\/\*\*\n \* Glin UI [^\n]+\(/.test(header)) problems.push(`${file.id}: header must start with "Glin UI <Title> (<id>)."`)
  if (!header.includes(`(${file.id})`)) problems.push(`${file.id}: header must name the component id`)
  if (!/Original copyright \(c\) /.test(header)) problems.push(`${file.id}: header lacks "Original copyright (c)"`)
  if (!/Licensed under MIT\./.test(header)) problems.push(`${file.id}: header lacks "Licensed under MIT."`)
  if (!/Modified for Glin UI:/.test(header)) problems.push(`${file.id}: header lacks "Modified for Glin UI:"`)
  if (!header.includes(`THIRD_PARTY_NOTICES.md#${file.id}`)) problems.push(`${file.id}: header lacks the THIRD_PARTY_NOTICES.md#${file.id} pointer`)
  if (/[\u2013\u2014]/.test(header)) problems.push(`${file.id}: header contains an em or en dash`)
  return problems
}

/**
 * Returns a list of problems. `components` maps a component id to its source text
 * (only needed for adapted items); `headered` is readHeaderedComponents().
 */
export function crossCheckProvenance({ items, sources, headered, readComponent }) {
  const problems = []
  const adapted = items.filter((item) => item.provenance)

  for (const item of adapted) {
    const p = item.provenance
    const source = sources[p.sourceId]
    if (!source) {
      problems.push(`${item.name}: unknown provenance source "${p.sourceId}"`)
      continue
    }
    if (!COMMIT_PATTERN.test(p.commit)) problems.push(`${item.name}: commit must be a 40 char sha`)
    for (const key of ["licenseSha256", "licenseSnapshotPath", "commit", "spdx", "copyright"]) {
      if (p[key] !== source[key]) problems.push(`${item.name}: provenance.${key} does not match source ${source.id}`)
    }
    const content = readComponent(item.name)
    if (content === null) {
      problems.push(`${item.name}: component source file not found`)
    } else if (!HEADER_MARKER.test(content.slice(0, 2500)) || !content.includes(p.commit)) {
      problems.push(`${item.name}: source file lacks the "Adapted from" header with commit ${p.commit}`)
    }
  }

  const adaptedIds = new Set(adapted.map((item) => item.name))
  for (const file of headered) {
    if (!adaptedIds.has(file.id)) problems.push(`${file.id}: has an "Adapted from" header but no registry provenance`)
  }
  return problems
}

export function checkAll({ items, sources, root = repoRoot }) {
  const dir = componentsDir(root)
  const readComponent = (id) => {
    for (const ext of ["tsx", "ts"]) {
      try {
        return readFileSync(join(dir, `${id}.${ext}`), "utf8")
      } catch {
        // try next extension
      }
    }
    return null
  }
  return [
    ...verifyLicenseSnapshots(sources, root),
    ...crossCheckProvenance({ items, sources, headered: readHeaderedComponents(root), readComponent }),
    ...readHeaderedComponents(root).flatMap(checkHeaderTemplate)
  ]
}
