import type { Metadata } from "next"

import { CompareLockup } from "@/components/brand/compare-lockup"
import { ComparePage } from "@/components/docs-pages-b/compare-page"
import type { CompareRow } from "@/components/docs-pages-b/compare-table"
import type { FaqEntry } from "@/components/docs-pages-b/json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Radix UI Components with Glin UI",
  description:
    "How Glin UI builds on Radix UI primitives: what you get on top (OKLCH tokens, variants, animations, AI prompts), what raw Radix does better, and how to choose.",
  path: "/docs/radix-ui-components",
  keywords: [
    "radix ui components",
    "radix ui react",
    "accessible radix components",
    "react radix component library",
    "radix ui design system"
  ]
})

const rows: CompareRow[] = [
  {
    feature: "Accessibility behavior",
    glin: "Inherited from Radix UI primitives: keyboard handling, focus management, ARIA roles.",
    other: "The source of that behavior. Maintained directly by the Radix team.",
    edge: "even"
  },
  {
    feature: "Styling out of the box",
    glin: "Styled with Tailwind, OKLCH tokens, and solid, outline, and glass variants.",
    other: "Primitives are unstyled. Radix Themes is a separate, styled option.",
    edge: "glin"
  },
  {
    feature: "Consistent API across components",
    glin: "Shared variant and size conventions across the catalog.",
    other: "Consistent primitive APIs, but your wrappers define the design-level API.",
    edge: "glin"
  },
  {
    feature: "Animations and reduced motion",
    glin: "Motion guidance, an animation hub, and reduced-motion handling.",
    other: "Exposes animation hooks such as data-state. Motion itself is your code.",
    edge: "glin"
  },
  {
    feature: "AI-ready prompts",
    glin: "Copy-for-AI prompt per component page.",
    other: "Standard API docs only.",
    edge: "glin"
  },
  {
    feature: "Primitive breadth and depth",
    glin: "Covers the components the catalog needs.",
    other: "The full Radix primitive set, plus Radix Themes and Radix Colors.",
    edge: "other"
  },
  {
    feature: "Styling freedom",
    glin: "Editable code, but it starts from our token and surface language.",
    other: "Zero visual opinion. Build any design system on top.",
    edge: "other"
  },
  {
    feature: "Upstream stability",
    glin: "Depends on Radix and on this project's own release cadence.",
    other: "First-party, widely used, and versioned independently.",
    edge: "other"
  }
]

const faqs: FaqEntry[] = [
  {
    question: "Does Glin UI use Radix UI?",
    answer:
      "Yes. Glin UI components are built on Radix UI primitives. Accessibility behavior such as keyboard navigation and focus management comes from the primitives."
  },
  {
    question: "What does Glin UI add on top of Radix?",
    answer:
      "Tailwind styling, OKLCH design tokens, solid, outline, and glass variants, an animation hub, accessibility guides, and copy-for-AI prompts for each component."
  },
  {
    question: "Should I use raw Radix primitives instead?",
    answer:
      "Use raw Radix if you are building your own design system and want zero visual opinion. Use Glin UI if you want styled, tokenized components you can edit."
  },
  {
    question: "Are Glin UI components fully accessible?",
    answer:
      "They start from accessible primitives, but accessibility also depends on how you label and compose them. The accessibility guides in these docs cover forms, focus, screen readers, and contrast."
  }
]

export default function RadixUiComponentsPage() {
  return (
    <ComparePage
      lockup={<CompareLockup other="radix-ui" joiner="on" />}
      eyebrow="Radix UI"
      title="Radix UI components, styled with Glin UI"
      lead="Glin UI sits on top of Radix UI primitives. You keep the keyboard and focus behavior, and get styling, tokens, variants, and animations on top. Here is what that trade looks like."
      path="/docs/radix-ui-components"
      breadcrumbName="Radix UI Components"
      otherName="Raw Radix"
      summary={
        <>
          <p>
            Radix UI handles the hard parts of accessible interaction: dialogs, menus, popovers, selects, and more.
            It leaves the visual design to you.
          </p>
          <p>
            Glin UI is one way to fill that gap. Components are wired to OKLCH tokens and a shared elevation scale,
           , and you can edit the source after adding it.
          </p>
        </>
      }
      rows={rows}
      chooseGlin={[
        "You want Radix accessibility behavior without writing all the styles.",
        "You want tokens, variants, and motion guidance already decided.",
        "You still want to edit the component source.",
        "You use AI tools and want prompts that describe each component."
      ]}
      chooseOther={[
        "You are building a design system with its own visual language.",
        "You want the complete Radix primitive set and Radix Themes.",
        "You prefer to depend only on a first-party library.",
        "You have designers who specify every pixel."
      ]}
      faqs={faqs}
      related={[
        { href: "/docs/accessibility", label: "Accessibility hub", description: "Forms, focus, screen readers, contrast." },
        { href: "/docs/components", label: "Component catalog", description: "Browse every component." },
        { href: "/docs/shadcn-alternative", label: "Glin UI vs shadcn/ui", description: "Another Radix-based option." }
      ]}
    />
  )
}
