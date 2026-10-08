import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr"

import { PageHeader } from "@/components/docs-pages-b/page-header"
import { CollectionJsonLd } from "@/components/site-pages/collection-json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { itemsByStatus, roadmapItems, roadmapStatuses } from "@/lib/roadmap"

export const metadata: Metadata = createDocsMetadata({
  title: "Roadmap",
  description: "What Glin UI is working on now, what comes next and what is wanted later. Statuses only, no dates promised.",
  path: "/roadmap",
  keywords: ["Glin UI roadmap", "open source roadmap"]
})

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <CollectionJsonLd
        name="Roadmap"
        description="Glin UI roadmap by status."
        path="/roadmap"
        items={roadmapItems.map((item) => ({ name: item.title, path: item.href?.startsWith("/") ? item.href : "/roadmap" }))}
      />
      <PageHeader
        eyebrow="Roadmap"
        title="What we are building"
        lead="Grouped by status, not by date. Plans change, and anything here may shift or be dropped."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {roadmapStatuses.map((status) => (
          <section key={status.id} id={status.id} aria-labelledby={`${status.id}-title`} className="space-y-4">
            <div className="space-y-1">
              <h2 id={`${status.id}-title`} className="type-h2">{status.label}</h2>
              <p className="type-caption text-muted">{status.description}</p>
            </div>
            <ul className="space-y-3">
              {itemsByStatus(status.id).map((item) => (
                <li key={item.id} className="space-y-2 rounded-card border border-line-soft bg-surface-1 p-4">
                  <h3 className="type-h3">{item.title}</h3>
                  <p className="type-body text-muted">{item.summary}</p>
                  {item.href ? (
                    <Link
                      href={item.href}
                      {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}
                      className="inline-flex min-h-11 items-center gap-1 rounded-sm text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                    >
                      Details
                      <ArrowUpRight aria-hidden className="size-3.5" />
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
