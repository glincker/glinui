import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { SECTION_CLASS, SectionHeading, Surface } from "./surface"
import { TokenSwatches } from "./token-swatches"

const TYPE = [
  { token: "display", cls: "type-display leading-none", sample: "Aa" },
  { token: "h2", cls: "type-h2 leading-none", sample: "Heading" },
  { token: "lead", cls: "text-[length:var(--text-lead)] leading-snug", sample: "Lead paragraph" },
  { token: "body", cls: "text-[length:var(--text-body)]", sample: "Body copy for reading" },
  { token: "caption", cls: "text-[length:var(--text-caption)] font-mono", sample: "caption 12px" }
]

const RADII = [
  { token: "sm", cls: "rounded-[var(--radius-sm)]" },
  { token: "md", cls: "rounded-[var(--radius-md)]" },
  { token: "lg", cls: "rounded-[var(--radius-lg)]" },
  { token: "xl", cls: "rounded-[var(--radius-xl)]" }
]

const ELEVATIONS = [
  { token: "elev-1", cls: "[box-shadow:var(--elev-1)]" },
  { token: "elev-2", cls: "[box-shadow:var(--elev-2)]" },
  { token: "elev-3", cls: "[box-shadow:var(--elev-3)]" }
]

function Label({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[11px] tabular-nums text-[var(--color-muted)]">{children}</span>
}

export function TokensSection() {
  return (
    <section aria-labelledby="tokens-title" className={SECTION_CLASS}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          id="tokens-title"
          eyebrow="Design tokens"
          title="A system you can read in one glance."
          lead="Every swatch below is a live CSS variable. Flip the theme and they follow."
        />
        <div className="flex shrink-0 gap-5 text-sm font-medium">
          {[
            { href: "/docs/tokens", label: "Token docs" },
            { href: "/docs/colors", label: "Colors" }
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
            >
              {link.label} <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
        <TokenSwatches />

        <Surface className="p-6 lg:col-span-7">
          <p className="mb-5 type-eyebrow">Type scale</p>
          <ul className="divide-y divide-[var(--line-soft)]">
            {TYPE.map((row) => (
              <li key={row.token} className="flex items-baseline justify-between gap-4 py-3">
                <span className={`min-w-0 truncate text-[var(--color-foreground)] ${row.cls}`}>{row.sample}</span>
                <Label>{row.token}</Label>
              </li>
            ))}
          </ul>
        </Surface>

        <div className="grid gap-4 lg:col-span-5">
          <Surface className="p-6">
            <p className="mb-4 type-eyebrow">Radius</p>
            <ul className="flex items-end gap-4">
              {RADII.map((r) => (
                <li key={r.token} className="space-y-2">
                  <span className={`block size-12 bg-[var(--surface-3)] [box-shadow:var(--elev-1)] ${r.cls}`} />
                  <Label>{r.token}</Label>
                </li>
              ))}
            </ul>
          </Surface>
          <Surface className="bg-[var(--surface-0)] p-6">
            <p className="mb-4 type-eyebrow">Elevation</p>
            <ul className="flex items-end gap-4">
              {ELEVATIONS.map((e) => (
                <li key={e.token} className="space-y-2">
                  <span className={`block h-12 w-16 rounded-lg bg-[var(--surface-1)] ${e.cls}`} />
                  <Label>{e.token}</Label>
                </li>
              ))}
            </ul>
          </Surface>
        </div>
      </div>
    </section>
  )
}
