"use client"

import * as React from "react"

import { CopyChip } from "@/components/hub/copy-chip"
import { parseOklch, tonalRamp } from "@/lib/oklch"

const FALLBACK_HUE = 289

export function ColorRamp({ accent }: { accent: string }) {
  const hue = parseOklch(accent)?.h ?? FALLBACK_HUE
  const ramp = React.useMemo(() => tonalRamp({ l: 0.55, c: 0.2, h: hue }), [hue])
  const cssVars = ramp.map((s) => `--accent-${s.step}: ${s.css};`).join("\n")

  return (
    <div className="space-y-4">
      <ul className="grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-4 lg:grid-cols-11">
        {ramp.map((stop) => (
          <li key={stop.step} className="space-y-1">
            <svg viewBox="0 0 64 40" className="h-10 w-full rounded-lg ring-1 ring-[var(--line-soft)]" role="img" aria-label={`Accent ${stop.step}: ${stop.hex}`}>
              <rect width="64" height="40" fill={stop.css} />
            </svg>
            <p className="font-mono text-[12px] font-medium tabular-nums text-foreground">{stop.step}</p>
            <div className="-mx-1.5">
              <CopyChip value={stop.css} label={`accent ${stop.step} OKLCH`} display={stop.hex} />
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-3">
        <CopyChip value={cssVars} label="ramp CSS variables" display="Copy ramp as CSS variables" />
      </div>
      <p className="max-w-2xl text-[13px] leading-6 text-neutral-600 dark:text-neutral-400">
        How it is built: the hue stays fixed at {Math.round(hue)} degrees. Lightness walks a fixed curve from 97.5 percent at step 50 down to 23 percent at step 950, with step 600 equal to the base accent. Chroma, the amount of color, rises toward the middle of the ramp and fades at both ends, then shrinks any step that would fall outside the sRGB screen range. Hex values are approximate sRGB conversions.
      </p>
    </div>
  )
}
