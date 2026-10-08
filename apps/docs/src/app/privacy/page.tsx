import type { Metadata } from "next"

import { LegalPage } from "@/components/docs-pages-b/legal-page"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { ISSUES_URL } from "@/lib/seo"

export const metadata: Metadata = createDocsMetadata({
  title: "Privacy",
  description: "What the Glin UI docs site stores and loads. No accounts, no forms, no analytics scripts, no cookies set by the site.",
  path: "/privacy"
})

const link =
  "text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      path="/privacy"
      lead="The short version: this site has no accounts and no forms, and it does not run analytics."
      sections={[
        {
          id: "what-we-collect",
          title: "What we collect",
          body: (
            <p>
              The site does not collect personal data. There are no accounts, no sign-up forms and no comment fields. We do not load
              analytics, advertising or tracking scripts, and the site does not set cookies.
            </p>
          )
        },
        {
          id: "browser-storage",
          title: "What stays in your browser",
          body: (
            <>
              <p>
                Your preferences are saved in your browser with localStorage and never sent to us. They cover the theme, the accent and
                base color options from Customize, the radius and motion options, the text direction, the package manager tab, the
                animation playback setting and which sidebar groups are open. Clear your site data to remove them.
              </p>
            </>
          )
        },
        {
          id: "third-parties",
          title: "Third parties",
          body: (
            <>
              <p>
                The site is served as static files from a static host (Cloudflare Pages). Like any web host, it can see request data such
                as your IP address and user agent in its server logs.
              </p>
              <p>
                Fonts (Inter and JetBrains Mono) are served from this site. A few demo avatars are loaded from api.dicebear.com, which
                receives your IP address when those demos render. Links to GitHub and other sites are ordinary links: nothing is sent
                until you follow one.
              </p>
            </>
          )
        },
        {
          id: "contact",
          title: "Contact",
          body: (
            <p>
              Questions or corrections: open an issue at{" "}
              <a className={link} href={ISSUES_URL}>
                github.com/GLINCKER/glinui/issues
              </a>
              .
            </p>
          )
        }
      ]}
    />
  )
}
