"use client"

// Demos for card, alert, accordion, icon-frame and separator.

import * as React from "react"
import { Bell, ChartLineUp, Lightning, ShieldCheck, Stack } from "@phosphor-icons/react/dist/ssr"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Heading,
  IconFrame,
  SURFACE_TONES,
  SURFACE_VARIANTS,
  Separator,
  Text,
  cn
} from "@glinui/ui"
import type { SurfaceTone, SurfaceVariant } from "@glinui/ui"

import { VariantMatrix } from "@/components/variants/variant-matrix"
import { FeatureBody, MetricsBody, PricingBody, ProfileBody } from "./family-bodies"

const BACKDROP =
  "rounded-xl bg-neutral-900 p-5 bg-[radial-gradient(at_18%_20%,#ff7ab6_0,transparent_48%),radial-gradient(at_82%_28%,#5b8cff_0,transparent_50%),radial-gradient(at_50%_95%,#2ee6a6_0,transparent_55%)]"

const FOUR: SurfaceVariant[] = ["glinr", "plain", "solid", "glass"]

/* Card ------------------------------------------------------------------- */

export function CardHero() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
      <Card className="flex flex-col gap-4"><PricingBody /></Card>
      <Card className="flex flex-col gap-4"><ProfileBody /></Card>
    </div>
  )
}

export function CardVariantsMatrix() {
  return (
    <VariantMatrix
      label="Card variants"
      variants={SURFACE_VARIANTS}
      tones={["neutral", "accent", "success", "danger"] satisfies SurfaceTone[]}
      render={(variant, tone) => (
        <Card variant={variant as SurfaceVariant} tone={tone as SurfaceTone} size="sm" className="w-40">
          <CardTitle className="text-sm">{variant}</CardTitle>
          <CardDescription className="text-xs">{tone}</CardDescription>
        </Card>
      )}
    />
  )
}

export function CardHeaderWell() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader variant="strip" className="flex items-center justify-between">
        <CardTitle className="text-sm">deploy.log</CardTitle>
        <Badge tone="success" variant="soft" dot>Passing</Badge>
      </CardHeader>
      <CardContent inset className="font-mono text-[13px] leading-[1.7] text-[var(--color-foreground)]">
        <p>$ pnpm build</p>
        <p className="text-[var(--color-muted)]">compiled 128 modules in 4.2s</p>
        <p>$ pnpm deploy --prod</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Text as="span" size="sm" variant="muted">Updated 2 min ago</Text>
        <Button size="sm">Redeploy</Button>
      </CardFooter>
    </Card>
  )
}

export function CardInteractive() {
  return (
    <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">
      {(["Analytics", "Security", "Speed"] as const).map((title, index) => (
        <Card key={title} interactive tabIndex={0} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]">
          <FeatureBody title={title} text="Hover or focus to lift the card." icon={[ChartLineUp, ShieldCheck, Lightning][index]} />
        </Card>
      ))}
    </div>
  )
}

export function CardOnPhoto() {
  return (
    <div className={cn("grid w-full max-w-3xl gap-4 sm:grid-cols-2", BACKDROP)}>
      {FOUR.map((variant) => (
        <Card key={variant} variant={variant}><FeatureBody title={variant} text="Same content, four surfaces." icon={Stack} /></Card>
      ))}
    </div>
  )
}

export function CardLayout() {
  return (
    <section aria-label="Overview" className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      <Card className="sm:col-span-2"><MetricsBody /></Card>
      <Card variant="soft" tone="accent"><FeatureBody title="Upgrade" text="Unlock audit logs and SSO." icon={ShieldCheck} /></Card>
    </section>
  )
}

/* Alert ------------------------------------------------------------------ */

const TONE_COPY: Record<SurfaceTone, [string, string]> = {
  neutral: ["Heads up", "A new version of the docs is available."],
  accent: ["New feature", "Command palette search is live for everyone."],
  success: ["Deployed", "Build 8812 is live on production."],
  warning: ["Almost out of quota", "You have used 92 percent of this month's builds."],
  danger: ["Payment failed", "We could not charge the card ending in 4242."],
  info: ["Scheduled maintenance", "Read-only mode on Sunday from 02:00 to 02:30 UTC."]
}

