"use client"

// Showcase demos for OrbitingCircles and AnimatedGradient: an integrations section and a pricing row.
// The orbit uses docs-only BrandIcon marks; the copyable code uses plain images where the marks are.

import * as React from "react"
import { Check } from "@phosphor-icons/react"
import { AnimatedGradient, Badge, Button, Heading, OrbitingCircles, Text } from "@glinui/ui"

import { BrandIcon } from "@/components/brand/brand-icon"
import type { BrandName } from "@/components/brand/brands"
import type { ComponentExample } from "@/lib/component-docs"

const SECTION = "relative isolate flex w-full flex-col items-center gap-8 overflow-hidden rounded-xl bg-[var(--surface-0)] px-6 py-10 md:flex-row md:justify-between md:px-12"
const ORBIT = "relative flex h-[22rem] w-full max-w-sm items-center justify-center"
const CHIP = "flex size-9 items-center justify-center rounded-full bg-[var(--surface-2)]"

const INNER: Array<{ name: BrandName; label: string }> = [
  { name: "github", label: "GitHub" },
  { name: "vercel", label: "Vercel" },
  { name: "cloudflare", label: "Cloudflare" }
]
const OUTER: Array<{ name: BrandName; label: string }> = [
  { name: "react", label: "React" },
  { name: "typescript", label: "TypeScript" },
  { name: "tailwindcss", label: "Tailwind CSS" },
  { name: "astro", label: "Astro" }
]

function OrbitHero() {
  return (
    <section data-glin-theme="dark" aria-label="Integrations" className={SECTION}>
      <div className="relative z-10 flex max-w-md flex-col gap-4 text-left">
        <Badge tone="accent" variant="soft" className="self-start">40+ integrations</Badge>
        <Heading level={2} size="h2">Plugs into the tools you already run</Heading>
        <Text variant="muted">Connect your repository, hosting and framework once. Deploy hooks, status checks and preview comments appear where your team already works.</Text>
        <div className="flex flex-wrap gap-3"><Button>Browse integrations</Button><Button variant="outline">Request one</Button></div>
      </div>
      <div className={ORBIT}>
        <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-accent-foreground)]">N</span>
        {INNER.map((item, index) => (
          <OrbitingCircles key={item.name} radius={90} duration={24} delay={index * 8} path={index === 0}>
            <span role="img" aria-label={item.label} className={CHIP}><BrandIcon name={item.name} size={20} variant="mono" /></span>
          </OrbitingCircles>
        ))}
        {OUTER.map((item, index) => (
          <OrbitingCircles key={item.name} radius={150} duration={36} delay={index * 9} reverse path={index === 0}>
            <span role="img" aria-label={item.label} className={CHIP}><BrandIcon name={item.name} size={20} variant="mono" /></span>
          </OrbitingCircles>
        ))}
      </div>
    </section>
  )
}

const orbitHeroCode = `import { Badge, Button, Heading, OrbitingCircles, Text } from "@glinui/ui"

const inner = ["github", "vercel", "cloudflare"]
const outer = ["react", "typescript", "tailwind", "astro"]

// Replace /logos/<name>.svg with your own marks.
const Logo = ({ name }: { name: string }) => (
  <span className="${CHIP}"><img src={\`/logos/\${name}.svg\`} alt={name} className="size-5" /></span>
)

export function Integrations() {
  return (
    <section data-glin-theme="dark" className="${SECTION}">
      <div className="relative z-10 flex max-w-md flex-col gap-4 text-left">
        <Badge tone="accent" variant="soft" className="self-start">40+ integrations</Badge>
        <Heading level={2} size="h2">Plugs into the tools you already run</Heading>
        <Text variant="muted">Connect your repository, hosting and framework once. Deploy hooks, status checks and preview comments appear where your team already works.</Text>
        <div className="flex flex-wrap gap-3"><Button>Browse integrations</Button><Button variant="outline">Request one</Button></div>
      </div>
      <div className="${ORBIT}">
        <span className="relative z-10 flex size-14 items-center justify-center rounded-2xl bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-accent-foreground)]">N</span>
        {inner.map((name, index) => (
          <OrbitingCircles key={name} radius={90} duration={24} delay={index * 8} path={index === 0}>
            <Logo name={name} />
          </OrbitingCircles>
        ))}
        {outer.map((name, index) => (
          <OrbitingCircles key={name} radius={150} duration={36} delay={index * 9} reverse path={index === 0}>
            <Logo name={name} />
          </OrbitingCircles>
        ))}
      </div>
    </section>
  )
}`

const PLANS = [
  { name: "Starter", price: "$0", note: "For side projects", items: ["3 projects", "Community support"], featured: false },
  { name: "Pro", price: "$24", note: "For growing teams", items: ["Unlimited projects", "Priority support", "Audit log export"], featured: true },
  { name: "Scale", price: "$99", note: "For large orgs", items: ["SSO and SCIM", "99.99% uptime SLA"], featured: false }
]

const PLAN_CARD = "flex flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left"

