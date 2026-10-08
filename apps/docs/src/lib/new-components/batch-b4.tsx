import type { BatchB4Doc } from "./batch-b4a"
import { batchB4aDocs } from "./batch-b4a"
import { batchB4bDocs } from "./batch-b4b"

export type { BatchB4Doc }

export const batchB4Docs: Record<string, BatchB4Doc> = { ...batchB4aDocs, ...batchB4bDocs }

const MOTION_PRIMITIVES = "https://github.com/ibelick/motion-primitives"
const COMMIT = "120f64f6ca60348e251f929e9c81f11ccbe45eda"

export type BatchB4Provenance = {
  source: "Motion Primitives"
  sourceName: string
  upstreamUrl: string
  upstreamComponentUrl: string
  license: "MIT"
  copyright: string
  commit: string
  adaptedFrom: string[]
  changes: string
  assets: "none"
  noticeUrl: string
}

export type BatchB4Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  category: "text" | "cards" | "layout"
  files: string[]
  dependencies: string[]
  /** PORTs only. gooey-text-reveal is clean-room (our own design) and has none. */
  provenance?: BatchB4Provenance
}

const files = (id: string) => [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`]

const port = (id: string, sourceName: string, file: string): BatchB4Provenance => ({
  source: "Motion Primitives",
  sourceName,
  upstreamUrl: MOTION_PRIMITIVES,
  upstreamComponentUrl: `${MOTION_PRIMITIVES}/blob/${COMMIT}/components/core/${file}.tsx`,
  license: "MIT",
  copyright: "Copyright (c) 2024 ibelick",
  commit: COMMIT,
  adaptedFrom: [`components/core/${file}.tsx`],
  changes: "motion/react removed (CSS and Web Animations API), tokens, a11y, reduced motion, RTL",
  assets: "none",
  noticeUrl: `https://glinui.com/THIRD_PARTY_NOTICES.md#${id}`
})

export const batchB4Meta: BatchB4Meta[] = [
  {
    id: "gooey-text-reveal",
    title: "Gooey Text Reveal",
    description: "Heading whose words melt in through a shared SVG goo filter, or morph between phrases.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "text",
    files: files("gooey-text-reveal"),
    dependencies: ["@glinui/ui"]
  },
  {
    id: "spinning-text",
    title: "Spinning Text",
    description: "Text laid out on a rotating circle with an accessible name and pause on hover.",
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "text",
    files: files("spinning-text"),
    dependencies: ["@glinui/ui"],
    provenance: port("spinning-text", "Spinning Text", "spinning-text")
  },
  {
    id: "border-trail",
    title: "Border Trail",
    description: "Glowing comet that travels along the border of a rounded container.",
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "cards",
    files: files("border-trail"),
    dependencies: ["@glinui/ui"],
    provenance: port("border-trail", "Border Trail", "border-trail")
  },
  {
    id: "progressive-blur",
    title: "Progressive Blur",
    description: "Edge overlay that blurs content progressively using stacked masked backdrop filters.",
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "layout",
    files: files("progressive-blur"),
    dependencies: ["@glinui/ui"],
    provenance: port("progressive-blur", "Progressive Blur", "progressive-blur")
  }
]
