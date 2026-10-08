import type { Metadata } from "next"

import { DocSection, PageHeader } from "@/components/docs-pages/page-header"
import { LinkPill } from "@/components/docs-pages/link-pill"
import { OverviewCards } from "@/components/docs-pages/overview-cards"
import { PopularComponents } from "@/components/docs-pages/popular-components"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Documentation Overview",
  description:
    "Navigate setup, components, animations, colors, tokens, and accessibility guides from the Glin UI docs home.",
  path: "/docs",
  keywords: ["Glin UI docs", "React component documentation", "design tokens", "Tailwind UI components"]
})

export default function DocsOverviewPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Docs Home"
        title="Documentation Overview"
        lead="Glin UI is a modern-web design hub: React components, animations, OKLCH colors, design tokens, and AI prompts you can copy into your editor."
      >
        <LinkPill href="/docs/getting-started" primary>
          Get started
        </LinkPill>
        <LinkPill href="/docs/components">Browse components</LinkPill>
      </PageHeader>

      <DocSection id="start" title="Start here" description="Pick the area you need. Every page is copy-paste first.">
        <OverviewCards />
      </DocSection>

      <DocSection
        id="popular"
        title="Popular components"
        description="Rendered with the real package. Open one for variants, props, and source."
      >
        <PopularComponents />
      </DocSection>

      <DocSection
        id="ai"
        title="Built for AI workflows"
        description="Component and animation pages include a Copy prompt button and a Copy as Markdown action, so an editor agent gets the install command, props, and a usage example in one paste."
      >
        <div className="flex flex-wrap gap-3">
          <LinkPill href="/docs/animations">Animations with prompts</LinkPill>
          <LinkPill href="/docs/api-metadata">Generated API metadata</LinkPill>
          <LinkPill href="/docs/directory">Component directory</LinkPill>
        </div>
      </DocSection>
    </main>
  )
}
