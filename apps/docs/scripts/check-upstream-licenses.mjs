// Upstream license watch.
// Usage: node scripts/check-upstream-licenses.mjs [--offline] [--out <dir>] [--json]
//   --offline  verify the tracked license snapshots against the recorded sha256 only (no network)
//   --out      directory for license-watch-report.json and .md (default: <repo>/.license-watch)
// Exit codes: 0 no change, 1 change detected, 2 network or API failure (no verdict).
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { loadProvenanceSources, repoRoot } from "../../../packages/registry/scripts/load-registry-source.mjs"
import { readLicenseSnapshot, sha256 } from "../../../packages/registry/scripts/provenance-files.mjs"

const RAW_BASE = "https://raw.githubusercontent.com"
const API_BASE = "https://api.github.com"

function apiHeaders() {
  const headers = { Accept: "application/vnd.github+json", "User-Agent": "glinui-license-watch" }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  return headers
}

/** Offline check: local snapshot versus the recorded hash. */
export function checkSnapshot(source, root = repoRoot) {
  const changes = []
  try {
    const actual = sha256(readLicenseSnapshot(source, root))
    if (actual !== source.licenseSha256) {
      changes.push({ kind: "snapshot-mismatch", detail: `snapshot sha256 ${actual} differs from recorded ${source.licenseSha256}` })
    }
  } catch {
    changes.push({ kind: "snapshot-missing", detail: `no snapshot at ${source.licenseSnapshotPath}` })
  }
  return changes
}

/** Maps detected changes to the status the registry should record. */
export function suggestStatus(changes, current = "active") {
  const kinds = new Set(changes.map((change) => change.kind))
  if (kinds.has("repo-gone")) return "gone"
  if (kinds.has("license-changed") || kinds.has("license-spdx-changed")) return "relicensed"
  if (kinds.has("repo-archived")) return "archived"
  return current
}

async function getJson(fetchImpl, url) {
  const response = await fetchImpl(url, { headers: apiHeaders(), redirect: "follow" })
  return { status: response.status, body: response.ok ? await response.json() : null }
}

/** Online check for one source. `fetchImpl` is injectable for tests. */
export async function checkSourceOnline(source, fetchImpl = fetch) {
  const changes = []
  const errors = []
  const repoSlug = `${source.owner}/${source.repo}`

  try {
    const raw = await fetchImpl(`${RAW_BASE}/${repoSlug}/HEAD/${source.licensePath}`, { redirect: "follow" })
    if (raw.status === 404) {
      changes.push({ kind: "license-missing", detail: `${source.licensePath} no longer exists at HEAD` })
    } else if (!raw.ok) {
      errors.push(`raw license fetch returned ${raw.status}`)
    } else {
      const upstream = sha256(await raw.text())
      if (upstream !== source.licenseSha256) {
        changes.push({ kind: "license-changed", detail: `upstream sha256 ${upstream} differs from recorded ${source.licenseSha256}` })
      }
    }
  } catch (error) {
    errors.push(`raw license fetch failed: ${error instanceof Error ? error.message : "unknown"}`)
  }

  try {
    const repo = await getJson(fetchImpl, `${API_BASE}/repos/${repoSlug}`)
    if (repo.status === 404 || repo.status === 451) {
      changes.push({ kind: "repo-gone", detail: `repository returned ${repo.status}` })
    } else if (!repo.body) {
      errors.push(`repo API returned ${repo.status}`)
    } else {
      if (repo.body.archived === true) changes.push({ kind: "repo-archived", detail: "repository is archived" })
      const fullName = typeof repo.body.full_name === "string" ? repo.body.full_name : repoSlug
      if (fullName.toLowerCase() !== repoSlug.toLowerCase()) {
        changes.push({ kind: "repo-renamed", detail: `repository is now ${fullName}` })
      }
    }

    const license = await getJson(fetchImpl, `${API_BASE}/repos/${repoSlug}/license`)
    const spdx = license.body?.license?.spdx_id
    if (typeof spdx === "string" && spdx !== source.spdx) {
      changes.push({ kind: "license-spdx-changed", detail: `GitHub reports ${spdx}, recorded ${source.spdx}` })
    }
  } catch (error) {
    errors.push(`GitHub API failed: ${error instanceof Error ? error.message : "unknown"}`)
  }

  return { changes, errors }
}

export async function runCheck({ sources, offline = false, fetchImpl = fetch, root = repoRoot, now = new Date() }) {
  const results = []
  for (const source of Object.values(sources)) {
    const snapshotChanges = checkSnapshot(source, root)
    const online = offline ? { changes: [], errors: [] } : await checkSourceOnline(source, fetchImpl)
    const changes = [...snapshotChanges, ...online.changes]
    results.push({
      id: source.id,
      name: source.name,
      status: source.status,
      changes,
      errors: online.errors,
      suggestedStatus: suggestStatus(changes, source.status)
    })
  }
  const changed = results.some((result) => result.changes.length > 0)
  const failed = results.some((result) => result.errors.length > 0)
  return {
    generatedAt: now.toISOString(),
    offline,
    changed,
    failed,
    exitCode: changed ? 1 : failed ? 2 : 0,
    results
  }
}

export function renderReport(report) {
  const lines = [
    "# Upstream license watch",
    "",
    `Generated ${report.generatedAt} (${report.offline ? "offline snapshot check" : "online check"}).`,
    ""
  ]
  for (const result of report.results) {
    const verdict = result.changes.length > 0 ? "CHANGED" : result.errors.length > 0 ? "UNVERIFIED" : "ok"
    lines.push(`## ${result.name}: ${verdict}`, "")
    for (const change of result.changes) lines.push(`- ${change.kind}: ${change.detail}`)
    for (const error of result.errors) lines.push(`- error: ${error}`)
    if (result.suggestedStatus !== result.status) {
      lines.push(`- Suggested status update: \`${result.status}\` to \`${result.suggestedStatus}\` in packages/registry/src/provenance.ts`)
    }
    if (result.changes.length === 0 && result.errors.length === 0) lines.push("No change.")
    lines.push("")
  }
  return `${lines.join("\n").trimEnd()}\n`
}

async function main() {
  const args = process.argv.slice(2)
  const outIndex = args.indexOf("--out")
  const outDir = outIndex >= 0 ? args[outIndex + 1] : join(repoRoot, ".license-watch")
  const report = await runCheck({ sources: loadProvenanceSources(), offline: args.includes("--offline") })
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, "license-watch-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8")
  writeFileSync(join(outDir, "license-watch-report.md"), renderReport(report), "utf8")
  console.log(renderReport(report))
  process.exit(report.exitCode)
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main()
}
