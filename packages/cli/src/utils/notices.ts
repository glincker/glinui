import fs from "fs-extra"
import path from "path"

/** Provenance carried by registry items that were adapted from other open source projects. */
export type ItemProvenance = {
  sourceId: string
  sourceName: string
  upstreamUrl: string
  license: string
  spdx: string
  copyright: string
  commit: string
  adaptedFrom?: string
  /** Full upstream license text, shipped in the item payload so notices work offline. */
  licenseText?: string
  noticeUrl?: string
}

export const NOTICES_FILE_NAME = "THIRD_PARTY_NOTICES.md"
export const NO_NOTICES_HELP =
  "Do not write THIRD_PARTY_NOTICES.md (you remain bound by the MIT notice of adapted components)"

const HEADER_PATTERN = /^\s*(?:["']use client["'];?\s*)?\/\*\*[\s\S]*?Adapted from[\s\S]*?\*\//

/** True when the file already starts with an attribution comment (after an optional "use client"). */
export function hasAttributionHeader(content: string): boolean {
  return HEADER_PATTERN.test(content.slice(0, 2500))
}

export function buildAttributionHeader(id: string, provenance: ItemProvenance): string {
  const where = provenance.adaptedFrom
    ? `${provenance.upstreamUrl}, ${provenance.adaptedFrom}`
    : provenance.upstreamUrl
  const copyright = provenance.copyright.replace(/^Copyright/, "copyright")
  return [
    "/**",
    ` * Glin UI ${id}. Adapted from ${provenance.sourceName}`,
    ` * (${where}), commit ${provenance.commit}.`,
    ` * Original ${copyright}. Licensed under ${provenance.spdx}.`,
    ` * Modified for Glin UI. See THIRD_PARTY_NOTICES.md#${id}.`,
    " */"
  ].join("\n")
}

const USE_CLIENT = /^(\s*(?:\/\/[^\n]*\n\s*)*)((?:["']use client["'];?)[ \t]*\r?\n)/

/** Prepend the attribution header when missing. Placed after a leading "use client" directive. */
export function ensureAttributionHeader(content: string, id: string, provenance: ItemProvenance): string {
  if (hasAttributionHeader(content)) return content
  const header = buildAttributionHeader(id, provenance)
  const directive = USE_CLIENT.exec(content)
  if (directive) {
    const end = directive[0].length
    return `${content.slice(0, end)}${header}\n${content.slice(end)}`
  }
  return `${header}\n${content}`
}

export type NoticeEntry = {
  provenance: ItemProvenance
  components: string[]
}

const FILE_INTRO = [
  "# Third party notices",
  "",
  "Some components in this project were added with the Glin UI CLI and are adapted from the open source",
  "projects below. Each entry reproduces the upstream copyright and license. Keep this file when you",
  "ship the components."
].join("\n")

function markers(sourceId: string) {
  return { open: `<!-- glinui:notice:${sourceId} -->`, close: `<!-- /glinui:notice:${sourceId} -->` }
}

function renderSection(provenance: ItemProvenance, components: string[]): string {
  const { open, close } = markers(provenance.sourceId)
  const lines = [
    open,
    `## ${provenance.sourceName}`,
    "",
    `- Source: ${provenance.upstreamUrl}`,
    `- License: ${provenance.spdx}`,
    `- Copyright holder: ${provenance.copyright}`,
    `- Commit adapted from: ${provenance.commit}`,
    "- Components:",
    ...components.map((id) => `  - ${id}`)
  ]
  if (provenance.licenseText) {
    lines.push("", "### License text", "", "```text", provenance.licenseText.trimEnd(), "```")
  }
  lines.push(close)
  return lines.join("\n")
}

function existingComponents(section: string): string[] {
  const out: string[] = []
  let inList = false
  for (const line of section.split("\n")) {
    if (line.startsWith("- Components:")) {
      inList = true
      continue
    }
    if (!inList) continue
    const match = /^ {2}- (.+)$/.exec(line)
    if (match) out.push(match[1].trim())
    else break
  }
  return out
}

/** Pure, idempotent merge of notice entries into the text of a user's THIRD_PARTY_NOTICES.md. */
export function mergeNotices(existing: string | null, entries: NoticeEntry[]): string {
  let text = existing && existing.trim().length > 0 ? existing.trimEnd() : FILE_INTRO
  for (const entry of entries) {
    const { open, close } = markers(entry.provenance.sourceId)
    const start = text.indexOf(open)
    const end = start >= 0 ? text.indexOf(close, start) : -1
    if (start >= 0 && end >= 0) {
      const current = text.slice(start, end + close.length)
      const merged = [...new Set([...existingComponents(current), ...entry.components])].sort()
      text = `${text.slice(0, start)}${renderSection(entry.provenance, merged)}${text.slice(end + close.length)}`
    } else {
      const components = [...new Set(entry.components)].sort()
      text = `${text}\n\n${renderSection(entry.provenance, components)}`
    }
  }
  return `${text}\n`
}

/** Collects provenance per source while items are added. */
export class NoticeCollector {
  private readonly bySource = new Map<string, NoticeEntry>()

  add(id: string, provenance: ItemProvenance | undefined) {
    if (!provenance) return
    const entry = this.bySource.get(provenance.sourceId)
    if (entry) {
      if (!entry.components.includes(id)) entry.components.push(id)
      if (!entry.provenance.licenseText && provenance.licenseText) entry.provenance = provenance
    } else {
      this.bySource.set(provenance.sourceId, { provenance, components: [id] })
    }
  }

  entries(): NoticeEntry[] {
    return [...this.bySource.values()]
  }

  get size() {
    return this.bySource.size
  }
}

/** Write or update THIRD_PARTY_NOTICES.md in the project root. Returns the path, or null when nothing to write. */
export async function writeNotices(cwd: string, entries: NoticeEntry[], dryRun: boolean): Promise<string | null> {
  if (entries.length === 0) return null
  const file = path.join(cwd, NOTICES_FILE_NAME)
  const existing = (await fs.pathExists(file)) ? await fs.readFile(file, "utf8") : null
  const next = mergeNotices(existing, entries)
  if (!dryRun && next !== existing) await fs.writeFile(file, next, "utf8")
  return file
}
