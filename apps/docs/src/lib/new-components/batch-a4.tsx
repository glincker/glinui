import { batchA4aDocs } from "./batch-a4a"
import { batchA4bDocs } from "./batch-a4b"
import type { BatchA4Doc, BatchA4Meta } from "./batch-a4-types"

export type { BatchA4Doc, BatchA4Meta } from "./batch-a4-types"

export const batchA4Docs: Record<string, BatchA4Doc> = { ...batchA4aDocs, ...batchA4bDocs }

const MAGIC = {
  source: "Magic UI",
  upstreamUrl: "https://github.com/magicuidesign/magicui",
  license: "MIT",
  copyright: "Copyright (c) Magic UI",
  commit: "cdb348cb4c72a9b54b554d8617801e479fbc8714"
} as const

const VENGEANCE = {
  source: "Vengeance UI",
  upstreamUrl: "https://github.com/Ashutoshx7/VengeanceUI",
  license: "MIT",
  copyright: "Copyright (c) 2025-2026 Ashutoshx7",
  commit: "0376d8e37b4a565016cce1064d7b96905c4494ab"
} as const

const files = (id: string) => [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`]

export const batchA4Meta: BatchA4Meta[] = [
  {
    id: "interactive-hover-button",
    title: "Interactive Hover Button",
    description: "Pill button whose accent dot floods the surface on hover, focus or press.",
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "buttons",
    files: files("interactive-hover-button"),
    dependencies: ["@phosphor-icons/react", "@radix-ui/react-slot", "class-variance-authority"],
    provenance: {
      ...MAGIC,
      sourceName: "Interactive Hover Button",
      upstreamComponentUrl: `${MAGIC.upstreamUrl}/blob/${MAGIC.commit}/apps/www/registry/magicui/interactive-hover-button.tsx`,
      adaptedFrom: ["apps/www/registry/magicui/interactive-hover-button.tsx"]
    }
  },
  {
    id: "generate-button",
    title: "Generate Button",
    description: "AI style call to action with idle, generating and loading states.",
    badge: "Primitive / Atom",
    maturity: "beta",
    category: "buttons",
    files: files("generate-button"),
    dependencies: ["@phosphor-icons/react", "@radix-ui/react-slot", "class-variance-authority"],
    provenance: {
      ...VENGEANCE,
      sourceName: "Generate Button",
      upstreamComponentUrl: `${VENGEANCE.upstreamUrl}/blob/${VENGEANCE.commit}/src/components/ui/generate-button.tsx`,
      adaptedFrom: ["src/components/ui/generate-button.tsx"]
    }
  },
  {
    id: "browser-frame",
    title: "Browser Frame",
    description: "Generic browser window chrome drawn in CSS with a slot for any content.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "layout",
    files: files("browser-frame"),
    dependencies: ["@phosphor-icons/react", "class-variance-authority"],
    provenance: {
      ...MAGIC,
      sourceName: "Safari",
      upstreamComponentUrl: `${MAGIC.upstreamUrl}/blob/${MAGIC.commit}/apps/www/registry/magicui/safari.tsx`,
      adaptedFrom: ["apps/www/registry/magicui/safari.tsx"]
    }
  },
  {
    id: "terminal",
    title: "Terminal",
    description: "Terminal window with sequenced typing and output, a full transcript and copy.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    category: "text",
    files: files("terminal"),
    dependencies: ["class-variance-authority", "@phosphor-icons/react"],
    provenance: {
      ...MAGIC,
      sourceName: "Terminal",
      upstreamComponentUrl: `${MAGIC.upstreamUrl}/blob/${MAGIC.commit}/apps/www/registry/magicui/terminal.tsx`,
      adaptedFrom: ["apps/www/registry/magicui/terminal.tsx"]
    }
  }
]
