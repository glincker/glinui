import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@glinui/ui"
import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { buildComponentHref } from "@/lib/docs-route"
import { DEFAULT_DOCS_IMPLEMENTATION } from "@/lib/docs-config"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { getCategories } from "@/lib/taxonomy"
import { buildGalleryItems } from "./gallery-items"

export const metadata: Metadata = createDocsMetadata({
  title: "Components",
  description:
    "Browse Glin UI primitive and signature component docs with implementation-aware routes and generated API references.",
  path: "/docs/components",
  keywords: ["React components", "UI component catalog", "glassmorphism components", "Radix UI wrappers"]
})


const items = buildGalleryItems()

export default function ComponentsIndexPage() {
  return (
    <main className="space-y-10">
      <header className="space-y-4">
        <h1 className="type-h1">Components</h1>
        <p className="type-lead">
          {items.length} components in {getCategories().length} categories, base primitives first with their animated variants beside them. Hover a tile to preview, click to read the docs.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="default" size="sm">
            <Link href={buildComponentHref("button", DEFAULT_DOCS_IMPLEMENTATION)}>
              Start with Button
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="sm">
            <Link href="/docs/api-metadata">View API Metadata</Link>
          </Button>
        </div>
      </header>
      <GalleryGrid items={items} />
    </main>
  )
}
