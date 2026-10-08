import type { BatchA2Doc } from "./batch-a2a"
import { batchA2aDocs } from "./batch-a2a"
import { batchA2bDocs } from "./batch-a2b"

export const batchA2Docs: Record<string, BatchA2Doc> = { ...batchA2aDocs, ...batchA2bDocs }

const MAGIC_UI = "https://github.com/magicuidesign/magicui"
const COMMIT = "cdb348cb4c72a9b54b554d8617801e479fbc8714"

export type BatchA2Provenance = {
  source: "Magic UI"
  sourceName: string
  upstreamUrl: string
  upstreamComponentUrl: string
  license: "MIT"
  copyright: string
  commit: string
  adaptedFrom: string[]
}

export type BatchA2Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule" | "Primitive / Organism"
  maturity: "beta"
  category: "cards"
  files: string[]
  dependencies: string[]
  provenance: BatchA2Provenance
}

const entry = (
  id: string,
  title: string,
  sourceName: string,
  description: string,
  badge: BatchA2Meta["badge"],
  dependencies: string[]
): BatchA2Meta => ({
  id,
  title,
  description,
  badge,
  maturity: "beta",
  category: "cards",
  files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`],
  dependencies,
  provenance: {
    source: "Magic UI",
    sourceName,
    upstreamUrl: MAGIC_UI,
    upstreamComponentUrl: `${MAGIC_UI}/blob/${COMMIT}/apps/www/registry/magicui/${id}.tsx`,
    license: "MIT",
    copyright: "Copyright (c) Magic UI",
    commit: COMMIT,
    adaptedFrom: [`apps/www/registry/magicui/${id}.tsx`]
  }
})

export const batchA2Meta: BatchA2Meta[] = [
  entry("shine-border", "Shine Border", "Shine Border", "Animated gradient edge that wraps any rounded container.", "Primitive / Atom", ["@glinui/ui"]),
  entry("magic-card", "Magic Card", "Magic Card", "Card whose border and surface light up under the pointer or keyboard focus.", "Primitive / Molecule", ["@glinui/ui"]),
  entry("neon-gradient-card", "Neon Gradient Card", "Neon Gradient Card", "Card with an animated neon gradient ring and soft glow.", "Primitive / Molecule", ["@glinui/ui"]),
  entry("bento-grid", "Bento Grid", "Bento Grid", "Responsive bento layout of linked feature tiles.", "Primitive / Organism", ["@glinui/ui", "@phosphor-icons/react"])
]
