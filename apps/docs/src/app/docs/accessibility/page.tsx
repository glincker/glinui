import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Eye, Crosshair, Headphones, ShieldCheck } from "@phosphor-icons/react/dist/ssr"

import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { createDocsMetadata } from "@/lib/docs-metadata"

const guides = [
  {
    title: "Forms Accessibility",
    href: "/docs/forms-accessibility",
    description: "Labeling rules for Input, Select, Textarea, Checkbox, Radio Group, and Switch.",
    icon: ShieldCheck
  },
  {
    title: "Screen Reader Testing",
    href: "/docs/screen-reader-testing",
    description: "A release checklist for VoiceOver, NVDA, and mobile screen readers.",
    icon: Headphones
  },
  {
    title: "Focus Management",
    href: "/docs/focus-management",
    description: "Focus restore, skip links, and a keyboard reference for dialogs and menus.",
    icon: Crosshair
  },
  {
    title: "Color Contrast",
    href: "/docs/color-contrast",
    description: "AA and AAA targets, token pair ratios, and how to test text on glass.",
    icon: Eye
  }
]

export const metadata: Metadata = createDocsMetadata({
  title: "Accessibility Hub",
  description:
    "Accessibility guidance for forms, screen readers, focus management, and color contrast across Glin UI components and tokens.",
  path: "/docs/accessibility",
  keywords: ["UI accessibility", "WCAG guidance", "screen reader testing", "keyboard navigation"]
})

export default function AccessibilityPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Accessibility"
        title="Accessibility Hub"
        lead="Practical guides for building and testing accessible interfaces with Glin UI: forms, screen readers, keyboard focus, and contrast."
      />

      <PageSection id="guides" title="Guides">
        <ul className="grid gap-4 md:grid-cols-2">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <li key={guide.href}>
                <Link
                  href={guide.href}
                  className="group flex h-full flex-col gap-2 rounded-card border border-line-soft bg-surface-1 p-4 hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                >
                  <span className="flex items-center gap-2 text-base font-medium">
                    <Icon className="size-4 text-accent" aria-hidden="true" />
                    {guide.title}
                    <ArrowRight
                      className="ml-auto size-4 text-muted transition-transform motion-reduce:transition-none group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="type-body text-muted">{guide.description}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </PageSection>

      <PageSection id="baseline" title="What the components give you">
        <p className="type-body max-w-[68ch] text-muted">
          Glin UI components are built on Radix UI primitives, which handle keyboard interaction, focus management, and
          ARIA roles for overlays, menus, and form controls. Styling and tokens are layered on top.
        </p>
        <Callout variant="warning" title="Primitives are not a guarantee">
          Accessible primitives still need accessible content. Labels, headings, error text, and color choices are your
          responsibility, so run the checklists in these guides before release.
        </Callout>
      </PageSection>
    </main>
  )
}
