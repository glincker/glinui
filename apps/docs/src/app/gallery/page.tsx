import type { Metadata } from "next"

import { GalleryGrid } from "@/components/gallery/gallery-grid"
import { CollectionJsonLd } from "@/components/site-pages/collection-json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { buildGalleryItems } from "../docs/components/gallery-items"

export const metadata: Metadata = createDocsMetadata({
  title: "Gallery",
  description: "A filterable showcase of Glin UI signature components. Filter by family, tag or search, then open the docs for any one.",
  path: "/gallery",
  keywords: ["component gallery", "React UI showcase", "animated components"]
})

const items = buildGalleryItems().filter((item) => item.kind === "signature")

export default function GalleryPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <CollectionJsonLd
        name="Gallery"
        description="Signature Glin UI components."
        path="/gallery"
        items={items.map((item) => ({ name: item.title, path: item.href }))}
      />
      <header className="space-y-4">
        <p className="type-eyebrow">Gallery</p>
        <h1 className="type-h1">Signature components</h1>
        <p className="type-lead max-w-[68ch]">
          {items.length} signature components beyond the base primitives. Hover a tile to preview, filter by category or tag, click through for docs and code.
        </p>
      </header>
      <GalleryGrid items={items} />
    </main>
  )
}
