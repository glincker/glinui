"use client"

import { ColorElevation } from "@/components/hub/color-elevation"
import { ColorExportBar } from "@/components/hub/color-export-bar"
import { ColorRamp } from "@/components/hub/color-ramp"
import { ColorSampleUi } from "@/components/hub/color-sample-ui"
import { ColorSwatch } from "@/components/hub/color-swatch"
import { allColorTokens, colorGroups } from "@/components/hub/color-tokens"
import { useThemeTokens } from "@/components/hub/use-theme-tokens"

const names = allColorTokens.map((t) => t.name)

function Section({ id, title, blurb, children }: { id: string; title: string; blurb?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`${id}-heading`} className="space-y-4">
      <div className="space-y-1">
        <h2 id={`${id}-heading`} className="type-section">{title}</h2>
        {blurb ? <p className="type-body max-w-[60ch] text-[var(--color-muted)]">{blurb}</p> : null}
      </div>
      {children}
    </section>
  )
}

export function ColorExplorer() {
  const { live, sheets, isDark, base } = useThemeTokens(names)
  return (
    <div className="space-y-12">
      <div className="space-y-3">
        <ColorExportBar sheets={sheets} live={live} base={base} />
        <p className="text-[13px] tabular-nums text-[var(--color-muted)]" aria-live="polite">
          Values below are read live from your current theme ({isDark ? "dark" : "light"}, base {base}). Toggle the theme to see them change.
        </p>
      </div>
      {colorGroups.map((group) => (
        <Section key={group.id} id={group.id} title={group.title} blurb={group.blurb}>
          <ul className="grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 xl:grid-cols-5">
            {group.tokens.map((token) => (
              <ColorSwatch key={token.name} token={token} live={live} />
            ))}
          </ul>
        </Section>
      ))}
      <Section id="ramp" title="Accent tonal ramp" blurb="Fifty to 950, generated from the brand accent with OKLCH math.">
        <ColorRamp accent={live["--color-accent"] ?? ""} />
      </Section>
      <Section id="preview" title="Light and dark, side by side" blurb="The same sample UI driven only by tokens.">
        <ColorSampleUi sheets={sheets} />
      </Section>
      <Section id="elevation" title="Elevation" blurb="One light source above. Shadows, rings, and hairlines all come from tokens.">
        <ColorElevation />
      </Section>
    </div>
  )
}
