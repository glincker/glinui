import type { Metadata } from "next"
import Link from "next/link"

import {
  glassLevelTokens,
  glassLuminanceTokens,
  glassOpacityScaleTokens,
  glassPerformanceTokens
} from "@glinui/tokens"
import { GlassLab } from "@/components/docs-pages/glass-lab"
import { LinkPill } from "@/components/docs-pages/link-pill"
import { DocSection, PageHeader } from "@/components/docs-pages/page-header"
import { createDocsMetadata } from "@/lib/docs-metadata"

const glassLevelIds = ["glass-1", "glass-2", "glass-3", "glass-4", "glass-5"] as const
const glassLevels = glassLevelIds.map((id) => ({ id, ...glassLevelTokens[id] }))

const opacitySwatches = [
  "bg-[rgb(255_255_255_/_var(--glass-opacity-1))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-1))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-2))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-2))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-3))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-3))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-4))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-4))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-5))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-5))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-6))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-6))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-7))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-7))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-8))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-8))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-9))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-9))]",
  "bg-[rgb(255_255_255_/_var(--glass-opacity-10))] dark:bg-[rgb(0_0_0_/_var(--glass-opacity-10))]"
] as const

const backdrop = "rounded-card bg-gradient-to-br from-violet-500 via-fuchsia-400 to-amber-300 p-4"

export const metadata: Metadata = createDocsMetadata({
  title: "Glass Physics",
  description:
    "Glass variant deep dive: blur, saturate, refraction edges, elevation levels, opacity scale, luminance adaptation, and performance hints.",
  path: "/docs/glass-physics",
  keywords: ["glass physics", "glassmorphism tokens", "backdrop-filter saturate", "refraction edge", "glass elevation"]
})

export default function GlassPhysicsPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Glass variant"
        title="Glass Physics"
        lead="Glass is one surface variant in Glin UI. It layers blur, saturate, a translucent fill, and a brighter refraction edge so a panel reads as a pane over its backdrop."
      >
        <LinkPill href="/docs/tokens#glass">Glass tokens</LinkPill>
        <LinkPill href="/docs/components/glass-card">Glass card</LinkPill>
      </PageHeader>

      <DocSection
        id="lab"
        title="Glass lab"
        description="Tune blur, opacity, and saturate over a vivid backdrop, then copy the CSS. Always pair saturate with blur: blur alone turns colors gray."
      >
        <GlassLab />
      </DocSection>

      <DocSection
        id="levels"
        title="Elevation levels"
        description="Five levels combine blur, fill opacity, refraction border, and shadow depth into reusable surfaces. Use .glass-1 to .glass-5."
      >
        <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-5 ${backdrop}`}>
          {glassLevels.map((level) => (
            <article key={level.id} className={`${level.id} rounded-input p-3`}>
              <h3 className="text-sm font-medium text-foreground">{level.id}</h3>
              <p className="mt-1 text-xs text-foreground/80">blur {level.blur}</p>
              <p className="text-xs text-foreground/80">
                opacity L:{level.opacity.light} D:{level.opacity.dark}
              </p>
              <p className="text-xs text-foreground/80">shadow {level.shadow}</p>
            </article>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="opacity"
        title="Opacity scale"
        description="Ten stops from crystal to frosted. Dark mode uses a black base at higher opacity for readability. Glass levels map to steps 2, 4, 6, 8, and 10."
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {opacitySwatches.map((swatchClass, index) => {
            const step = index + 1
            return (
              <li key={step} className="space-y-2 rounded-card border border-line-soft bg-surface-1 p-3">
                <div className={`rounded-input bg-gradient-to-br from-violet-500 to-amber-300 p-0`}>
                  <div className={`h-14 rounded-input border border-white/25 [border-top-color:var(--glass-refraction-top)] ${swatchClass}`} />
                </div>
                <p className="text-xs font-medium">opacity-{step}</p>
                <p className="font-mono text-[11px] text-muted">
                  L:{glassOpacityScaleTokens.light[step as 1]} D:{glassOpacityScaleTokens.dark[step as 1]}
                </p>
              </li>
            )
          })}
        </ul>
      </DocSection>

      <DocSection
        id="luminance"
        title="Luminance adaptation"
        description="Set a luminance context so glass adjusts opacity, borders, and saturation to the brightness behind it."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <div data-glass-luminance="bright" className="rounded-card bg-gradient-to-br from-white to-slate-200 p-3">
            <div className="glass-3 rounded-input p-3">
              <p className="font-mono text-[11px] text-foreground">data-glass-luminance=&quot;bright&quot;</p>
              <p className="mt-1 text-xs text-foreground/80">surface x{glassLuminanceTokens.bright.surfaceMultiplier}</p>
            </div>
          </div>
          <div data-glass-luminance="neutral" className="rounded-card bg-gradient-to-br from-slate-300 to-slate-500 p-3">
            <div className="glass-3 rounded-input p-3">
              <p className="font-mono text-[11px] text-foreground">data-glass-luminance=&quot;neutral&quot;</p>
              <p className="mt-1 text-xs text-foreground/80">surface x{glassLuminanceTokens.neutral.surfaceMultiplier}</p>
            </div>
          </div>
          <div data-glass-luminance="dim" className="rounded-card bg-gradient-to-br from-slate-800 to-slate-950 p-3">
            <div className="glass-3 rounded-input p-3">
              <p className="font-mono text-[11px] text-foreground">data-glass-luminance=&quot;dim&quot;</p>
              <p className="mt-1 text-xs text-foreground/80">surface x{glassLuminanceTokens.dim.surfaceMultiplier}</p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="performance"
        title="Performance and accessibility"
        description="Backdrop filters are expensive. Hint the compositor on heavy surfaces, limit stacked glass, and respect reduced transparency: the tokens swap to near-opaque fills and drop the filter."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <article className={`glass-gpu-hint glass-2 rounded-input p-4 ${backdrop}`}>
            <h3 className="font-mono text-sm font-medium text-foreground">.glass-gpu-hint</h3>
            <p className="mt-1 text-xs text-foreground/80">will-change: {glassPerformanceTokens.gpuHint.willChange}</p>
          </article>
          <article className={`glass-heavy glass-3 rounded-input p-4 ${backdrop}`}>
            <h3 className="font-mono text-sm font-medium text-foreground">.glass-heavy</h3>
            <p className="mt-1 text-xs text-foreground/80">will-change: {glassPerformanceTokens.heavySurface.willChange}</p>
          </article>
        </div>
        <p className="type-body max-w-[68ch] text-muted">
          Keep text on glass at 4.5:1 contrast or better. Check pairs in the{" "}
          <Link className="text-brand underline underline-offset-4" href="/docs/color-contrast">
            color contrast guide
          </Link>
          .
        </p>
      </DocSection>
    </main>
  )
}
