import { batch3aDocs } from "./batch-3a"
import { batch3bDocs } from "./batch-3b"
import type { Batch3Docs, Batch3Meta } from "./batch-3-types"

export type { Batch3Docs, Batch3Meta }

export const batch3Docs: Batch3Docs = { ...batch3aDocs, ...batch3bDocs }

const ui = (id: string) => `packages/ui/src/components/${id}.tsx`

export const batch3Meta: Batch3Meta[] = [
  {
    id: "scroll-area",
    title: "Scroll Area",
    description: "Custom-styled scroll container with vertical and horizontal scrollbars that keeps native scrolling.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    files: [ui("scroll-area")],
    dependencies: ["@radix-ui/react-scroll-area"]
  },
  {
    id: "aspect-ratio",
    title: "Aspect Ratio",
    description: "Constrains content to a width to height ratio with optional surface frame.",
    badge: "Primitive / Atom",
    maturity: "beta",
    files: [ui("aspect-ratio")],
    dependencies: ["@radix-ui/react-aspect-ratio"]
  },
  {
    id: "spinner",
    title: "Spinner",
    description: "Accessible loading indicator with a reduced-motion pulsing ring fallback.",
    badge: "Primitive / Atom",
    maturity: "beta",
    files: [ui("spinner")],
    dependencies: []
  },
  {
    id: "empty",
    title: "Empty",
    description: "Empty state with media, title, description, and action slots.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    files: [ui("empty")],
    dependencies: []
  },
  {
    id: "item",
    title: "Item",
    description: "Flexible list row with media, content, actions, header, and footer slots.",
    badge: "Primitive / Molecule",
    maturity: "beta",
    files: [ui("item")],
    dependencies: ["@radix-ui/react-slot"]
  },
  {
    id: "sidebar",
    title: "Sidebar",
    description: "Collapsible app sidebar with icon rail, mobile sheet, Ctrl/Cmd+B shortcut, and persisted state.",
    badge: "Primitive / Organism",
    maturity: "beta",
    files: [ui("sidebar"), ui("sidebar-context"), ui("sheet"), ui("tooltip")],
    dependencies: ["@radix-ui/react-slot", "@radix-ui/react-dialog", "@radix-ui/react-tooltip", "@phosphor-icons/react"]
  }
]
