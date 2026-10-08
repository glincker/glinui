import type { ComponentDocMeta } from "../component-docs"
import { batch1aDocs } from "./batch-1a"
import { batch1bDocs } from "./batch-1b"

export const batch1Docs: Record<string, ComponentDocMeta> = { ...batch1aDocs, ...batch1bDocs }

export type Batch1Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  files: string[]
  dependencies: string[]
}

const entry = (
  id: string,
  title: string,
  description: string,
  badge: Batch1Meta["badge"],
  dependencies: string[]
): Batch1Meta => ({
  id,
  title,
  description,
  badge,
  maturity: "beta",
  files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`],
  dependencies
})

export const batch1Meta: Batch1Meta[] = [
  entry("collapsible", "Collapsible", "Interactive panel that expands and collapses a region of content.", "Primitive / Atom", ["@glinui/ui", "@radix-ui/react-collapsible"]),
  entry("breadcrumb", "Breadcrumb", "Navigation trail showing the current page location in a hierarchy.", "Primitive / Molecule", ["@glinui/ui", "@radix-ui/react-slot"]),
  entry("pagination", "Pagination", "Page navigation with previous, next and numbered links.", "Primitive / Molecule", ["@glinui/ui"]),
  entry("navigation-menu", "Navigation Menu", "Site navigation with animated dropdown content in a shared viewport.", "Primitive / Molecule", ["@glinui/ui", "@radix-ui/react-navigation-menu"]),
  entry("menubar", "Menubar", "Desktop style horizontal menu bar with keyboard navigation.", "Primitive / Molecule", ["@glinui/ui", "@radix-ui/react-menubar"]),
  entry("context-menu", "Context Menu", "Right click menu with items, checkboxes, radios and submenus.", "Primitive / Molecule", ["@glinui/ui", "@radix-ui/react-context-menu"])
]
