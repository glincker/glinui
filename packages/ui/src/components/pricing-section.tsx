"use client"

import * as React from "react"
import { Check, Minus } from "@phosphor-icons/react/dist/ssr"

import { cn } from "../lib/cn"
import { blockShellVariants, resolveBlockLook, type BlockLook } from "../lib/block-shell"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card } from "./card"
import { useGlinStyle } from "./glin-provider"
import { Heading } from "./heading"
import { ShineBorder } from "./shine-border"
import { Switch } from "./switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { Text } from "./text"

export type BillingPeriod = "monthly" | "yearly"

export interface PricingTier {
  id: string
  name: string
  description?: React.ReactNode
  /** Per month price for each period, or a fixed label such as "Custom". */
  price: { monthly: number; yearly: number } | string
  /** Text after the price. Default "/ month". */
  period?: string
  features: string[]
  cta: { label: string; href?: string; onClick?: React.MouseEventHandler<HTMLElement> }
  highlighted?: boolean
  /** Pill on the highlighted card, for example "Most popular". */
  badge?: string
}

export interface PricingComparisonRow {
  label: string
  /** One value per tier, in order. `true` and `false` render check and dash. */
  values: Array<boolean | string>
}

export interface PricingSectionProps extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "onChange"> {
  tiers: PricingTier[]
  /** `cards` shows tier cards, `table` a comparison table built from `comparison`. */
  layout?: "cards" | "table"
  comparison?: PricingComparisonRow[]
  variant?: BlockLook | "default" | null
  title?: React.ReactNode
  description?: React.ReactNode
  /** Controlled billing period. */
  billing?: BillingPeriod
  /** Initial billing period when uncontrolled. Default `monthly`. */
  defaultBilling?: BillingPeriod
  onBillingChange?: (billing: BillingPeriod) => void
  /** Hide the toggle (single period). */
  hideToggle?: boolean
  /** ISO 4217 code for `Intl.NumberFormat`. Default USD. */
  currency?: string
  /** BCP 47 locale for formatting. Default is the runtime locale. */
  locale?: string
  /** Edge effect on the highlighted card. Default `shine`. */
  highlightEffect?: "shine" | "none"
  /** Text on the yearly side of the toggle, for example "Save 20%". */
  yearlyNote?: string
  headingLevel?: 2 | 3
}

function CtaButton({ tier }: { tier: PricingTier }) {
  const props = { size: "lg" as const, className: "w-full", tone: tier.highlighted ? ("accent" as const) : undefined, variant: tier.highlighted ? ("solid" as const) : ("outline" as const) }
  return tier.cta.href ? (
    <Button asChild {...props}>
      <a href={tier.cta.href} onClick={tier.cta.onClick}>{tier.cta.label}</a>
    </Button>
  ) : (
    <Button type="button" {...props} onClick={tier.cta.onClick}>{tier.cta.label}</Button>
  )
}

/**
 * Pricing block. Tier cards with a monthly or yearly switch (controlled or uncontrolled), a highlighted tier,
 * check lists, formatted currency, and a `table` comparison layout. The price is announced politely on toggle.
 */