function PricingRow() {
  return (
    <section aria-label="Pricing" className="grid w-full gap-4 md:grid-cols-3">
      {PLANS.map((plan) => {
        const body = (
          <>
            <div className="flex items-center justify-between">
              <Heading level={3} size="sm">{plan.name}</Heading>
              {plan.featured ? <Badge tone="accent" variant="solid">Most popular</Badge> : null}
            </div>
            <p className="flex items-baseline gap-1"><span className="text-4xl font-semibold tabular-nums text-[var(--color-foreground)]">{plan.price}</span><span className="text-sm text-[var(--color-muted)]">/ seat</span></p>
            <Text size="sm" variant="muted">{plan.note}</Text>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-foreground)]">
              {plan.items.map((item) => (
                <li key={item} className="flex items-center gap-2"><Check aria-hidden weight="bold" className="size-4 shrink-0" />{item}</li>
              ))}
            </ul>
            <Button variant={plan.featured ? "solid" : "outline"} className="mt-auto w-full">{plan.featured ? "Start free trial" : "Choose plan"}</Button>
          </>
        )
        return plan.featured ? (
          <AnimatedGradient key={plan.name} variant="aurora" data-glin-theme="dark" className={`${PLAN_CARD} border-transparent`}>{body}</AnimatedGradient>
        ) : (
          <div key={plan.name} className={PLAN_CARD}>{body}</div>
        )
      })}
    </section>
  )
}

const pricingRowCode = `import { Check } from "@phosphor-icons/react"
import { AnimatedGradient, Badge, Button, Heading, Text } from "@glinui/ui"

const plans = [
  { name: "Starter", price: "$0", note: "For side projects", items: ["3 projects", "Community support"], featured: false },
  { name: "Pro", price: "$24", note: "For growing teams", items: ["Unlimited projects", "Priority support", "Audit log export"], featured: true },
  { name: "Scale", price: "$99", note: "For large orgs", items: ["SSO and SCIM", "99.99% uptime SLA"], featured: false }
]

const card = "${PLAN_CARD}"

export function Pricing() {
  return (
    <section aria-label="Pricing" className="grid w-full gap-4 md:grid-cols-3">
      {plans.map((plan) => {
        const body = (
          <>
            <div className="flex items-center justify-between">
              <Heading level={3} size="sm">{plan.name}</Heading>
              {plan.featured ? <Badge tone="accent" variant="solid">Most popular</Badge> : null}
            </div>
            <p className="flex items-baseline gap-1"><span className="text-4xl font-semibold tabular-nums text-[var(--color-foreground)]">{plan.price}</span><span className="text-sm text-[var(--color-muted)]">/ seat</span></p>
            <Text size="sm" variant="muted">{plan.note}</Text>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-foreground)]">
              {plan.items.map((item) => (
                <li key={item} className="flex items-center gap-2"><Check aria-hidden weight="bold" className="size-4 shrink-0" />{item}</li>
              ))}
            </ul>
            <Button variant={plan.featured ? "solid" : "outline"} className="mt-auto w-full">{plan.featured ? "Start free trial" : "Choose plan"}</Button>
          </>
        )
        return plan.featured ? (
          <AnimatedGradient key={plan.name} variant="aurora" data-glin-theme="dark" className={\`\${card} border-transparent\`}>{body}</AnimatedGradient>
        ) : (
          <div key={plan.name} className={card}>{body}</div>
        )
      })}
    </section>
  )
}`

const BANNER = "flex w-full flex-col items-start justify-between gap-4 rounded-2xl p-6 text-left sm:flex-row sm:items-center"

function BannerHero() {
  return (
    <AnimatedGradient data-glin-theme="dark" variant="cool" className={BANNER}>
      <div className="flex flex-col gap-1">
        <Heading level={2} size="md">Your trial ends in 3 days</Heading>
        <Text variant="muted" className="text-[var(--color-foreground)]">Keep your projects, history and team seats by picking a plan today.</Text>
      </div>
      <div className="flex shrink-0 gap-3"><Button variant="solid">Choose a plan</Button><Button variant="outline">Remind me later</Button></div>
    </AnimatedGradient>
  )
}

const bannerHeroCode = `import { AnimatedGradient, Button, Heading, Text } from "@glinui/ui"

export function TrialBanner() {
  return (
    <AnimatedGradient data-glin-theme="dark" variant="cool" className="${BANNER}">
      <div className="flex flex-col gap-1">
        <Heading level={2} size="md">Your trial ends in 3 days</Heading>
        <Text variant="muted" className="text-[var(--color-foreground)]">Keep your projects, history and team seats by picking a plan today.</Text>
      </div>
      <div className="flex shrink-0 gap-3"><Button variant="solid">Choose a plan</Button><Button variant="outline">Remind me later</Button></div>
    </AnimatedGradient>
  )
}`

const ex = (title: string, description: string, code: string, render: React.ReactNode): ComponentExample => ({ title, description, code, render })

export const bgExtraExamples: Record<string, ComponentExample[]> = {
  "orbiting-circles": [ex("Integrations section", "Two counter-rotating rings of tool marks around a product mark. The logos are docs-only BrandIcon marks; the copyable code uses plain images.", orbitHeroCode, <OrbitHero />)],
  "animated-gradient": [
    ex("Trial banner", "The cool variant behind a headline and two actions. The section opts into the dark token scope so the text stays readable.", bannerHeroCode, <BannerHero />),
    ex("Pricing row", "The aurora variant highlights the recommended plan while the other cards stay on solid surfaces.", pricingRowCode, <PricingRow />)
  ]
}

export const extraCode = (id: string, index: number): string => bgExtraExamples[id][index].code
export const extraRender = (id: string, index: number): React.ReactNode => bgExtraExamples[id][index].render
