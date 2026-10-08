import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

/** Build-time changelog reader. Runs in server components only (uses fs). */
export type ChangelogPackage = { id: string; name: string; dir: string }

export const changelogPackages: readonly ChangelogPackage[] = [
  { id: "ui", name: "@glinui/ui", dir: "packages/ui" },
  { id: "tokens", name: "@glinui/tokens", dir: "packages/tokens" },
  { id: "cli", name: "glinui", dir: "packages/cli" },
  { id: "registry", name: "@glinui/registry", dir: "packages/registry" },
  { id: "motion", name: "@glinui/motion", dir: "packages/motion" }
]

export type ChangelogGroup = { title: string; items: string[] }
export type ChangelogEntry = { anchor: string; packageId: string; packageName: string; version: string; groups: ChangelogGroup[] }

/** Parses changesets-style markdown: `## 1.2.3`, optional `### Minor Changes`, then `- item` lines. */
export function parseChangelog(markdown: string, pkg: Pick<ChangelogPackage, "id" | "name">): ChangelogEntry[] {
  const entries: ChangelogEntry[] = []
  let current: ChangelogEntry | null = null
  let group: ChangelogGroup | null = null
  for (const line of markdown.split(/\r?\n/)) {
    const version = /^##\s+\[?v?(\d+\.\d+\.\d+[^\]\s]*)\]?/.exec(line)
    if (version) {
      current = { anchor: `${pkg.id}-${version[1]}`, packageId: pkg.id, packageName: pkg.name, version: version[1], groups: [] }
      group = null
      entries.push(current)
      continue
    }
    if (!current) continue
    const heading = /^###\s+(.+)$/.exec(line)
    if (heading) {
      group = { title: heading[1].trim(), items: [] }
      current.groups.push(group)
      continue
    }
    const bullet = /^[-*]\s+(.+)$/.exec(line)
    if (bullet) {
      if (!group) {
        group = { title: "Changes", items: [] }
        current.groups.push(group)
      }
      group.items.push(bullet[1].trim())
    } else if (group && group.items.length > 0 && /^\s{2,}\S/.test(line)) {
      group.items[group.items.length - 1] += ` ${line.trim()}`
    }
  }
  return entries
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(/[.-]/).map((n) => Number.parseInt(n, 10) || 0)
  const pb = b.split(/[.-]/).map((n) => Number.parseInt(n, 10) || 0)
  for (let i = 0; i < 3; i += 1) if (pa[i] !== pb[i]) return (pb[i] ?? 0) - (pa[i] ?? 0)
  return 0
}

export type ChangelogData = { entries: ChangelogEntry[]; missing: ChangelogPackage[] }

export function readChangelogs(repoRoot = join(process.cwd(), "../..")): ChangelogData {
  const entries: ChangelogEntry[] = []
  const missing: ChangelogPackage[] = []
  for (const pkg of changelogPackages) {
    const file = join(repoRoot, pkg.dir, "CHANGELOG.md")
    if (!existsSync(file)) {
      missing.push(pkg)
      continue
    }
    entries.push(...parseChangelog(readFileSync(file, "utf8"), pkg))
  }
  entries.sort((a, b) => compareVersions(a.version, b.version))
  return { entries, missing }
}
