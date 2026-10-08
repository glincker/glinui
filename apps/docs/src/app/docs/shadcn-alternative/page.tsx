import type { Metadata } from "next"

import { CompareLockup } from "@/components/brand/compare-lockup"
import { ComparePage } from "@/components/docs-pages-b/compare-page"
import type { CompareRow } from "@/components/docs-pages-b/compare-table"
import type { FaqEntry } from "@/components/docs-pages-b/json-ld"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Glin UI vs shadcn/ui",
  description:
    "An honest comparison of Glin UI and shadcn/ui: ownership model, variants, OKLCH tokens, animations, copy-for-AI prompts, accessibility, and where shadcn/ui is the better pick.",
  path: "/docs/shadcn-alternative",
  keywords: [
    "shadcn alternative",
    "shadcn ui alternative",
    "glin ui vs shadcn",
    "glassmorphism component library",
    "react component library comparison"
  ]
})

const rows: CompareRow[] = [
  {
    feature: "Code ownership",
    glin: "Add components with the CLI, or install @glinui/ui as a package. Both paths are supported.",
    other: "Copy components into your repo with the CLI. Package-style install is not the model.",
    edge: "even"
  },
  {
    feature: "Accessibility base",
    glin: "Built on Radix UI primitives, with QA guides for forms, focus, screen readers, and contrast.",
    other: "Built on accessible primitives. Quality of the final result depends on your edits.",
    edge: "even"
  },
  {
    feature: "Design tokens",
    glin: "OKLCH tokens in @glinui/tokens, exposed as a Tailwind preset (surfaces, elevation, radii, type).",
    other: "CSS variables for theming, with a large set of community themes.",
    edge: "glin"
  },
  {
    feature: "Surface variants",
    glin: "Solid, outline, and glass surface variants share one elevation scale.",
    other: "Clean default look. Extra surface styles are yours to define.",
    edge: "glin"
  },
  {
    feature: "Animations",
    glin: "A browsable animation hub plus a motion package with reduced-motion handling.",
    other: "Minimal motion by default. Animations come from your own code or third-party libraries.",
    edge: "glin"
  },
  {
    feature: "AI-ready prompts",
    glin: "Each component and color page has a copy-for-AI prompt with its API and tokens.",
    other: "Has AI tooling and a registry that agents can read.",
    edge: "even"
  },
  {
    feature: "Ecosystem and community",
    glin: "Young project with a smaller catalog and fewer third-party resources.",
    other: "Very large community, many third-party registries, blocks, and tutorials.",
    edge: "other"
  },
  {
    feature: "Maturity and battle testing",
    glin: "Newer, with less production mileage.",
    other: "Widely used in production, with a long issue and fix history.",
    edge: "other"
  },
  {
    feature: "Starting from a blank slate",
    glin: "Opinionated tokens and surface language. Easy to retheme, but you start from ours.",
    other: "Neutral baseline that is easy to bend toward any brand.",
    edge: "other"
  }
]

const faqs: FaqEntry[] = [
  {
    question: "Is Glin UI a shadcn/ui alternative?",
    answer:
      "Yes, for teams that want the same ownership model plus built-in OKLCH tokens, surface variants (including glass), an animation hub, and copy-for-AI prompts. shadcn/ui remains the stronger choice if you value the largest ecosystem."
  },
  {
    question: "What is the main difference between Glin UI and shadcn/ui?",
    answer:
      "shadcn/ui is a neutral, widely adopted baseline that you shape per project. Glin UI ships a token system, shared surface and elevation scale, and motion guidance on top of accessible primitives, so you spend less time defining those yourself."
  },
  {
    question: "Can I own the code like I do with shadcn/ui?",
    answer:
      "Yes. Run the Glin UI CLI to add a component into your project, or install the @glinui/ui package if you prefer upgrades over local edits."
  },
  {
    question: "Can I use both in one project?",
    answer:
      "Yes. Both use Tailwind and Radix-style primitives, so you can adopt Glin UI components one at a time and keep existing shadcn/ui components where they work."
  }
]

export default function ShadcnAlternativePage() {
  return (
    <ComparePage
      lockup={<CompareLockup other="shadcn-ui" joiner="vs" />}
      eyebrow="Comparison"
      title="Glin UI vs shadcn/ui"
      lead="shadcn/ui is the default starting point for owned React components. Glin UI keeps that model and adds tokens, surface variants, animations, and AI prompts. Here is where each one is stronger."
      path="/docs/shadcn-alternative"
      breadcrumbName="Glin UI vs shadcn/ui"
      otherName="shadcn/ui"
      summary={
        <>
          <p>
            Both libraries give you accessible React components styled with Tailwind that you can edit. The split is
            in what ships around the components.
          </p>
          <p>
            Glin UI includes an OKLCH token system, a shared elevation scale, a motion package, and prompts you can
            paste into an AI tool. shadcn/ui is leaner and has a much bigger community.
          </p>
        </>
      }
      rows={rows}
      chooseGlin={[
        "You want tokens, elevation, and motion decided up front so teams stay consistent.",
        "You want solid, outline, and glass variants from one system.",
        "You hand component context to AI tools and want ready prompts.",
        "You like ownership via CLI but also want a package option."
      ]}
      chooseOther={[
        "You want the largest community, registry ecosystem, and set of tutorials.",
        "You need a neutral baseline to bend toward your own brand.",
        "You prefer a smaller surface area with fewer opinions.",
        "Production track record matters more than built-in extras."
      ]}
      faqs={faqs}
      related={[
        { href: "/docs/getting-started", label: "Getting started", description: "Install with the CLI or the package." },
        { href: "/docs/tokens", label: "Design tokens", description: "OKLCH tokens and the Tailwind preset." },
        { href: "/docs/radix-ui-components", label: "Radix UI components", description: "How Glin UI builds on Radix." }
      ]}
    />
  )
}