export function AlertHero() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {(["info", "success", "warning", "danger"] as const).map((tone) => (
        <Alert key={tone} tone={tone}>
          <AlertTitle>{TONE_COPY[tone][0]}</AlertTitle>
          <AlertDescription>{TONE_COPY[tone][1]}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export function AlertVariantsDemo() {
  return (
    <div className={cn("flex w-full max-w-xl flex-col gap-3", BACKDROP)}>
      {(["glinr", "plain", "solid", "soft", "outline", "gradient", "glass"] as const).map((variant) => (
        <Alert key={variant} variant={variant} tone="accent" icon>
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>Alert surface with an accent tone.</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

export function AlertTonesDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {SURFACE_TONES.map((tone) => (
        <Alert key={tone} tone={tone} icon>
          <AlertTitle>{TONE_COPY[tone][0]}</AlertTitle>
          <AlertDescription>{TONE_COPY[tone][1]}</AlertDescription>
        </Alert>
      ))}
      <Alert variant="note"><AlertTitle>Note</AlertTitle><AlertDescription>Quiet aside with the lift ring.</AlertDescription></Alert>
      <Alert variant="flag"><AlertTitle>Flag</AlertTitle><AlertDescription>Brand-colored callout.</AlertDescription></Alert>
    </div>
  )
}

export function AlertLayout() {
  return (
    <section aria-label="Billing" className="flex w-full max-w-xl flex-col gap-4">
      <Alert tone="warning">
        <AlertTitle>Trial ends in 3 days</AlertTitle>
        <AlertDescription>Add a payment method to keep your projects online.</AlertDescription>
      </Alert>
      <Card className="flex flex-col gap-3"><PricingBody plan="Team" price="$60" /></Card>
    </section>
  )
}

/* Accordion -------------------------------------------------------------- */

const FAQ: Array<[string, string]> = [
  ["Can I use it without Tailwind?", "Components ship with Tailwind classes. Add the preset once and every component works."],
  ["Does it support dark mode?", "Yes. Tokens switch per theme scope, so nested light and dark sections both work."],
  ["Is it accessible?", "Built on Radix: full keyboard support, focus management and ARIA."]
]

function Faq({ variant, className }: { variant?: SurfaceVariant | "separated" | "frosted"; className?: string }) {
  return (
    <Accordion type="single" collapsible defaultValue="item-0" variant={variant} className={cn("w-full max-w-lg", className)}>
      {FAQ.map(([question, answer], index) => (
        <AccordionItem key={question} value={`item-${index}`}>
          <AccordionTrigger>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function AccordionHero() {
  return <Faq />
}

export function AccordionVariantsDemo() {
  return (
    <div className={cn("grid w-full max-w-4xl gap-4 lg:grid-cols-2", BACKDROP)}>
      {(["glinr", "plain", "solid", "soft", "outline", "glass"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <Badge variant="glass" className="w-fit">{variant}</Badge>
          <Faq variant={variant} className="max-w-none" />
        </div>
      ))}
    </div>
  )
}

export function AccordionLayout() {
  return (
    <section aria-label="Help center" className="grid w-full max-w-4xl gap-6 md:grid-cols-[1fr_1.4fr]">
      <div className="flex flex-col gap-2">
        <Heading level={2} size="sm">Frequently asked</Heading>
        <Text size="sm" variant="muted">Quick answers about installing and theming.</Text>
        <Button variant="outline" size="sm" className="mt-2 w-fit">Contact support</Button>
      </div>
      <Faq className="max-w-none" />
    </section>
  )
}

/* Icon frame ------------------------------------------------------------- */

export function IconFrameVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {SURFACE_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <IconFrame variant={variant} tone="accent" size="lg"><Bell aria-hidden className="size-5" /></IconFrame>
          <span className="font-mono text-[11px] text-[var(--color-muted)]">{variant}</span>
        </div>
      ))}
    </div>
  )
}

export function IconFrameTonesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {SURFACE_TONES.map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <IconFrame variant="soft" tone={tone} size="lg"><Bell aria-hidden className="size-5" /></IconFrame>
          <span className="font-mono text-[11px] text-[var(--color-muted)]">{tone}</span>
        </div>
      ))}
    </div>
  )
}

/* Separator -------------------------------------------------------------- */

export function SeparatorVariantsDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      {(["glinr", "plain", "hairline", "gradient", "dashed", "dotted", "glass"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-[var(--color-muted)]">{variant}</span>
          <Separator variant={variant} />
        </div>
      ))}
    </div>
  )
}