export const PricingSection = React.forwardRef<HTMLElement, PricingSectionProps>(
  (
    {
      className, tiers, layout = "cards", comparison, variant, title, description, billing, defaultBilling = "monthly",
      onBillingChange, hideToggle = false, currency = "USD", locale, highlightEffect = "shine", yearlyNote,
      headingLevel = 2, "aria-labelledby": labelledBy, ...props
    },
    ref
  ) => {
    const look = resolveBlockLook(variant, useGlinStyle())
    const reactId = React.useId()
    const titleId = labelledBy ?? (title ? `pricing-${reactId}` : undefined)
    const [inner, setInner] = React.useState<BillingPeriod>(defaultBilling)
    const period = billing ?? inner
    const setPeriod = (yearly: boolean) => {
      const next: BillingPeriod = yearly ? "yearly" : "monthly"
      if (billing === undefined) setInner(next)
      onBillingChange?.(next)
    }
    const fmt = React.useMemo(
      () => new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 0 }),
      [locale, currency]
    )
    const priceOf = (t: PricingTier) => (typeof t.price === "string" ? t.price : fmt.format(t.price[period]))
    const tierLevel = (headingLevel + 1) as 3 | 4

    const toggle = hideToggle ? null : (
      <div className="flex items-center justify-center gap-3" data-slot="pricing-toggle">
        <Text as="span" size="sm" variant={period === "monthly" ? "default" : "muted"}>Monthly</Text>
        <Switch aria-label="Bill yearly" checked={period === "yearly"} onCheckedChange={setPeriod} />
        <Text as="span" size="sm" variant={period === "yearly" ? "default" : "muted"}>Yearly</Text>
        {yearlyNote ? <Badge variant="soft" tone="success" size="sm">{yearlyNote}</Badge> : null}
      </div>
    )

    const cards = (
      <ul className={cn("mx-auto grid max-w-6xl items-stretch gap-4", tiers.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2 lg:max-w-4xl", "sm:grid-cols-2")}>
        {tiers.map((tier) => (
          <li key={tier.id} className="flex">
            <Card
              data-slot="pricing-tier"
              data-highlighted={tier.highlighted ? "true" : undefined}
              className={cn("relative flex w-full flex-col gap-6", tier.highlighted && "[--ring-img:var(--ring-hot,var(--ring))]")}
            >
              {tier.highlighted && highlightEffect === "shine" ? <ShineBorder borderWidth={2} duration={8} /> : null}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <Heading level={tierLevel} size="sm">{tier.name}</Heading>
                  {tier.badge && tier.highlighted ? <Badge variant="soft" tone="accent" size="sm">{tier.badge}</Badge> : null}
                </div>
                {tier.description ? <Text variant="muted" size="sm">{tier.description}</Text> : null}
              </div>
              <p className="flex items-baseline gap-1.5" aria-live="polite" aria-atomic="true">
                <span data-slot="price" className="text-4xl font-semibold tracking-tight tabular-nums">{priceOf(tier)}</span>
                {typeof tier.price !== "string" ? (
                  <span className="text-sm text-[var(--color-muted)]">{tier.period ?? "/ month"}</span>
                ) : null}
              </p>
              <CtaButton tier={tier} />
              <ul className="flex flex-col gap-2.5" aria-label={`${tier.name} features`}>
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check aria-hidden="true" weight="bold" className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </li>
        ))}
      </ul>
    )

    const table = (
      <div className="mx-auto max-w-5xl overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead scope="col"><span className="sr-only">Feature</span></TableHead>
              {tiers.map((t) => (
                <TableHead key={t.id} scope="col">
                  <span className="block">{t.name}</span>
                  <span className="block text-base tabular-nums" aria-live="polite">{priceOf(t)}</span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(comparison ?? []).map((row) => (
              <TableRow key={row.label}>
                <TableHead scope="row">{row.label}</TableHead>
                {row.values.map((v, i) => (
                  <TableCell key={i}>
                    {v === true ? (
                      <><Check aria-hidden="true" weight="bold" className="size-4 text-[var(--color-accent)]" /><span className="sr-only">Included</span></>
                    ) : v === false ? (
                      <><Minus aria-hidden="true" className="size-4 text-[var(--color-muted)]" /><span className="sr-only">Not included</span></>
                    ) : (
                      v
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow>
              <TableCell />
              {tiers.map((t) => <TableCell key={t.id}><CtaButton tier={t} /></TableCell>)}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )

    return (
      <section
        ref={ref}
        data-slot="pricing-section"
        data-layout={layout}
        data-billing={period}
        aria-labelledby={titleId}
        className={cn(blockShellVariants({ look }), className)}
        {...props}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-4 text-center">
            {title ? <Heading id={titleId} level={headingLevel} size="lg" className="text-balance">{title}</Heading> : null}
            {description ? <Text variant="muted" size="lg" className="text-pretty">{description}</Text> : null}
            {toggle}
          </div>
          {layout === "table" ? table : cards}
        </div>
      </section>
    )
  }
)

PricingSection.displayName = "PricingSection"
