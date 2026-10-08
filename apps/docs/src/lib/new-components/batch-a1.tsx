import { batchA1aDocs } from "./batch-a1a"
import { batchA1bDocs } from "./batch-a1b"
import type { BatchA1Doc } from "./batch-a1a"

export const batchA1Docs: Record<string, BatchA1Doc> = { ...batchA1aDocs, ...batchA1bDocs }

const MAGIC_REPO = "https://github.com/magicuidesign/magicui"
const MAGIC_COMMIT = "cdb348cb4c72a9b54b554d8617801e479fbc8714"

export type BatchA1Provenance = {
  source: string
  sourceName: string
  upstreamUrl: string
  upstreamComponentUrl: string
  license: "MIT"
  copyright: string
  commit: string
  adaptedFrom: string | string[]
}

export type BatchA1MetaEntry = {
  id: string
  title: string
  description: string
  badge: string
  maturity: "beta"
  category: "text"
  files: string[]
  dependencies: string[]
  provenance: BatchA1Provenance
}

const entry = (
  id: string,
  title: string,
  description: string,
  sourceName: string,
  upstreamFiles: string[]
): BatchA1MetaEntry => {
  const paths = upstreamFiles.map((f) => `apps/www/registry/magicui/${f}.tsx`)
  return {
    id,
    title,
    description,
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "text",
    files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`],
    dependencies: ["@glinui/motion"],
    provenance: {
      source: "Magic UI",
      sourceName,
      upstreamUrl: MAGIC_REPO,
      upstreamComponentUrl: `${MAGIC_REPO}/blob/${MAGIC_COMMIT}/${paths[0]}`,
      license: "MIT",
      copyright: "Copyright (c) Magic UI",
      commit: MAGIC_COMMIT,
      adaptedFrom: paths.length === 1 ? paths[0] : paths
    }
  }
}

export const batchA1Meta: BatchA1MetaEntry[] = [
  entry("hyper-text", "Hyper Text", "Text that scrambles through random characters and settles on the real string, on hover, in view or on mount.", "Hyper Text", ["hyper-text"]),
  entry("morphing-text", "Morphing Text", "Cycles through words with a gooey blur and threshold morph, paused off screen and static under reduced motion.", "Morphing Text", ["morphing-text"]),
  entry("sparkles-text", "Sparkles Text", "Text with twinkling star sparkles that scale and rotate, with a static accent under reduced motion.", "Sparkles Text", ["sparkles-text"]),
  entry("gradient-text", "Gradient Text", "Flowing gradient or shine sweep text, optionally inside a solid or glass pill badge.", "Animated Gradient Text, Animated Shiny Text", ["animated-gradient-text", "animated-shiny-text"])
]
