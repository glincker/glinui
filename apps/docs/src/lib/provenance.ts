/**
 * Pure helpers for provenance driven docs UI (install source selector, badges, attribution table).
 * No aliased imports and no JSX so the logic can be unit tested directly with node:test.
 */
import type { Provenance } from "@glinui/registry"

export type InstallSourceId = "glin" | "shadcn" | "original"

export type InstallSource = {
  id: InstallSourceId
  label: string
}

export const SHADCN_REGISTRY_BASE = "https://glinui.com/r"
export const ORIGINAL_DISCLAIMER = "We link to the original; our version is adapted and maintained here."
export const STATUS_UNAVAILABLE_MESSAGE =
  "The original is no longer available or its license changed; our MIT copy stays available."
export const DEFAULT_CHANGE_SUMMARY = "Restyled to Glin tokens, with accessibility and reduced motion review."

export function buildShadcnCommand(componentId: string): string {
  return `npx shadcn@latest add ${SHADCN_REGISTRY_BASE}/${componentId}.json`
}

/** Install sources for a component: Glin and shadcn always, Original only when adapted. */
export function buildInstallSources(provenance: Provenance | null | undefined): InstallSource[] {
  const sources: InstallSource[] = [
    { id: "glin", label: "Glin" },
    { id: "shadcn", label: "shadcn" }
  ]
  if (provenance) sources.push({ id: "original", label: "Original" })
  return sources
}

/** Resolve a selected id to one that exists for the component (falls back to Glin). */
export function resolveInstallSource(selected: InstallSourceId, sources: InstallSource[]): InstallSourceId {
  return sources.some((source) => source.id === selected) ? selected : "glin"
}

export type ProvenanceStatus = Provenance["status"]
export type StatusTone = "ok" | "warn" | "bad"

const STATUS_LABELS: Record<ProvenanceStatus, { label: string; tone: StatusTone }> = {
  active: { label: "Active", tone: "ok" },
  archived: { label: "Archived", tone: "warn" },
  relicensed: { label: "License changed", tone: "warn" },
  gone: { label: "No longer available", tone: "bad" }
}

export type OriginalModel = {
  heading: string
  creditUrl: string
  creditLabel: string
  license: string
  installLabel: string | null
  installCommand: string | null
  docsUrl: string | null
  statusLabel: string
  statusTone: StatusTone
  /** Non null when status is not active. */
  statusMessage: string | null
  disclaimer: string
}

/** View model for the Original card. */
export function getOriginalModel(provenance: Provenance): OriginalModel {
  const status = STATUS_LABELS[provenance.status]
  const install = provenance.upstreamInstall
  const installCommand = install?.shadcn ?? install?.npm ?? null
  return {
    heading: `Original by ${provenance.sourceName}`,
    creditUrl: provenance.upstreamComponentUrl ?? provenance.upstreamUrl,
    creditLabel: `View on ${provenance.sourceName}`,
    license: provenance.spdx,
    installLabel: install?.shadcn ? "Their shadcn command" : install?.npm ? "Their npm command" : null,
    installCommand,
    docsUrl: install?.docs ?? null,
    statusLabel: status.label,
    statusTone: status.tone,
    statusMessage: provenance.status === "active" ? null : STATUS_UNAVAILABLE_MESSAGE,
    disclaimer: ORIGINAL_DISCLAIMER
  }
}

export function adaptedBadgeLabel(provenance: Provenance): string {
  return `Adapted from ${provenance.sourceName}`
}

type RegistryLike = { name: string; title: string; provenance?: Provenance }

export type AttributionRow = {
  id: string
  title: string
  sourceName: string
  license: string
  copyright: string
  upstreamUrl: string
  componentUrl: string
  commit: string
  status: ProvenanceStatus
  changes: string
}

/** Credits table rows, sorted by source then component. */
export function buildAttributionRows(items: readonly RegistryLike[]): AttributionRow[] {
  return items
    .filter((item): item is RegistryLike & { provenance: Provenance } => Boolean(item.provenance))
    .map((item) => ({
      id: item.name,
      title: item.title,
      sourceName: item.provenance.sourceName,
      license: item.provenance.spdx,
      copyright: item.provenance.copyright,
      upstreamUrl: item.provenance.upstreamUrl,
      componentUrl: item.provenance.upstreamComponentUrl ?? item.provenance.upstreamUrl,
      commit: item.provenance.commit,
      status: item.provenance.status,
      changes: item.provenance.changes ?? DEFAULT_CHANGE_SUMMARY
    }))
    .sort((a, b) => a.sourceName.localeCompare(b.sourceName) || a.id.localeCompare(b.id))
}

export type SourceSummary = { sourceId: string; sourceName: string; upstreamUrl: string; license: string; copyright: string; count: number }

export function summarizeSources(items: readonly RegistryLike[]): SourceSummary[] {
  const map = new Map<string, SourceSummary>()
  for (const item of items) {
    const p = item.provenance
    if (!p) continue
    const current = map.get(p.sourceId)
    if (current) current.count += 1
    else map.set(p.sourceId, { sourceId: p.sourceId, sourceName: p.sourceName, upstreamUrl: p.upstreamUrl, license: p.spdx, copyright: p.copyright, count: 1 })
  }
  return [...map.values()].sort((a, b) => a.sourceName.localeCompare(b.sourceName))
}
