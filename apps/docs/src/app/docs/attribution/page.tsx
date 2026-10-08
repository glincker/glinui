import type { Metadata } from "next"
import Link from "next/link"
import { baseRegistry } from "@glinui/registry"

import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { buildAttributionRows, summarizeSources } from "@/lib/provenance"

export const metadata: Metadata = createDocsMetadata({
  title: "Attribution and Credits",
  description:
    "Every Glin UI component adapted from another open source project, with the original author, license, copyright, a link to the original and what we changed.",
  path: "/docs/attribution",
  keywords: ["attribution", "credits", "third party notices", "MIT license", "open source licenses"]
})

const linkClass =
  "text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export default function AttributionPage() {
  const rows = buildAttributionRows(baseRegistry)
  const sources = summarizeSources(baseRegistry)

  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="About"
        title="Attribution and credits"
        lead="Glin UI is MIT licensed. Some components are adapted from other open source projects. We credit the authors, keep their notices and link to the originals."
        actions={
          <Link
            href="/docs/free-forever"
            className="inline-flex h-10 items-center rounded-input border border-line-soft px-4 text-sm font-medium hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Read the free forever pledge
          </Link>
        }
      />

      <PageSection
        id="sources"
        title="Sources"
        description="Projects we adapt components from. Each source is pinned to an exact commit and its license text is stored in the repository."
      >
        {sources.length === 0 ? (
          <Callout variant="note" title="No adapted components yet">
            Components adapted from other projects will be listed here as they are added. Everything currently in the
            library is original Glin UI code.
          </Callout>
        ) : (
          <ul className="divide-y divide-line-soft rounded-card border border-line-soft bg-surface-1">
            {sources.map((source) => (
              <li key={source.sourceId} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <a href={source.upstreamUrl} target="_blank" rel="noreferrer" className={`text-sm font-medium ${linkClass}`}>
                    {source.sourceName}
                  </a>
                  <p className="text-sm text-muted">{source.copyright}</p>
                </div>
                <p className="font-mono text-xs text-muted">
                  {source.license} / {source.count} {source.count === 1 ? "component" : "components"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </PageSection>

      <PageSection
        id="components"
        title="Adapted components"
        description="Our version is restyled and maintained here. The original link goes to the author's page."
      >
        {rows.length === 0 ? (
          <p className="type-body text-muted">Nothing to list yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <caption className="sr-only">Components adapted from other open source projects</caption>
              <thead>
                <tr className="border-b border-line-soft">
                  {["Component", "Source", "License", "Copyright", "Original", "What we changed"].map((heading) => (
                    <th key={heading} scope="col" className="type-eyebrow px-4 py-3 font-medium">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map((row) => (
                  <tr key={row.id} id={row.id}>
                    <th scope="row" className="px-4 py-3 font-normal">
                      <Link href={`/docs/components/radix/${row.id}`} className={linkClass}>
                        {row.title}
                      </Link>
                    </th>
                    <td className="px-4 py-3">{row.sourceName}</td>
                    <td className="px-4 py-3 font-mono">{row.license}</td>
                    <td className="px-4 py-3">{row.copyright}</td>
                    <td className="px-4 py-3">
                      <a href={row.componentUrl} target="_blank" rel="noreferrer" className={linkClass}>
                        View original
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted">{row.changes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageSection>

      <PageSection id="notices" title="Notices in your project">
        <p className="type-body max-w-[68ch] text-muted">
          Adapted source files start with an attribution comment. When you add one with the CLI, it also writes the
          upstream copyright and license text to <code>THIRD_PARTY_NOTICES.md</code> in your project root. Keep that file
          when you ship. The full notice for this repository is{" "}
          <a
            href="https://github.com/GLINCKER/glinui/blob/main/THIRD_PARTY_NOTICES.md"
            target="_blank"
            rel="noreferrer"
            className={linkClass}
          >
            THIRD_PARTY_NOTICES.md
          </a>
          .
        </p>
      </PageSection>

      <RelatedLinks
        links={[
          { href: "/docs/free-forever", label: "Free forever pledge", description: "What we promise and what we do not." },
          { href: "/docs/components", label: "Components" },
          { href: "/docs/getting-started", label: "Getting started" }
        ]}
      />
    </main>
  )
}
