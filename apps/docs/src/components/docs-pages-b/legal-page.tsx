import type { ReactNode } from "react"

import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { LEGAL_LAST_UPDATED, SITE_NAME, createAbsoluteUrl } from "@/lib/seo"

export type LegalSection = { id: string; title: string; body: ReactNode }

/** Shared layout for /privacy and /terms: header, dated lead, sections, WebPage JSON-LD. */
export function LegalPage({ title, path, lead, sections }: { title: string; path: string; lead: string; sections: LegalSection[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${title} | ${SITE_NAME}`,
    url: createAbsoluteUrl(path),
    dateModified: LEGAL_LAST_UPDATED,
    isPartOf: { "@id": createAbsoluteUrl("/#website") }
  }
  return (
    <main className="space-y-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Legal"
        title={title}
        lead={
          <>
            {lead} <span className="block pt-2 type-caption text-muted">Last updated: <time dateTime={LEGAL_LAST_UPDATED}>{LEGAL_LAST_UPDATED}</time></span>
          </>
        }
      />
      {sections.map((section) => (
        <PageSection key={section.id} id={section.id} title={section.title}>
          <div className="max-w-[68ch] space-y-3 type-body">{section.body}</div>
        </PageSection>
      ))}
      <Callout variant="note" title="Not legal advice">
        This page describes how the site behaves in plain language. It is not legal advice.
      </Callout>
    </main>
  )
}
