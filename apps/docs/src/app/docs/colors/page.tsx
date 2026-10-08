import type { Metadata } from "next"

import { ColorExplorer } from "@/components/hub/color-explorer"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Color System Explorer: OKLCH Tokens",
  description:
    "Explore the Glin UI color system: brand accent, neutral surface scale, signal and semantic colors in OKLCH, with contrast checks, a tonal ramp, and copy as CSS, Tailwind, or AI prompt.",
  path: "/docs/colors",
  keywords: ["OKLCH color palette", "design tokens colors", "tailwind color tokens", "WCAG contrast checker"]
})

export default function ColorsPage() {
  return (
    <main className="space-y-10">
      <section className="space-y-3">
        <p className="type-eyebrow text-[var(--color-accent)]">OKLCH, light and dark</p>
        <h1 className="type-h1">Colors</h1>
        <p className="type-lead">
          One violet accent, a quiet neutral surface scale, and signal colors. Click any swatch detail to copy it.
        </p>
      </section>
      <ColorExplorer />
    </main>
  )
}
