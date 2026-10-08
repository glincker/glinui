// Filesystem helpers for provenance: license snapshot hashing and verification.
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { repoRoot } from "./load-registry-source.mjs"

export function sha256(text) {
  return createHash("sha256").update(text).digest("hex")
}

export function readLicenseSnapshot(source, root = repoRoot) {
  return readFileSync(join(root, source.licenseSnapshotPath), "utf8")
}

/** Returns a list of human readable problems (empty when every snapshot matches). */
export function verifyLicenseSnapshots(sources, root = repoRoot) {
  const problems = []
  for (const source of Object.values(sources)) {
    try {
      const actual = sha256(readLicenseSnapshot(source, root))
      if (actual !== source.licenseSha256) {
        problems.push(`${source.id}: snapshot sha256 ${actual} does not match recorded ${source.licenseSha256}`)
      }
    } catch {
      problems.push(`${source.id}: license snapshot missing at ${source.licenseSnapshotPath}`)
    }
  }
  return problems
}

/** Adapted items only, as [item, source] pairs. */
export function adaptedItems(items, sources) {
  return items
    .filter((item) => item.provenance)
    .map((item) => [item, sources[item.provenance.sourceId]])
}
