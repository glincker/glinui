import { batchA3aDocs } from "./batch-a3a"
import { batchA3bDocs } from "./batch-a3b"
import type { BatchA3Doc, BatchA3Meta, BatchA3Provenance } from "./batch-a3-types"

export type { BatchA3Doc, BatchA3Meta, BatchA3Provenance }

export const batchA3Docs: Record<string, BatchA3Doc> = { ...batchA3aDocs, ...batchA3bDocs }

const UPSTREAM = "https://github.com/magicuidesign/magicui"
const COMMIT = "cdb348cb4c72a9b54b554d8617801e479fbc8714"
const PATH = "apps/www/registry/magicui"

const entry = (
  id: string,
  title: string,
  description: string,
  badge: string,
  upstreamFiles: string[]
): BatchA3Meta => ({
  id,
  title,
  description,
  badge,
  maturity: "beta",
  category: "backgrounds",
  files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`],
  dependencies: ["@glinui/ui"],
  provenance: {
    source: "Magic UI",
    sourceName: "Magic UI",
    upstreamUrl: UPSTREAM,
    upstreamComponentUrl: `${UPSTREAM}/blob/${COMMIT}/${PATH}/${upstreamFiles[0]}.tsx`,
    license: "MIT",
    copyright: "Copyright (c) Magic UI",
    commit: COMMIT,
    adaptedFrom: upstreamFiles.map((f) => `${PATH}/${f}.tsx`)
  }
})

export const batchA3Meta: BatchA3Meta[] = [
  entry("light-rays", "Light Rays", "Soft swaying rays of light for hero and section backgrounds.", "Background / Decorative", ["light-rays"]),
  entry("grid-pattern", "Grid Pattern", "SVG grid, stripes and interactive cell patterns with edge fades.", "Background / Pattern", ["grid-pattern", "interactive-grid-pattern", "striped-pattern"]),
  entry("animated-beam", "Animated Beam", "A gradient beam that travels between two elements.", "Decorative / Connector", ["animated-beam"]),
  entry("flickering-grid", "Flickering Grid", "Canvas grid of squares that flicker, with token colors and a static fallback.", "Background / Canvas", ["flickering-grid"])
]
