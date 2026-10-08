import type { Metadata } from "next"
import Link from "next/link"

import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { FAQ, PINNING_POINTS, PLEDGE_SENTENCES, TAKEDOWN_CONTACT_URL } from "@/lib/pledge"

export const metadata: Metadata = createDocsMetadata({
  title: "Free Forever Pledge",
  description:
    "Glin UI is MIT licensed. Read what we commit to, how we credit adapted components, how we verify upstream licenses and how to request removal.",
  path: "/docs/free-forever",
  keywords: ["free forever", "MIT license", "open source pledge", "takedown policy", "license policy"]
})

const linkClass =
  "text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export default function FreeForeverPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="About"
        title="Free forever pledge"
        lead="What we commit to about the license of Glin UI, written plainly and without promises we cannot keep."
        actions={
          <Link
            href="/docs/attribution"
            className="inline-flex h-10 items-center rounded-input border border-line-soft px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            See the credits
          </Link>
        }
      />

      <PageSection id="pledge" title="The pledge">
        <ol className="max-w-[68ch] list-decimal space-y-3 pl-5 type-body">
          {PLEDGE_SENTENCES.map((sentence) => (
            <li key={sentence}>{sentence}</li>
          ))}
        </ol>
        <Callout variant="note" title="Plain language, not a contract">
          This page states our intent and how the MIT License works. The license text in the repository is the
          binding document.
        </Callout>
      </PageSection>

      <PageSection
        id="verification"
        title="How we pin and verify upstream licenses"
        description="Adapted components are only as safe as the license they came from, so we keep evidence."
      >
        <ul className="max-w-[68ch] list-disc space-y-2 pl-5 type-body text-muted">
          {PINNING_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </PageSection>

      <PageSection id="assets" title="Asset policy">
        <p className="type-body max-w-[68ch] text-muted">
          A repository license often covers code only. We therefore copy no upstream images, videos, fonts, models or
          logos, and we credit with plain text. Restricted or paid sources are never ported: we study public behavior
          only and write our own code.
        </p>
      </PageSection>

      <PageSection id="faq" title="FAQ">
        <div className="space-y-6">
          {FAQ.map((entry) => (
            <section key={entry.id} id={entry.id} aria-labelledby={`${entry.id}-q`} className="space-y-2">
              <h3 id={`${entry.id}-q`} className="type-h3">
                {entry.question}
              </h3>
              {entry.answer.map((paragraph) => (
                <p key={paragraph} className="type-body max-w-[68ch] text-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
        <p className="type-body max-w-[68ch]">
          Contact:{" "}
          <a href={TAKEDOWN_CONTACT_URL} target="_blank" rel="noreferrer" className={linkClass}>
            {TAKEDOWN_CONTACT_URL}
          </a>
        </p>
      </PageSection>

      <RelatedLinks
        links={[
          { href: "/docs/attribution", label: "Attribution and credits", description: "Every adapted component and its source." },
          { href: "/docs/getting-started", label: "Getting started" }
        ]}
      />
    </main>
  )
}
