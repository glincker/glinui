"use client"

import * as React from "react"
import { ArrowRight, ChartLineUp, Gauge, Lightning, Lock, ShieldCheck, Stack } from "@phosphor-icons/react/dist/ssr"

import {
  FeatureGrid,
  type FeatureItem,
  GridPattern,
  HeroSection,
  LogoCloud,
  LogoWordmark,
  PricingSection,
  type PricingTier
} from "@glinui/ui"

/** Generated wordmarks only. No real brand marks. */
const names = ["Acme", "Nimbus", "Parallax", "Fernwood", "Quill", "Loomwork", "Halcyon", "Tidepool"]
const items = names.map((name) => ({ name, logo: <LogoWordmark>{name}</LogoWordmark> }))

function Console() {
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--surface-1)] [box-shadow:var(--elev-2)]"
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--color-border)] px-4 py-3">
        <span className="size-2.5 rounded-full bg-[var(--color-signal-live)]" />
        <span className="size-2.5 rounded-full bg-[var(--color-signal-ok)]" />
        <span className="size-2.5 rounded-full bg-[var(--color-border)]" />
      </div>
      <div className="grid gap-3 p-5 [background:radial-gradient(90%_80%_at_80%_0%,color-mix(in_oklab,var(--color-accent)_18%,transparent),transparent)]">
        {["w-[72%]", "w-[48%]", "w-[88%]", "w-[36%]"].map((w, i) => (
          <div key={i} className="h-3 rounded-full [background:color-mix(in_oklab,var(--color-foreground)_12%,transparent)]">
            <div className={`h-full rounded-full bg-[var(--color-accent)] ${w}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

const bg = <GridPattern className="size-full opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />

export function HeroDemo() {
  return (
    <HeroSection
      layout="split"
      announcement="Release 0.2 is out"
      announcementHref="#"
      title="Interfaces that feel finished on day one"
      description="Tokens, primitives and blocks that share one lighting model, so every screen you ship looks like the same product."
      primaryAction={{ label: "Get started", href: "#", icon: <Lightning aria-hidden="true" weight="fill" /> }}
      secondaryAction={{ label: "Read the docs", href: "#" }}
      media={<Console />}
      background={bg}
      logos={<LogoCloud items={items.slice(0, 6)} title="Used by small teams who care about detail" />}
    />
  )
}

export function HeroVariantsDemo() {
  return (
    <div className="grid gap-8">
      <HeroSection
        headingLevel={2}
        title="Centered with a pill"
        announcement="New"
        description="Default layout."
        primaryAction={{ label: "Start", href: "#" }}
        className="rounded-2xl border border-[var(--color-border)]"
      />
      <HeroSection
        variant="glass"
        headingLevel={2}
        layout="stacked-media"
        title="Stacked media on glass"
        description="Glass shells need a backdrop behind them."
        media={<Console />}
        className="[background-image:linear-gradient(135deg,color-mix(in_oklab,var(--color-accent)_30%,transparent),transparent)]"
      />
    </div>
  )
}

const tiers: PricingTier[] = [
  { id: "solo", name: "Solo", description: "For side projects.", price: { monthly: 12, yearly: 9 }, features: ["1 workspace", "Community support", "Basic analytics"], cta: { label: "Start free", href: "#" } },
  { id: "team", name: "Team", description: "For growing teams.", price: { monthly: 32, yearly: 26 }, features: ["Unlimited workspaces", "Priority support", "Advanced analytics", "Audit log"], cta: { label: "Start trial", href: "#" }, highlighted: true, badge: "Most popular" },
  { id: "scale", name: "Scale", description: "Security and scale.", price: "Custom", features: ["Single sign-on", "Dedicated support", "Uptime SLA"], cta: { label: "Talk to sales", href: "#" } }
]

export function PricingDemo() {
  return <PricingSection tiers={tiers} headingLevel={2} title="Simple pricing" description="Switch to yearly and keep two months." yearlyNote="Save 20%" />
}

export function PricingStatesDemo() {
  return (
    <div className="grid gap-10">
      <PricingSection tiers={tiers.slice(0, 2)} headingLevel={2} title="Yearly, euro, no shine" defaultBilling="yearly" currency="EUR" locale="de-DE" highlightEffect="none" />
      <PricingSection
        tiers={tiers}
        headingLevel={2}
        layout="table"
        title="Comparison table"
        comparison={[
          { label: "Workspaces", values: ["1", "Unlimited", "Unlimited"] },
          { label: "Audit log", values: [false, true, true] },
          { label: "Single sign-on", values: [false, false, true] }
        ]}
      />
    </div>
  )
}

export function LogoCloudDemo() {
  return <LogoCloud items={items} title="Trusted by teams at" />
}

export function LogoCloudVariantsDemo() {
  return (
    <div className="grid gap-8">
      <LogoCloud layout="marquee" items={items} title="Marquee with faded edges" />
      <LogoCloud layout="marquee" fadeEdges={false} grayscale={false} items={items} speed={25} />
      <LogoCloud items={items.slice(0, 4)} listLabel="Partners" />
    </div>
  )
}

const features: FeatureItem[] = [
  { icon: <Gauge weight="duotone" />, title: "Fast by default", description: "Server components, zero client JS for static sections.", href: "#" },
  { icon: <ShieldCheck weight="duotone" />, title: "Accessible", description: "Landmarks, focus rings and AA contrast built in." },
  { icon: <Stack weight="duotone" />, title: "Composable", description: "Every block is built from the same primitives you already use.", href: "#" },
  { icon: <ChartLineUp weight="duotone" />, title: "Measurable", description: "Hooks for analytics on every call to action." },
  { icon: <Lock weight="duotone" />, title: "Private", description: "No third party requests, no tracking pixels." },
  { icon: <ArrowRight weight="duotone" className="rtl:-scale-x-100" />, title: "Easy to leave", description: "Plain React and Tailwind. Copy the file and own it." }
]

export function FeatureGridDemo() {
  return <FeatureGrid features={features} headingLevel={2} eyebrow="Why Glin" title="Everything a landing page needs" description="Six reasons to stop rebuilding the same section." />
}

export function FeatureGridLayoutsDemo() {
  return (
    <div className="grid gap-4">
      <FeatureGrid layout="bento" headingLevel={2} title="Bento" features={features.slice(0, 5)} />
      <FeatureGrid layout="icon-list" headingLevel={2} title="Icon list" features={features.slice(0, 4)} />
      <FeatureGrid layout="alternating-rows" headingLevel={2} title="Alternating rows" features={features.slice(0, 2)} />
    </div>
  )
}

export function HeroLayoutDemo() {
  return (
    <div className="grid gap-10">
      <HeroDemo />
      <FeatureGridDemo />
    </div>
  )
}
