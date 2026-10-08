import type { ComponentDocMeta } from "../component-docs"

/** Docs entry plus usage notes (credits and improvements over the upstream original). */
export type BatchA4Doc = ComponentDocMeta & { notes: string[] }

export type BatchA4Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  category: "buttons" | "layout" | "text"
  /** Paths relative to the repo root. */
  files: string[]
  dependencies: string[]
  provenance: {
    source: "Magic UI" | "Vengeance UI"
    sourceName: string
    upstreamUrl: string
    upstreamComponentUrl: string
    license: "MIT"
    copyright: string
    commit: string
    adaptedFrom: string[]
  }
}
