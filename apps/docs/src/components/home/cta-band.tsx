import Link from "next/link"
import { ArrowRight, GithubLogo } from "@phosphor-icons/react/dist/ssr"

import { Surface } from "./surface"

export function CtaBand() {
  return (
    <section aria-labelledby="cta-title" className="mx-auto w-full max-w-[1200px] pb-[clamp(48px,7vw,88px)]">
      <Surface elevation={3} className="isolate overflow-hidden px-6 py-16 text-center sm:px-12 sm:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,color-mix(in_oklab,var(--color-accent)_24%,transparent),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle,var(--line-soft)_1px,transparent_1.4px)] bg-[length:18px_18px] [mask-image:radial-gradient(ellipse_at_top,#000,transparent_75%)]"
        />
        <h2
          id="cta-title"
          className="mx-auto max-w-2xl type-h2"
        >
          Start with one component. Keep the whole system.
        </h2>
        <p className="mx-auto type-lead mt-4">
          Open source, MIT licensed, and ready for your next build.
        </p>
        <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            href="/docs/components"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-6 text-[15px] font-semibold text-[var(--color-accent-foreground)] [box-shadow:var(--elev-2)] transition-[transform,filter] duration-150 ease-[var(--ease-out)] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Browse components <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="https://github.com/GLINCKER/glinui"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--surface-2)] px-6 text-[15px] font-semibold text-[var(--color-foreground)] [box-shadow:var(--elev-1)] transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[var(--surface-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <GithubLogo className="size-4" weight="fill" aria-hidden="true" />
            Star on GitHub
          </Link>
        </div>
      </Surface>
    </section>
  )
}
