import Link from "next/link"
import { ArrowRight } from "@phosphor-icons/react/dist/ssr"

import { SECTION_CLASS, SectionHeading, Surface } from "./surface"

const STEPS = [
  { n: "1", title: "Install", code: "npx glinui init", text: "Sets up tokens and the config in your project." },
  { n: "2", title: "Add", code: "npx glinui add button", text: "Copies the component source into your repo." },
  { n: "3", title: "Customize", code: 'variant="plain" tone="accent"', text: "Change props or tokens. The code is yours." }
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" className={SECTION_CLASS}>
      <SectionHeading id="how-title" eyebrow="How it works" title="From empty project to shipped component in three steps." />
      <ol className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.n}>
            <Surface elevation={1} className="h-full space-y-4 p-6">
              <span className="type-eyebrow">Step {step.n}</span>
              <h3 className="type-h3">{step.title}</h3>
              <code className="block overflow-x-auto rounded-lg bg-[var(--surface-well)] px-3 py-2.5 type-code text-[var(--color-foreground)] [box-shadow:var(--elev-inset)]">
                {step.code}
              </code>
              <p className="text-sm text-[var(--color-muted)]">{step.text}</p>
            </Surface>
          </li>
        ))}
      </ol>
      <Link
        href="/docs/getting-started"
        className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-medium underline decoration-[var(--line-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        Read the getting started guide <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </section>
  )
}
