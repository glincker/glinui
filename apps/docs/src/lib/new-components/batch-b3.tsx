import { batchB3aDocs } from "./batch-b3a"
import { batchB3bDocs } from "./batch-b3b"
import type { BatchB3Doc, BatchB3Meta } from "./batch-b3-types"

export type { BatchB3Doc, BatchB3Meta } from "./batch-b3-types"

export const batchB3Docs: Record<string, BatchB3Doc> = { ...batchB3aDocs, ...batchB3bDocs }

const VENGEANCE = {
  source: "Vengeance UI",
  upstreamUrl: "https://github.com/Ashutoshx7/VengeanceUI",
  license: "MIT",
  copyright: "Copyright (c) 2025-2026 Ashutoshx7",
  commit: "0376d8e37b4a565016cce1064d7b96905c4494ab"
} as const

const MOTION_PRIMITIVES = {
  source: "Motion Primitives",
  upstreamUrl: "https://github.com/ibelick/motion-primitives",
  license: "MIT",
  copyright: "Copyright (c) 2024 ibelick",
  commit: "120f64f6ca60348e251f929e9c81f11ccbe45eda"
} as const

const files = (id: string) => [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`]
const BASE_DEPS = ["@phosphor-icons/react", "class-variance-authority"]

export const batchB3Meta: BatchB3Meta[] = [
  {
    id: "cylinder-carousel",
    title: "Cylinder Carousel",
    description: "Slides on a rotating 3D ring with buttons, arrow keys, swipe and a pausable autoplay.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "layout",
    files: files("cylinder-carousel"),
    dependencies: BASE_DEPS,
    provenance: {
      ...VENGEANCE,
      sourceName: "Cylinder Carousel",
      upstreamComponentUrl: `${VENGEANCE.upstreamUrl}/blob/${VENGEANCE.commit}/src/components/ui/cylinder-carousel.tsx`,
      adaptedFrom: ["src/components/ui/cylinder-carousel.tsx"]
    }
  },
  {
    id: "image-comparison",
    title: "Image Comparison",
    description: "Before and after layers split by a draggable, keyboard operable slider handle.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "data",
    files: files("image-comparison"),
    dependencies: BASE_DEPS,
    provenance: {
      ...MOTION_PRIMITIVES,
      sourceName: "Image Comparison",
      upstreamComponentUrl: `${MOTION_PRIMITIVES.upstreamUrl}/blob/${MOTION_PRIMITIVES.commit}/components/core/image-comparison.tsx`,
      adaptedFrom: ["components/core/image-comparison.tsx"]
    }
  },
  {
    id: "circular-gallery",
    title: "Circular Gallery",
    description: "Tiles on a ring that rotates to the front with drag inertia, keys, click and optional autorotate.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "layout",
    files: files("circular-gallery"),
    dependencies: BASE_DEPS
  },
  {
    id: "highlight-grid",
    title: "Highlight Grid",
    description: "Hairline cell grid with one shared highlight that glides to the hovered, tapped or focused cell.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "cards",
    files: files("highlight-grid"),
    dependencies: BASE_DEPS
  }
]
