import type { Metadata } from "next"
import Link from "next/link"

import { BrandTag } from "@/components/brand/brand-tag"
import { DocSection, PageHeader } from "@/components/docs-pages/page-header"
import { LinkPill } from "@/components/docs-pages/link-pill"
import {
  brandTokens,
  elevationTokens,
  glassCoreTokens,
  layoutTokens,
  motionTokenRows,
  radiusTokens,
  semanticTokens,
  surfaceTokens
} from "@/components/docs-pages/token-data"
import { GlassLevelSpecimens, TypeSpecimens } from "@/components/docs-pages/token-extras"
import { TokenList } from "@/components/docs-pages/token-list"
import { BaseColorsSection } from "./base-colors-section"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Design Tokens and Theme Contract",
  description:
    "Reference Glin UI color, surface, elevation, type, radius, layout, motion, and glass tokens shared across components and docs.",
  path: "/docs/tokens",
  keywords: ["design tokens", "theme contract", "OKLCH tokens", "CSS variables", "Tailwind preset tokens"]
})

export default function TokensPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="@glinui/tokens"
        title="Design Tokens and Theme Contract"
        lead="One CSS file defines color, surface, elevation, type, radius, layout, and motion as variables, in light and dark. Click any name to copy it."
      >
        <LinkPill href="/docs/colors" primary>
          Open the color explorer
        </LinkPill>
        <LinkPill href="/docs/getting-started">Install tokens</LinkPill>
        <BrandTag name="tailwindcss">Tailwind preset included</BrandTag>
      </PageHeader>

      <DocSection
        id="brand"
        title="Brand accent"
        description="A single violet accent in OKLCH. The dark value is lighter so contrast holds on dark surfaces."
      >
        <TokenList rows={brandTokens} label="Brand tokens" />
      </DocSection>

      <DocSection
        id="base-colors"
        title="Base colors"
        description={
          <>
            Six neutral scales via <code className="type-code">data-glin-base</code>: obsidian (default), neutral, zinc, slate, stone,
            gray. Set it on <code className="type-code">html</code> or any element to scope it. Every pair keeps WCAG AA in light and dark
            (<code className="type-code">pnpm --filter @glinui/docs tokens:check</code>).
          </>
        }
      >
        <BaseColorsSection />
      </DocSection>

      <DocSection
        id="surfaces"
        title="Surfaces"
        description="Tonal stacking: 0 is the page, 3 is the highest. The well is recessed for code and previews."
      >
        <TokenList rows={surfaceTokens} label="Surface tokens" />
      </DocSection>

      <DocSection
        id="semantic"
        title="Semantic and signal colors"
        description={
          <>
            Text, border, and status colors. Explore ramps, contrast ratios, and export formats in the{" "}
            <Link className="text-brand underline underline-offset-4" href="/docs/colors">
              color explorer
            </Link>
            .
          </>
        }
      >
        <TokenList rows={semanticTokens} label="Semantic color tokens" />
      </DocSection>

      <DocSection
        id="elevation"
        title="Elevation"
        description="One light source above: a top highlight plus layered drops. Dark mode swaps the highlight for a quieter edge and deepens the drops."
      >
        <TokenList rows={elevationTokens} label="Elevation tokens" />
      </DocSection>

      <DocSection id="type" title="Type scale and fonts" description="Inter for text, JetBrains Mono for code and eyebrows.">
        <TypeSpecimens />
      </DocSection>

      <DocSection id="radius" title="Radius">
        <TokenList rows={radiusTokens} label="Radius tokens" />
      </DocSection>

      <DocSection id="layout" title="Layout and spacing" description="Bars show relative length where a fixed size applies.">
        <TokenList rows={layoutTokens} label="Layout tokens" />
      </DocSection>

      <DocSection
        id="motion"
        title="Motion"
        description={
          <>
            Durations and easing curves. Play them in the{" "}
            <Link className="text-brand underline underline-offset-4" href="/docs/motion">
              motion guide
            </Link>{" "}
            or the{" "}
            <Link className="text-brand underline underline-offset-4" href="/docs/animations">
              animations hub
            </Link>
            .
          </>
        }
      >
        <TokenList rows={motionTokenRows} label="Motion tokens" />
      </DocSection>

      <DocSection
        id="glass"
        title="Glass variant"
        description={
          <>
            Glass is one surface variant, not the whole system. These tokens drive the <code className="type-code">.glass-1</code>{" "}
            to <code className="type-code">.glass-5</code> utilities. Deep dive:{" "}
            <Link className="text-brand underline underline-offset-4" href="/docs/glass-physics">
              glass physics
            </Link>
            .
          </>
        }
      >
        <GlassLevelSpecimens />
        <TokenList rows={glassCoreTokens} label="Glass tokens" />
      </DocSection>
    </main>
  )
}
