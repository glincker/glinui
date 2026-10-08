/**
 * Provenance model for components adapted from MIT licensed projects.
 *
 * This module is pure data plus pure helpers (no fs access) so it can be bundled in
 * the docs app and loaded by the generation scripts. License snapshot hashes are
 * recorded here and re-verified against the tracked snapshot files by the
 * generation scripts and by the registry tests.
 */

export type ProvenanceStatus = "active" | "archived" | "relicensed" | "gone"

export type ProvenanceUpstreamInstall = {
  shadcn?: string
  npm?: string
  docs?: string
}

export type Provenance = {
  sourceId: string
  sourceName: string
  author?: string
  upstreamUrl: string
  upstreamComponentUrl?: string
  license: string
  spdx: string
  copyright: string
  commit: string
  adaptedFrom?: string
  adaptedAt?: string
  status: ProvenanceStatus
  licenseSha256: string
  licenseSnapshotPath: string
  upstreamInstall?: ProvenanceUpstreamInstall
  /** Short summary of what Glin UI changed, shown on the attribution page. */
  changes?: string
}

export type ProvenanceSource = {
  id: string
  name: string
  author: string
  /** GitHub owner and repo, used by the upstream license watch. */
  owner: string
  repo: string
  /** Repo root URL. */
  upstreamUrl: string
  siteUrl: string
  license: string
  spdx: string
  /** Exact copyright line from the upstream LICENSE file. */
  copyright: string
  /** Pinned upstream commit the code was taken from. */
  commit: string
  /** Path of the LICENSE file inside the upstream repo. */
  licensePath: string
  status: ProvenanceStatus
  /** sha256 of the tracked snapshot file below (verified by tests and scripts). */
  licenseSha256: string
  /** Repo root relative path of the tracked license snapshot. */
  licenseSnapshotPath: string
  /** Optional templates; `{component}` is replaced with the upstream component name. */
  componentUrlTemplate?: string
  upstreamInstallTemplate?: ProvenanceUpstreamInstall
}

export const DEFAULT_ADAPTED_AT = "2026-10-07"

export const provenanceSources: Record<string, ProvenanceSource> = {
  "magic-ui": {
    id: "magic-ui",
    name: "Magic UI",
    author: "Magic UI",
    owner: "magicuidesign",
    repo: "magicui",
    upstreamUrl: "https://github.com/magicuidesign/magicui",
    siteUrl: "https://magicui.design",
    license: "MIT",
    spdx: "MIT",
    copyright: "Copyright (c) Magic UI",
    commit: "cdb348cb4c72a9b54b554d8617801e479fbc8714",
    licensePath: "LICENSE.md",
    status: "active",
    licenseSha256: "0147b84235ed916b8b4e89c1f80655351c5afe7d211b629be61f553a227b34ba",
    licenseSnapshotPath: "packages/registry/licenses/magic-ui-cdb348c.txt",
    componentUrlTemplate: "https://magicui.design/docs/components/{component}",
    upstreamInstallTemplate: {
      shadcn: 'npx shadcn@latest add "https://magicui.design/r/{component}"'
    }
  },
  "vengeance-ui": {
    id: "vengeance-ui",
    name: "Vengeance UI",
    author: "Ashutoshx7",
    owner: "Ashutoshx7",
    repo: "VengeanceUI",
    upstreamUrl: "https://github.com/Ashutoshx7/VengeanceUI",
    siteUrl: "https://www.vengenceui.com",
    license: "MIT",
    spdx: "MIT",
    copyright: "Copyright (c) 2025-2026 Ashutoshx7",
    commit: "0376d8e37b4a565016cce1064d7b96905c4494ab",
    licensePath: "LICENSE",
    status: "active",
    licenseSha256: "b90027fc729c84a7e3b976b046996a685f5b1a2f448f5bc3514ce32314b77c46",
    licenseSnapshotPath: "packages/registry/licenses/vengeance-ui-0376d8e.txt"
  },
  "motion-primitives": {
    id: "motion-primitives",
    name: "Motion Primitives",
    author: "ibelick",
    owner: "ibelick",
    repo: "motion-primitives",
    upstreamUrl: "https://github.com/ibelick/motion-primitives",
    siteUrl: "https://motion-primitives.com",
    license: "MIT",
    spdx: "MIT",
    copyright: "Copyright (c) 2024 ibelick",
    commit: "120f64f6ca60348e251f929e9c81f11ccbe45eda",
    licensePath: "LICENCE.md",
    status: "active",
    licenseSha256: "f668f5ef3635eb906f10b1eea9a32e449eb6e1a183ab6879ef6d56c0980dd2f3",
    licenseSnapshotPath: "packages/registry/licenses/motion-primitives-120f64f.txt",
    componentUrlTemplate: "https://motion-primitives.com/docs/{component}",
    upstreamInstallTemplate: {
      shadcn: 'npx shadcn@latest add "https://motion-primitives.com/c/{component}.json"'
    }
  }
}

export type BuildProvenanceOptions = {
  /** Upstream component name, for example "shine-border". */
  component: string
  /** Repo relative upstream path or paths the component was adapted from. */
  adaptedFrom?: string | string[]
  adaptedAt?: string
  /** Short summary of what Glin UI changed. */
  changes?: string
}

function fill(template: string, component: string) {
  return template.split("{component}").join(component)
}

export function getProvenanceSource(sourceId: string): ProvenanceSource {
  const source = provenanceSources[sourceId]
  if (!source) {
    throw new Error(`Unknown provenance source "${sourceId}"`)
  }
  return source
}

/** Build the provenance object an adapted registry item declares. */
export function buildProvenance(sourceId: string, options: BuildProvenanceOptions): Provenance {
  const source = getProvenanceSource(sourceId)
  const paths = Array.isArray(options.adaptedFrom)
    ? options.adaptedFrom
    : options.adaptedFrom
      ? [options.adaptedFrom]
      : []

  const upstreamComponentUrl = source.componentUrlTemplate
    ? fill(source.componentUrlTemplate, options.component)
    : paths.length > 0
      ? `${source.upstreamUrl}/blob/${source.commit}/${paths[0]}`
      : source.upstreamUrl

  const template = source.upstreamInstallTemplate
  const upstreamInstall: ProvenanceUpstreamInstall | undefined = template
    ? {
        ...(template.shadcn ? { shadcn: fill(template.shadcn, options.component) } : {}),
        ...(template.npm ? { npm: fill(template.npm, options.component) } : {}),
        ...(template.docs ? { docs: fill(template.docs, options.component) } : {})
      }
    : undefined

  return {
    sourceId: source.id,
    sourceName: source.name,
    author: source.author,
    upstreamUrl: source.upstreamUrl,
    upstreamComponentUrl,
    license: source.license,
    spdx: source.spdx,
    copyright: source.copyright,
    commit: source.commit,
    ...(paths.length > 0 ? { adaptedFrom: paths.join(", ") } : {}),
    adaptedAt: options.adaptedAt ?? DEFAULT_ADAPTED_AT,
    status: source.status,
    licenseSha256: source.licenseSha256,
    licenseSnapshotPath: source.licenseSnapshotPath,
    ...(options.changes ? { changes: options.changes } : {}),
    ...(upstreamInstall && Object.keys(upstreamInstall).length > 0 ? { upstreamInstall } : {})
  }
}
