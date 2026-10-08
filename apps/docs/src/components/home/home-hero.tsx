import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { allComponentIds } from "@/lib/primitives"

import { HeroInstall } from "./hero-install"
import { HeroShowcase } from "./hero-showcase"
import { Eyebrow } from "./surface"

const CTA_PRIMARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-accent-foreground)] [box-shadow:var(--elev-2)] transition-[transform,filter] duration-150 ease-[var(--ease-out)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:scale-[0.97] active:brightness-95 active:[box-shadow:var(--elev-1)] motion-reduce:transition-none motion-reduce:active:scale-100"

const SECONDARY = [
  { href: "/docs/animations", label: "Explore animations" },
  { href: "/docs/colors", label: "Explore colors" },
  { href: "/docs/tokens", label: "Explore tokens" }
]

export function HomeHero() {
  return (
    <section className="relative isolate mx-auto w-full max-w-[1200px] pb-[clamp(48px,7vw,88px)] pt-10 sm:pt-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-24 -z-10 h-[34rem] bg-[radial-gradient(circle,var(--line-soft)_1px,transparent_1.4px)] bg-[length:20px_20px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000,transparent)]"
      />
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:items-center">
        <div className="min-w-0 space-y-8">
          <Eyebrow>{allComponentIds.length} components, MIT licensed</Eyebrow>
          <div className="space-y-5">
            <h1 className="type-display max-w-[13ch] text-[var(--color-foreground)] sm:max-w-[14ch]">
              Design modern UI for the modern web.
            </h1>
            <p className="type-lead">
              Accessible React components, motion, OKLCH color, design tokens and AI-ready prompts in one hub. Copy the
              source, own it, and ship.
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/docs/components" className={`${CTA_PRIMARY} w-full sm:w-auto`}>
              Browse components
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <HeroInstall />
          </div>

          <nav aria-label="Explore" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="text-[var(--color-subtle)]">Also explore</span>
            {SECONDARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center rounded-md font-medium text-[var(--color-foreground)] underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 transition-colors hover:decoration-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <HeroShowcase />
      </div>
    </section>
  )
}
