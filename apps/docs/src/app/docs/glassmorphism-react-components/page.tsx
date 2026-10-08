import type { Metadata } from "next"
import Link from "next/link"

import { GlassCard } from "@glinui/ui"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { Checklist, ChecklistItem } from "@/components/docs-pages-b/checklist-item"
import { DoDont } from "@/components/docs-pages-b/do-dont"
import { FaqBreadcrumbJsonLd, FaqList, type FaqEntry } from "@/components/docs-pages-b/json-ld"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { RelatedLinks } from "@/components/docs-pages-b/related-links"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Glassmorphism React Components",
  description:
    "Glassmorphism React components that stay readable: glass as one surface variant in Glin UI, with OKLCH tokens, contrast checks, dark mode, and reduced-motion handling.",
  path: "/docs/glassmorphism-react-components",
  keywords: [
    "glassmorphism react components",
    "glass ui react",
    "liquid glass react",
    "glass design system",
    "tailwind glassmorphism"
  ]
})

const usageSnippet = `import { GlassCard } from "@glinui/ui"

export function PlanCard() {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-medium">Team plan</h3>
      <p className="text-sm text-muted">Unlimited projects and shared tokens.</p>
    </GlassCard>
  )
}`

const faqs: FaqEntry[] = [
  {
    question: "What are glassmorphism React components?",
    answer:
      "Glassmorphism React components use translucent layers, background blur, and subtle borders to suggest depth, while keeping semantic HTML and keyboard behavior intact."
  },
  {
    question: "Can glassmorphism be accessible?",
    answer:
      "Yes, if text contrast is checked against the real backdrop, focus rings stay visible, and motion respects prefers-reduced-motion. Glass works best on calm backgrounds and for secondary surfaces."
  },
  {
    question: "Is Glin UI only glassmorphism?",
    answer:
      "No. Glass is one surface variant. Glin UI also has solid and outline surfaces, OKLCH tokens, an animation hub, and copy-for-AI prompts."
  },
  {
    question: "Does glassmorphism hurt performance?",
    answer:
      "Backdrop blur is costly on large or stacked surfaces. Limit how many blurred layers overlap, avoid animating blur radius, and animate transform and opacity instead."
  }
]

export default function GlassmorphismReactComponentsPage() {
  return (
    <main className="space-y-12">
      <FaqBreadcrumbJsonLd
        name="Glassmorphism React Components"
        path="/docs/glassmorphism-react-components"
        faqs={faqs}
      />
      <PageHeader
        eyebrow="Surface variant"
        title="Glassmorphism React components"
        lead="Glass is one surface variant in Glin UI, next to solid and outline. Use it where depth helps, and check contrast where it can hurt."
      />

      <PageSection
        id="preview"
        title="Glass on a real backdrop"
        description="Glass only reads as glass when something sits behind it. Pair it with a calm gradient or image, never a busy pattern."
      >
        <div className="rounded-card border border-line-soft bg-gradient-to-br from-violet-400/40 via-sky-300/30 to-emerald-300/30 p-6 sm:p-10">
          <GlassCard className="mx-auto max-w-sm p-6">
            <h3 className="type-h3">Team plan</h3>
            <p className="type-body text-muted">Unlimited projects and shared tokens.</p>
          </GlassCard>
        </div>
        <CodeBlock language="tsx" code={usageSnippet} />
      </PageSection>

      <PageSection
        id="checklist"
        title="Production checklist"
        description="Tick these off before shipping a glass surface. Each one is a common way glass goes wrong."
      >
        <Checklist>
          <ChecklistItem>Text keeps WCAG AA contrast (4.5:1) against the real backdrop in light and dark.</ChecklistItem>
          <ChecklistItem>Blur, border, and elevation come from tokens, not one-off values.</ChecklistItem>
          <ChecklistItem>Animations use transform and opacity, not blur radius.</ChecklistItem>
          <ChecklistItem>Reduced-motion users get a static version of every animated surface.</ChecklistItem>
          <ChecklistItem>No more than two blurred layers overlap on the same screen area.</ChecklistItem>
        </Checklist>
      </PageSection>

      <PageSection id="usage" title="When to use glass, and when not to">
        <DoDont
          dos={[
            { text: "Use glass for overlays, floating navbars, and docks over rich backgrounds." },
            { text: "Test contrast with the busiest part of the backdrop behind the text." },
            { text: "Fall back to a solid surface when backdrop blur is unsupported." }
          ]}
          donts={[
            { text: "Do not use glass for dense tables or long form text." },
            { text: "Do not stack several glass panels over each other." },
            { text: "Do not rely on blur alone to separate text from a noisy image." }
          ]}
        />
        <Callout variant="tip" title="Check contrast with the color tools">
          The <Link className="underline underline-offset-4" href="/docs/colors">color explorer</Link> shows live AA and
          AAA badges for token pairs. See <Link className="underline underline-offset-4" href="/docs/color-contrast">color contrast</Link> for how to test glass.
        </Callout>
      </PageSection>

      <PageSection id="faq" title="Frequently asked questions">
        <FaqList faqs={faqs} />
      </PageSection>

      <RelatedLinks
        heading="Keep reading"
        links={[
          { href: "/docs/glass-physics", label: "Glass physics", description: "Elevation levels and surface previews." },
          { href: "/docs/tokens", label: "Design tokens", description: "OKLCH tokens and the Tailwind preset." },
          { href: "/docs/components/glass-card", label: "Glass Card", description: "API and examples." }
        ]}
      />
    </main>
  )
}
