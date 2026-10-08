import type { ComponentDocMeta } from "../component-docs"

export type Batch3Docs = Record<string, ComponentDocMeta>

export type Batch3Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule" | "Primitive / Organism"
  maturity: "beta"
  /** Paths relative to the repo root. */
  files: string[]
  dependencies: string[]
}
