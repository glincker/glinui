import type { ComponentDocMeta } from "../component-docs"

/** ComponentDocMeta plus the credit notes shown under the page intro. */
export type BatchA3Doc = ComponentDocMeta & { notes: string[] }

export type BatchA3Provenance = {
  source: "Magic UI"
  sourceName: "Magic UI"
  upstreamUrl: string
  upstreamComponentUrl: string
  license: "MIT"
  copyright: string
  commit: string
  adaptedFrom: string[]
}

export type BatchA3Meta = {
  id: string
  title: string
  description: string
  badge: string
  maturity: "beta"
  category: "backgrounds"
  files: string[]
  dependencies: string[]
  provenance: BatchA3Provenance
}
