import type { Metadata } from "next"

import { DocSection, PageHeader } from "@/components/docs-pages/page-header"
import {
  AliasList,
  AlertMatrixDemo,
  BadgeMatrixDemo,
  ButtonMatrixDemo,
  CardMatrixDemo,
  SurfaceMatrixDemo,
  ThemeScopeDemo
} from "@/components/variants/variant-demos"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Variants",
  description:
    "One variant vocabulary for every surface: solid, soft, outline, ghost, gradient and glass, with a semantic tone axis and theme scopes that adapt components to any backdrop.",
  path: "/docs/variants",
  keywords: ["design system variants", "solid soft outline ghost gradient glass", "theme scope", "react component variants"]
})

const variantRows = [
  ["glinr", "Signature lift. Concentric radii, gradient hairline ring, tonal shell, raised pill controls, inset wells. Default of the glinr style.", "Cards, panels, tabs, code, popovers, signature components"],
  ["plain", "shadcn-compatible look. Flat fill, 1px border, small radius, shadow-sm at most. Default of the minimal style.", "Teams coming from shadcn, dense admin UI"],
  ["solid", "Neutral black and white with tonal depth (ring, highlight, drops). Crisp opaque fill with a top highlight, hairline ring and layered drop shadow.", "Primary actions, badges, most surfaces"],
  ["soft", "Tinted surface: surface-2 for neutral, 12 percent tone mix for other tones, tone text.", "Secondary actions, status, inline notices"],
  ["outline", "Transparent with a hairline ring and a hover wash.", "Tertiary actions, toolbars, forms"],
  ["ghost", "Transparent, tint on hover only.", "Dense UI, icon buttons, menus"],
  ["gradient", "Accent to brand gradient, white text.", "One hero call to action per view"],
  ["glass", "Opt-in frosted surface with a readable opacity floor. Needs a backdrop.", "Overlays and floating panels over imagery"]
] as const

const styleRows = [
  ["glinr", "glinr", "Library default, also without any provider."],
  ["minimal", "plain", "Flat shadcn-like. Keeps the neutral black and white palette."],
  ["glass", "glass", "Opt-in aesthetic. It needs a colorful backdrop to read, wrap it in a ThemeScope with luminance."]
] as const

const decisionRows = [
  ["The main action on the screen", "solid or glinr", "tone accent for brand emphasis"],
  ["A supporting action next to a solid one", "soft or outline", "outline when the surface is busy"],
  ["Status, validation, tags", "soft", "tone success, warning, danger, info"],
  ["Toolbars, tables, dense lists", "ghost", "keeps rows quiet"],
  ["A marketing hero", "gradient", "limit to one per view"],
  ["Floating over a photo or gradient", "glass", "wrap in a dark ThemeScope when the image is dark"]
] as const

export default function VariantsPage() {
  return (
    <main className="space-y-12">
      <PageHeader
        eyebrow="Foundations"
        title="Variants"
        lead="Every surface speaks the same variant language. The design style picks the default (glinr, minimal or glass), and a tone axis carries meaning. Components adapt to the nearest theme scope automatically."
      />

      <DocSection id="vocabulary" title="Vocabulary" description="Eight variants with the same meaning on every component. The ladder from flat to rich is plain, solid, glinr.">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-xs text-[var(--color-muted)]">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Variant</th>
                <th scope="col" className="px-4 py-2 font-medium">Look</th>
                <th scope="col" className="px-4 py-2 font-medium">Use for</th>
              </tr>
            </thead>
            <tbody>
              {variantRows.map(([name, look, use]) => (
                <tr key={name} className="border-t border-border/60 align-top">
                  <th scope="row" className="px-4 py-2 font-mono text-xs">{name}</th>
                  <td className="px-4 py-2">{look}</td>
                  <td className="px-4 py-2 text-[var(--color-muted)]">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="styles" title="Design styles" description="One setting in GlinProvider (style) or data-glin-style on any element switches the default variant of every component that has no explicit variant prop.">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-xs text-[var(--color-muted)]">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Style</th>
                <th scope="col" className="px-4 py-2 font-medium">Default variant</th>
                <th scope="col" className="px-4 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {styleRows.map(([name, variant, note]) => (
                <tr key={name} className="border-t border-border/60 align-top">
                  <th scope="row" className="px-4 py-2 font-mono text-xs">{name}</th>
                  <td className="px-4 py-2 font-mono text-xs">{variant}</td>
                  <td className="px-4 py-2 text-[var(--color-muted)]">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection id="matrix" title="Variant by tone" description="The shared surface builders rendered across every variant and tone, in both theme scopes.">
        <SurfaceMatrixDemo />
      </DocSection>

      <DocSection id="button" title="Button" description="Existing Button variants shown under the standard names. Names marked extra stay as additional looks.">
        <ButtonMatrixDemo />
      </DocSection>

      <DocSection id="badge" title="Badge">
        <BadgeMatrixDemo />
      </DocSection>

      <DocSection id="card" title="Card">
        <CardMatrixDemo />
      </DocSection>

      <DocSection id="alert" title="Alert">
        <AlertMatrixDemo />
      </DocSection>

      <DocSection id="aliases" title="Legacy aliases" description="Old names keep working and resolve to the vocabulary.">
        <AliasList />
      </DocSection>

      <DocSection id="theme-scope" title="ThemeScope" description="Force light or dark on a subtree. Tokens, glass opacity and dark: utilities all follow the scope.">
        <ThemeScopeDemo />
      </DocSection>

      <DocSection id="pick" title="Pick a variant">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--surface-2)] text-xs text-[var(--color-muted)]">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">When</th>
                <th scope="col" className="px-4 py-2 font-medium">Variant</th>
                <th scope="col" className="px-4 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {decisionRows.map(([when, variant, note]) => (
                <tr key={when} className="border-t border-border/60 align-top">
                  <td className="px-4 py-2">{when}</td>
                  <th scope="row" className="px-4 py-2 font-mono text-xs">{variant}</th>
                  <td className="px-4 py-2 text-[var(--color-muted)]">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocSection>
    </main>
  )
}
