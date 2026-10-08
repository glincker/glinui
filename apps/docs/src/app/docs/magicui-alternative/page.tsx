import type { Metadata } from "next"

import { CompareLockup } from "@/components/brand/compare-lockup"
import { ComparePage } from "@/components/docs-pages-b/compare-page"
import type { CompareRow } from "@/components/docs-pages-b/compare-table"
import type { FaqEntry } from "@/components/docs-pages-b/json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Glin UI vs Magic UI",
  description:
    "An honest comparison of Glin UI and Magic UI: animated effects versus a full component and token system, accessibility, OKLCH tokens, AI prompts, and where Magic UI is the better pick.",
  path: "/docs/magicui-alternative",
  keywords: [
    "magic ui alternative",
    "glin ui vs magic ui",
    "react ui library comparison",
    "animated react components",
    "accessible react components"
  ]
})

const rows: CompareRow[] = [
  {
    feature: "Primary focus",
    glin: "App components, tokens, colors, animations, and prompts in one system.",
    other: "Animated components and visual effects, mostly for landing pages.",
    edge: "even"
  },
  {
    feature: "Animation catalog",
    glin: "A browsable animation hub with a motion package. Smaller than a dedicated effects library.",
    other: "A large catalog of polished effects: marquees, beams, text and background animations.",
    edge: "other"
  },
  {
    feature: "Form and app primitives",
    glin: "Inputs, selects, dialogs, tables, and other app components on Radix UI primitives.",
    other: "Light on form and data primitives. It pairs with a base library for those.",
    edge: "glin"
  },
  {
    feature: "Accessibility guidance",
    glin: "Focus, forms, contrast, and screen reader guides, with reduced-motion handling.",
    other: "Effects are visual first. Accessibility is largely left to the integrator.",
    edge: "glin"
  },
  {
    feature: "Design tokens",
    glin: "OKLCH tokens and a Tailwind preset shared by every component.",
    other: "Relies on the host project's Tailwind theme.",
    edge: "glin"
  },
  {
    feature: "Code ownership",
    glin: "CLI add or package install.",
    other: "CLI or copy-paste into your project.",
    edge: "even"
  },
  {
    feature: "AI-ready prompts",
    glin: "Copy-for-AI prompts on component and color pages.",
    other: "Not a core feature of the docs.",
    edge: "glin"
  },
  {
    feature: "Marketing site templates",
    glin: "Component-level blocks, not full templates.",
    other: "Offers landing page templates and sections built from its effects.",
    edge: "other"
  }
]

const faqs: FaqEntry[] = [
  {
    question: "Is Glin UI a Magic UI alternative?",
    answer:
      "Partly. Glin UI covers animated components too, but it also includes app primitives, OKLCH tokens, and accessibility guides. If you only need a large set of marketing effects, Magic UI is the more specialized choice."
  },
  {
    question: "What is the main difference between Glin UI and Magic UI?",
    answer:
      "Magic UI is an effects library you drop into a project. Glin UI is a component and token system where animations are one part, alongside forms, overlays, data components, and color tools."
  },
  {
    question: "Can I use Glin UI and Magic UI together?",
    answer:
      "Yes. Use Glin UI for the app foundation and add Magic UI effects where a landing page needs them. Check reduced-motion behavior on any effect you add."
  },
  {
    question: "Do the animations respect reduced motion?",
    answer:
      "Glin UI animations are built to honor prefers-reduced-motion. Verify any third-party effect yourself, since support varies by component."
  }
]

export default function MagicUiAlternativePage() {
  return (
    <ComparePage
      lockup={<CompareLockup other="magic-ui" joiner="vs" />}
      eyebrow="Comparison"
      title="Glin UI vs Magic UI"
      lead="Magic UI is a focused library of animated effects. Glin UI is a wider system with animations, app components, OKLCH tokens, and AI prompts. They overlap less than you might expect."
      path="/docs/magicui-alternative"
      breadcrumbName="Glin UI vs Magic UI"
      otherName="Magic UI"
      summary={
        <>
          <p>
            If your goal is an eye-catching landing page, Magic UI has more effects to choose from. If your goal is a
            product UI with forms, dialogs, tables, and a consistent token system, Glin UI covers more ground.
          </p>
          <p>Many teams will reasonably use both.</p>
        </>
      }
      rows={rows}
      chooseGlin={[
        "You are building an app and need forms, overlays, and data components.",
        "You want one token system across components, colors, and animations.",
        "You need accessibility guides and reduced-motion handling alongside the visuals.",
        "You want copy-for-AI prompts for your components."
      ]}
      chooseOther={[
        "You are building a marketing site and want the widest set of effects.",
        "You want ready landing page sections and templates.",
        "You already have a base component library and just need animations.",
        "Effect variety matters more than a unified system."
      ]}
      faqs={faqs}
      related={[
        { href: "/docs/motion", label: "Motion", description: "Easing, durations, and reduced motion." },
        { href: "/docs/shadcn-alternative", label: "Glin UI vs shadcn/ui", description: "The other common comparison." },
        { href: "/docs/components", label: "Component catalog", description: "Browse every component." }
      ]}
    />
  )
}
