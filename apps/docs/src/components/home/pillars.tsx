import Link from "next/link"
import { ArrowUpRight, Cube, MagicWand, PaintBrush, Sparkle } from "@phosphor-icons/react/dist/ssr"

import { allComponentIds } from "@/lib/primitives"

import { SECTION_CLASS, SectionHeading, Surface } from "./surface"

function ComponentsVisual() {
  return (
    <div className="grid gap-3 rounded-xl bg-[var(--surface-2)] p-4 ring-1 ring-inset ring-[var(--line-soft)] sm:grid-cols-[auto_1fr]" aria-hidden="true">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 items-center rounded-lg bg-[var(--color-accent)] px-4 text-xs font-semibold text-[var(--color-accent-foreground)] [box-shadow:var(--elev-1)]">Button</span>
        <span className="relative h-6 w-10 rounded-full bg-[var(--color-accent)]">
          <span className="absolute right-0.5 top-0.5 size-5 rounded-full bg-white [box-shadow:var(--elev-1)]" />
        </span>
        <span className="rounded-full bg-[var(--surface-3)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-foreground)]">Chip</span>
      </div>
      <div className="flex flex-col justify-center gap-2">
        <span className="h-2 overflow-hidden rounded-full bg-[var(--surface-3)]">
          <span className="block h-full w-2/3 rounded-full bg-[var(--color-accent)]" />
        </span>
        <span className="h-9 rounded-lg bg-[var(--surface-1)] px-3 text-xs leading-9 text-[var(--color-subtle)] ring-1 ring-inset ring-[var(--line-soft)]">Search components</span>
      </div>
    </div>
  )
}

const MOTION_CHIPS = ["Marquee", "Border beam", "Blur fade", "Number ticker", "Meteors", "Orbit"]

function MotionRow({ reverse }: { reverse?: boolean }) {
  const dir = reverse ? "[animation-direction:reverse]" : ""
  return (
    <div className="flex gap-2 [--marquee-duration:18s] [--marquee-gap:8px]">
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          className={`flex shrink-0 gap-2 motion-safe:animate-marquee-x ${dir}`}
        >
          {MOTION_CHIPS.map((chip) => (
            <li key={chip} className="whitespace-nowrap rounded-full bg-[var(--surface-1)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)] ring-1 ring-inset ring-[var(--line-soft)]">
              {chip}
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

function MotionVisual() {
  return (
    <div
      className="relative flex flex-col gap-2 overflow-hidden rounded-xl bg-[var(--surface-2)] py-4 ring-1 ring-inset ring-[var(--line-soft)] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
      aria-hidden="true"
    >
      <MotionRow />
      <MotionRow reverse />
      <span className="mx-4 mt-1 flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
        <span className="size-2 rounded-full bg-[var(--color-signal-ok)] motion-safe:animate-pulse" />
        Transform and opacity only
      </span>
    </div>
  )
}

const RAMP = [
  "bg-[oklch(0.95_0.04_289)]",
  "bg-[oklch(0.86_0.09_289)]",
  "bg-[oklch(0.76_0.14_289)]",
  "bg-[oklch(0.66_0.19_289)]",
  "bg-[oklch(0.55_0.2_289)]",
  "bg-[oklch(0.45_0.16_289)]",
  "bg-[oklch(0.35_0.1_289)]"
]

function ColorVisual() {
  return (
    <div className="flex overflow-hidden rounded-lg [box-shadow:var(--elev-1)]" aria-hidden="true">
      {RAMP.map((tone) => (
        <span key={tone} className={`h-[3.25rem] flex-1 ${tone}`} />
      ))}
    </div>
  )
}

function PromptVisual() {
  return (
    <div
      className="rounded-lg bg-[var(--surface-well)] px-3 py-2.5 font-mono text-[11px] leading-relaxed text-[var(--color-muted)] [box-shadow:var(--elev-inset)]"
      aria-hidden="true"
    >
      <span className="text-[var(--color-accent)]">Use the GLINUI</span> Button
      <br />
      component in my project...
      <span className="ml-0.5 inline-block h-3 w-1.5 translate-y-0.5 bg-[var(--color-accent)]" />
    </div>
  )
}

export function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className={SECTION_CLASS}>
      <SectionHeading
        id="pillars-title"
        eyebrow="What is inside"
        title="Four tools for the same job: shipping a coherent interface."
      />

      <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-12">
        <Surface className="flex flex-col justify-between gap-8 p-6 lg:col-span-7 lg:p-8">
          <div className="space-y-3">
            <Cube className="size-6 text-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="type-h3 text-2xl">{allComponentIds.length} components, accessible by default</h3>
            <p className="max-w-md text-[var(--color-muted)]">
              Built on Radix primitives with keyboard support, focus rings and AA contrast. Copy the source or install
              the package.
            </p>
          </div>
          <ComponentsVisual />
          <Link href="/docs/components" className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-medium text-[var(--color-foreground)] underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]">
            Browse components <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Surface>

        <Surface className="flex flex-col justify-between gap-6 p-6 lg:col-span-5 lg:p-8">
          <div className="space-y-3">
            <MagicWand className="size-6 text-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="type-h3">Animations you can use for free</h3>
            <p className="text-[var(--color-muted)]">Marquees, beams, reveals and tickers. Transform and opacity only, reduced motion respected.</p>
          </div>
          <MotionVisual />
          <Link href="/docs/animations" className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-medium underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]">
            Explore animations <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Surface>

        <Surface className="flex flex-col justify-between gap-6 p-6 lg:col-span-5 lg:p-8">
          <div className="space-y-3">
            <PaintBrush className="size-6 text-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="type-h3">Colors and tokens in OKLCH</h3>
            <p className="text-[var(--color-muted)]">One source for light and dark. Surfaces, rings, elevation and type as CSS variables.</p>
          </div>
          <ColorVisual />
          <Link href="/docs/colors" className="inline-flex min-h-11 w-fit items-center gap-1 text-sm font-medium underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)]">
            Explore colors <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </Surface>

        <Surface className="flex flex-col justify-between gap-6 p-6 lg:col-span-7 lg:p-8">
          <div className="space-y-3">
            <Sparkle className="size-6 text-[var(--color-accent)]" aria-hidden="true" />
            <h3 className="type-h3">Copy for AI on every component</h3>
            <p className="max-w-md text-[var(--color-muted)]">
              Each page ships a ready prompt with install steps, a working example and our token rules, so your
              assistant stays on-system.
            </p>
          </div>
          <PromptVisual />
        </Surface>
      </div>
    </section>
  )
}
