import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ChatCenteredText, Cursor, Footprints, Question, Rows, Sparkle, Tag } from "@phosphor-icons/react/dist/ssr"
import type { Icon } from "@phosphor-icons/react"

import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { CollectionJsonLd } from "@/components/site-pages/collection-json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { buildGalleryItems } from "../components/gallery-items"

export const metadata: Metadata = createDocsMetadata({
  title: "Blocks",
  description:
    "Page-level React sections composed from Glin UI primitives: hero, features, pricing, social proof, FAQ, call to action and footer.",
  path: "/docs/blocks",
  keywords: ["React blocks", "landing page sections", "hero section", "pricing section", "FAQ section"]
})

type Section = { id: string; title: string; icon: Icon; ids: readonly string[] }

const sections: readonly Section[] = [
  { id: "hero", title: "Hero", icon: Sparkle, ids: ["hero-section"] },
  { id: "features", title: "Features", icon: Rows, ids: ["feature-grid"] },
  { id: "pricing", title: "Pricing", icon: Tag, ids: ["pricing-section"] },
  { id: "social-proof", title: "Social proof", icon: ChatCenteredText, ids: ["logo-cloud", "testimonials-wall"] },
  { id: "faq", title: "FAQ", icon: Question, ids: ["faq-section"] },
  { id: "cta", title: "Call to action", icon: Cursor, ids: ["cta-band"] },
  { id: "footer", title: "Footer", icon: Footprints, ids: ["footer-block"] }
]

const blocks = buildGalleryItems().filter((item) => item.category === "blocks")

export default function BlocksHubPage() {
  const grouped = sections
    .map((section) => ({ ...section, items: blocks.filter((item) => section.ids.includes(item.id)) }))
    .filter((section) => section.items.length > 0)
  const placed = new Set(grouped.flatMap((section) => section.items.map((item) => item.id)))
  const rest = blocks.filter((item) => !placed.has(item.id))

  return (
    <main className="space-y-12">
      <CollectionJsonLd
        name="Blocks"
        description="Page-level sections composed from Glin UI primitives."
        path="/docs/blocks"
        items={blocks.map((item) => ({ name: item.title, path: item.href }))}
      />
      <PageHeader
        eyebrow="Blocks"
        title="Page sections, ready to compose"
        lead={`${blocks.length} page-level blocks built from Glin primitives and tokens. Each follows the ambient design style, so one provider switches the whole page.`}
      />
      {[...grouped, ...(rest.length ? [{ id: "more", title: "More blocks", icon: Rows, ids: [], items: rest }] : [])].map((section) => {
        const SectionIcon = section.icon
        return (
          <PageSection key={section.id} id={section.id} title={section.title}>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="group flex h-full min-h-11 flex-col gap-3 rounded-card border border-line-soft bg-surface-1 p-5 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
                  >
                    <span className="inline-flex size-10 items-center justify-center rounded-input border border-line-soft bg-surface-2">
                      <SectionIcon aria-hidden className="size-5" />
                    </span>
                    <span className="type-h3">{item.title}</span>
                    <span className="type-body text-muted">{item.description}</span>
                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium">
                      View docs
                      <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </PageSection>
        )
      })}
    </main>
  )
}
