import Link from "next/link"
import { ArrowRight, GithubLogo } from "@phosphor-icons/react/dist/ssr"

import { HeroInstall } from "./hero-install"
import { HeroShowcase } from "./hero-showcase"
import { BROWSE_CTA, COMPONENT_COUNT, HERO_SUBHEAD, PRIMARY_CTA, REPO_HREF, TRUST_LINE } from "./landing-facts"
import { Eyebrow } from "./surface"

const CTA_PRIMARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-accent-foreground)] [box-shadow:var(--elev-2)] transition-[transform,filter] duration-150 ease-[var(--ease-out)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] active:scale-[0.97] active:brightness-95 active:[box-shadow:var(--elev-1)] motion-reduce:transition-none motion-reduce:active:scale-100"

const CTA_SECONDARY =
  "inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] px-5 text-[15px] font-semibold text-[var(--color-foreground)] [box-shadow:var(--elev-1)] transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"

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
          <Eyebrow>{COMPONENT_COUNT} components, MIT licensed</Eyebrow>
          <div className="space-y-5">
            <h1 className="type-display max-w-[13ch] text-[var(--color-foreground)] sm:max-w-[14ch]">
              Design modern UI for the modern web.
            </h1>
            <p className="type-lead">{HERO_SUBHEAD}</p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href={PRIMARY_CTA.href} className={`${CTA_PRIMARY} w-full sm:w-auto`}>
                {PRIMARY_CTA.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href={BROWSE_CTA.href} className={`${CTA_SECONDARY} w-full sm:w-auto`}>
                {BROWSE_CTA.label}
              </Link>
              <a href={REPO_HREF} target="_blank" rel="noreferrer" className={`${CTA_SECONDARY} w-full sm:w-auto`}>
                <GithubLogo className="size-4" weight="fill" aria-hidden="true" />
                GitHub
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <HeroInstall />
            <p className="type-caption">{TRUST_LINE}</p>
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
