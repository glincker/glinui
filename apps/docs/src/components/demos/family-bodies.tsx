"use client"

// Composed card contents shared by the card and effect family demos (card, spotlight-card, depth-card,
// magic-card, neon-gradient-card, glow-border, ...). Built only from Glin components and Phosphor icons.

import * as React from "react"
import { ArrowRight, Check, ChartLineUp, Lightning, ShieldCheck, Sparkle, TrendUp } from "@phosphor-icons/react/dist/ssr"
import { Avatar, Badge, Button, Heading, IconFrame, Text, cn } from "@glinui/ui"

import { BrandIcon } from "@/components/brand/brand-icon"

const FEATURES = ["Unlimited projects", "Priority support", "Audit log export"] as const

export function PricingBody({ plan = "Pro", price = "$24", className }: { plan?: string; price?: string; className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <Badge tone="accent" variant="soft">{plan}</Badge>
        <Text as="span" size="sm" variant="muted">Billed monthly</Text>
      </div>
      <p className="flex items-baseline gap-1">
        <span className="text-4xl font-semibold tabular-nums tracking-tight text-[var(--color-foreground)]">{price}</span>
        <span className="text-sm text-[var(--color-muted)]">/ seat</span>
      </p>
      <ul className="flex flex-col gap-2 text-sm text-[var(--color-foreground)]">
        {FEATURES.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <Check aria-hidden weight="bold" className="size-4 shrink-0 text-[var(--tone-success-text)]" />
            {item}
          </li>
        ))}
      </ul>
      <Button className="w-full">Start free trial</Button>
    </div>
  )
}

export function ProfileBody({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <Avatar fallback="MK" size="lg" status="online" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">Maya Kovacs</p>
          <p className="truncate text-xs text-[var(--color-muted)]">Staff designer, Platform</p>
        </div>
      </div>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          ["Projects", "48"],
          ["Reviews", "1.2k"],
          ["Streak", "36d"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[var(--surface-2)] px-2 py-2">
            <dd className="text-sm font-semibold tabular-nums text-[var(--color-foreground)]">{value}</dd>
            <dt className="text-[11px] text-[var(--color-muted)]">{label}</dt>
          </div>
        ))}
      </dl>
      <Button size="sm" className="w-full">Follow</Button>
    </div>
  )
}

const BARS = ["h-[30%]", "h-[46%]", "h-[38%]", "h-[62%]", "h-[54%]", "h-[78%]", "h-[70%]", "h-[92%]"] as const

export function MetricsBody({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex items-center justify-between">
        <Text as="span" size="sm" variant="muted">Weekly revenue</Text>
        <Badge tone="success" variant="soft"><TrendUp aria-hidden weight="bold" className="size-3" />12.4%</Badge>
      </div>
      <p className="text-3xl font-semibold tabular-nums tracking-tight text-[var(--color-foreground)]">$48,210</p>
      <div className="flex h-16 items-end gap-1.5" role="img" aria-label="Revenue rising over eight days">
        {BARS.map((height, index) => (
          <div
            key={height}
            className={cn("flex-1 rounded-sm", height, index === BARS.length - 1 ? "bg-[var(--color-accent)]" : "bg-[color-mix(in_oklab,var(--color-accent)_32%,transparent)]")}
          />
        ))}
      </div>
    </div>
  )
}

export function FeatureBody({
  title = "Instant previews",
  text = "Every pull request gets a live URL in seconds.",
  icon: Icon = Lightning,
  className
}: {
  title?: string
  text?: string
  icon?: React.ElementType<{ className?: string; "aria-hidden"?: boolean }>
  className?: string
}) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <IconFrame tone="accent"><Icon aria-hidden className="size-5" /></IconFrame>
      <Heading level={3} size="sm">{title}</Heading>
      <Text size="sm" variant="muted">{text}</Text>
      <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-accent)]">
        Learn more <ArrowRight aria-hidden weight="bold" className="size-4 rtl:rotate-180" />
      </span>
    </div>
  )
}

export function IntegrationBody({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <IconFrame size="lg"><BrandIcon name="github" size="md" /></IconFrame>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-foreground)]">GitHub</p>
          <p className="truncate text-xs text-[var(--color-muted)]">Sync pull requests and checks</p>
        </div>
        <Badge tone="success" variant="soft" dot className="ms-auto">Connected</Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
        <BrandIcon name="vercel" size="sm" /><BrandIcon name="cloudflare" size="sm" /><BrandIcon name="npm" size="sm" />
        <span>+3 deploy targets</span>
      </div>
      <Button size="sm" variant="outline" className="w-full">Manage</Button>
    </div>
  )
}

export function SecurityBody({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <IconFrame tone="success"><ShieldCheck aria-hidden className="size-5" /></IconFrame>
      <Heading level={3} size="sm">Signed and audited</Heading>
      <Text size="sm" variant="muted">SOC 2 Type II, SSO and scoped tokens on every plan.</Text>
    </div>
  )
}

export function LoginBody({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <div className="flex items-center gap-2">
        <IconFrame size="sm" tone="accent"><Sparkle aria-hidden className="size-4" /></IconFrame>
        <Heading level={3} size="sm">Welcome back</Heading>
      </div>
      <label className="flex flex-col gap-1.5 text-xs font-medium text-[var(--color-muted)]">
        Email
        <input
          type="email"
          placeholder="you@company.com"
          className="h-9 rounded-md border border-[var(--color-border)] bg-[var(--surface-0)] px-3 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        />
      </label>
      <Button className="w-full">Continue</Button>
    </div>
  )
}

export { ChartLineUp }
