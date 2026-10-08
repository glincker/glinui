import type { Metadata } from "next"
import Link from "next/link"

import { LegalPage } from "@/components/docs-pages-b/legal-page"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { ISSUES_URL } from "@/lib/seo"

export const metadata: Metadata = createDocsMetadata({
  title: "Terms",
  description: "Terms for using the Glin UI docs site and code: MIT licensed code, documentation provided as is.",
  path: "/terms"
})

const link =
  "text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      path="/terms"
      lead="Plain terms for using this site and the code it documents."
      sections={[
        {
          id: "code-license",
          title: "The code",
          body: (
            <p>
              The code in the Glin UI repository is MIT licensed. The license text in the repository is the binding document. See the{" "}
              <Link className={link} href="/docs/free-forever">
                free forever pledge
              </Link>{" "}
              and the{" "}
              <Link className={link} href="/docs/attribution">
                attribution page
              </Link>{" "}
              for how adapted components are credited.
            </p>
          )
        },
        {
          id: "docs-as-is",
          title: "The documentation",
          body: (
            <p>
              The documentation, examples and copy-for-AI prompts are provided as is, without warranty of any kind. Check that a
              component fits your use before you ship it, including accessibility and browser support.
            </p>
          )
        },
        {
          id: "use",
          title: "Using the site",
          body: (
            <p>
              You can read, link to and quote the site. Please do not overload it with automated requests. We may change or remove
              pages at any time.
            </p>
          )
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Open an issue at{" "}
              <a className={link} href={ISSUES_URL}>
                github.com/GLINCKER/glinui/issues
              </a>
              . Removal requests for adapted work are handled as described on the pledge page.
            </p>
          )
        }
      ]}
    />
  )
}
