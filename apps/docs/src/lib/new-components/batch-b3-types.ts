import type { ComponentDocMeta } from "../component-docs"

/** Docs entry plus usage notes (credits and improvements over the upstream original). */
export type BatchB3Doc = ComponentDocMeta & { notes: string[] }

export type BatchB3Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  category: "layout" | "cards" | "data"
  /** Paths relative to the repo root. */
  files: string[]
  dependencies: string[]
  /** Present for PORT items only. Clean-room items have no provenance entry. */
  provenance?: {
    source: "Vengeance UI" | "Motion Primitives"
    sourceName: string
    upstreamUrl: string
    upstreamComponentUrl: string
    license: "MIT"
    copyright: string
    commit: string
    adaptedFrom: string[]
  }
}
