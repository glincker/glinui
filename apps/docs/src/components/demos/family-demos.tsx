"use client"

// Showcase demos for the card and effect family. Each effect component gets four compositions:
// Hero (real UI, effect visible without hovering), Variants (host surface on a vivid backdrop),
// Tones (effect color per tone) and Layout (a pricing row or mini dashboard).

import * as React from "react"
import { ChartLineUp, Gauge, Lightning, ShieldCheck, Stack, UsersThree } from "@phosphor-icons/react/dist/ssr"
import {
  Avatar,
  BentoCard,
  BentoGrid,
  Badge,
  BorderBeam,
  Button,
  Card,
  DepthCard,
  DepthLayer,
  FloatingPanel,
  GlassCard,
  GlowBorder,
  Heading,
  IconFrame,
  MagicCard,
  NeonGradientCard,
  PrismBorder,
  ShineBorder,
  SpotlightCard,
  Text,
  cn
} from "@glinui/ui"

import { BrandIcon } from "@/components/brand/brand-icon"
import { FeatureBody, IntegrationBody, LoginBody, MetricsBody, PricingBody, ProfileBody, SecurityBody } from "./family-bodies"

type V = "glinr" | "plain" | "solid" | "glass"
type T = "accent" | "success" | "warning" | "danger" | "info"
type WrapProps = { variant?: V; tone?: T; autoPlay?: boolean; className?: string; children: React.ReactNode }
type Wrap = (props: WrapProps) => React.ReactNode

const VARIANTS: V[] = ["glinr", "plain", "solid", "glass"]
const TONES: T[] = ["accent", "success", "warning", "danger", "info"]
const tokenOf = (tone: T) => `var(--tone-${tone})`

const SPOT: Record<T, string> = {
  accent: "[background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--tone-accent)_34%,transparent),transparent_70%)]",
  success: "[background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--tone-success)_34%,transparent),transparent_70%)]",
  warning: "[background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--tone-warning)_34%,transparent),transparent_70%)]",
  danger: "[background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--tone-danger)_34%,transparent),transparent_70%)]",
  info: "[background:radial-gradient(var(--spot-size,300px)_circle_at_var(--spot-x,_50%)_var(--spot-y,_50%),color-mix(in_oklab,var(--tone-info)_34%,transparent),transparent_70%)]"
}

const BACKDROP =
  "rounded-xl bg-neutral-900 p-5 bg-[radial-gradient(at_18%_20%,#ff7ab6_0,transparent_48%),radial-gradient(at_82%_28%,#5b8cff_0,transparent_50%),radial-gradient(at_50%_95%,#2ee6a6_0,transparent_55%)]"

const W = "w-72 max-w-full"

/* Wraps: the effect component hosting its children ----------------------- */

const spotlightWrap: Wrap = ({ variant, tone, autoPlay, className, children }) => (
  <SpotlightCard variant={variant} autoPlay={autoPlay} spotlightClassName={tone ? SPOT[tone] : undefined} className={cn(W, className)}>
    {children}
  </SpotlightCard>
)

const magicWrap: Wrap = ({ variant, tone, autoPlay, className, children }) => (
  <MagicCard
    variant={variant}
    autoPlay={autoPlay}
    gradientFrom={tone ? tokenOf(tone) : undefined}
    gradientColor={tone ? `color-mix(in oklab, ${tokenOf(tone)} 24%, transparent)` : undefined}
    className={cn(W, className)}
  >
    {children}
  </MagicCard>
)

const depthWrap: Wrap = ({ variant, tone, autoPlay, className, children }) => (
  <DepthCard variant={tone ? "soft" : variant} tone={tone} autoPlay={autoPlay} className={cn(W, className)}>
    {children}
  </DepthCard>
)

const glassWrap: Wrap = ({ variant, tone, className, children }) => (
  <GlassCard variant={tone ? "soft" : variant ?? "glass"} tone={tone} className={cn(W, className)}>
    {children}
  </GlassCard>
)

const neonWrap: Wrap = ({ variant, tone, className, children }) => (
  <NeonGradientCard
    variant={variant}
    neonColors={tone ? { firstColor: tokenOf(tone), secondColor: "var(--color-accent)" } : undefined}
    className={cn(W, className)}
  >
    {children}
  </NeonGradientCard>
)

const shineWrap: Wrap = ({ variant, tone, className, children }) => (
  <Card variant={variant} className={cn("relative", W, className)}>
    <ShineBorder borderWidth={2} duration={6} shineColor={tone ? [tokenOf(tone), "var(--color-accent)"] : ["var(--color-accent)", "var(--color-signal-ok)"]} />
    {children}
  </Card>
)

const beamWrap: Wrap = ({ variant, tone, className, children }) => (
  <Card variant={variant} className={cn("relative", W, className)}>
    <BorderBeam size={180} duration={5} colorFrom={tone ? tokenOf(tone) : "var(--color-accent)"} />
    {children}
  </Card>
)

const glowWrap: Wrap = ({ variant, tone, className, children }) => (
  <GlowBorder variant={variant} glowColor={tone ? tokenOf(tone) : "var(--color-accent)"} glowSize={3} duration={4} borderRadius="1.25rem" className={cn(W, className)}>
    <div className="p-6">{children}</div>
  </GlowBorder>
)

const prismWrap: Wrap = ({ variant, tone, className, children }) => (
  <PrismBorder
    borderWidth={2}
    borderRadius="1.25rem"
    colors={tone ? [tokenOf(tone), "var(--color-accent)", tokenOf(tone)] : undefined}
    className={cn(W, className)}
  >
    <Card variant={variant} className="rounded-[inherit]">{children}</Card>
  </PrismBorder>
)

const panelWrap: Wrap = ({ variant, tone, className, children }) => (
  <FloatingPanel draggable={false} variant={tone ? "soft" : variant} tone={tone} width="100%" className={cn("static max-w-72", className)}>
    <div className="p-2">{children}</div>
  </FloatingPanel>
)

/* Layouts ------------------------------------------------------------------ */

function Mini({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Text as="span" size="sm" variant="muted">{label}</Text>
      <span className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-foreground)]">{value}</span>
      <Badge tone="success" variant="soft" className="w-fit">{delta}</Badge>
    </div>
  )
}

function PricingRow({ wrap: Wrapper }: { wrap: Wrap }) {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      <Card variant="plain" className="flex flex-col gap-4">
        <PricingBody plan="Starter" price="$0" />
      </Card>
      <Wrapper className="w-full" autoPlay>
        <PricingBody plan="Pro" price="$24" />
      </Wrapper>
      <Card variant="plain" className="flex flex-col gap-4">
        <PricingBody plan="Team" price="$60" />
      </Card>
    </div>
  )
}

function Dashboard({ wrap: Wrapper }: { wrap: Wrap }) {
  return (
    <section aria-label="Overview" className="flex w-full max-w-4xl flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading level={3} size="sm">Overview</Heading>
        <Badge variant="soft">Last 7 days</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Wrapper className="w-full" autoPlay><Mini label="Revenue" value="$48.2k" delta="+12.4%" /></Wrapper>
        <Wrapper className="w-full" autoPlay><Mini label="Active teams" value="1,284" delta="+4.1%" /></Wrapper>
        <Wrapper className="w-full" autoPlay><Mini label="Deploys" value="9,310" delta="+18%" /></Wrapper>
      </div>
      <Card variant="plain" className="flex flex-col gap-3">
        <Text as="span" size="sm" variant="muted">Recent activity</Text>
        {["Maya shipped v2.4", "Build 8812 passed", "Sam invited 3 teammates"].map((row) => (
          <div key={row} className="flex items-center justify-between border-t border-[var(--line-soft)] pt-3 text-sm text-[var(--color-foreground)] first:border-t-0 first:pt-0">
            {row}<span className="text-xs text-[var(--color-muted)]">just now</span>
          </div>
        ))}
      </Card>
    </section>
  )
}

/* Factory ------------------------------------------------------------------ */

type Kit = { Hero: () => React.ReactNode; Variants: () => React.ReactNode; Tones: () => React.ReactNode; Layout: () => React.ReactNode }

function makeKit(wrap: Wrap, hero: React.ReactNode, layout: "pricing" | "dashboard", autoPlay = true): Kit {
  const Wrapper = wrap
  return {
    Hero: () => (
      <div className="w-full max-w-xs">
        <Wrapper autoPlay={autoPlay} className="w-full">{hero}</Wrapper>
      </div>
    ),
    Variants: () => (
      <div className={cn("grid w-full max-w-3xl gap-4 sm:grid-cols-2", BACKDROP)}>
        {VARIANTS.map((variant) => (
          <Wrapper key={variant} variant={variant} autoPlay={autoPlay} className="w-full">
            <FeatureBody title={variant} text={variant === "glass" ? "Opt-in. Needs a backdrop." : "Crisp on any stage."} icon={Stack} />
          </Wrapper>
        ))}
      </div>
    ),
    Tones: () => (
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TONES.map((tone) => (
          <Wrapper key={tone} tone={tone} autoPlay={autoPlay} className="w-full">
            <FeatureBody title={tone} text="The effect color follows the tone token." icon={Gauge} />
          </Wrapper>
        ))}
      </div>
    ),
    Layout: () => (layout === "pricing" ? <PricingRow wrap={wrap} /> : <Dashboard wrap={wrap} />)
  }
}

const spotlight = makeKit(spotlightWrap, <FeatureBody />, "dashboard")
const magic = makeKit(magicWrap, <PricingBody />, "pricing")
const neon = makeKit(neonWrap, <PricingBody />, "pricing")
const shine = makeKit(shineWrap, <LoginBody />, "pricing")
const beam = makeKit(beamWrap, <MetricsBody />, "dashboard")
const glow = makeKit(glowWrap, <IntegrationBody />, "pricing")
const prism = makeKit(prismWrap, <ProfileBody />, "pricing")
const depth = makeKit(depthWrap, <FeatureBody />, "dashboard")
const glass = makeKit(glassWrap, <ProfileBody />, "dashboard", false)
const panel = makeKit(panelWrap, <SecurityBody />, "dashboard", false)

/* Bespoke heroes ------------------------------------------------------------ */

function SpotlightGridHero() {
  const items = [
    { title: "Instant previews", text: "Every pull request gets a live URL in seconds.", icon: Lightning },
    { title: "Safe by default", text: "Scoped tokens and signed builds on every plan.", icon: ShieldCheck },
    { title: "Team insights", text: "See who ships what, and how fast.", icon: UsersThree }
  ]
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <SpotlightCard key={item.title} autoPlay className="w-full">
          <FeatureBody {...item} />
        </SpotlightCard>
      ))}
    </div>
  )
}

function DepthHero() {
  return (
    <DepthCard autoPlay maxTilt={16} className="w-full max-w-sm pb-8">
      <DepthLayer depth={4} className="absolute -top-9 end-1">
        <Avatar fallback="AL" size="lg" ring status="online" />
      </DepthLayer>
      <div className="flex flex-col gap-3">
        <DepthLayer depth={2} className="w-fit"><Badge tone="accent" variant="soft">Studio</Badge></DepthLayer>
        <Heading level={3} size="sm">Design system seats</Heading>
        <Text size="sm" variant="muted">Move across the card: the badge, price tag and avatar float at different heights above the face.</Text>
        <DepthLayer depth={3} className="w-fit">
          <span className="inline-flex items-baseline gap-1 rounded-full bg-[var(--color-accent)] px-4 py-1.5 text-white">
            <span className="text-xl font-semibold tabular-nums">$32</span><span className="text-xs">/ seat</span>
          </span>
        </DepthLayer>
        <DepthLayer depth={1} className="flex -space-x-2 rtl:space-x-reverse">
          {["JS", "KO", "RP"].map((name) => <Avatar key={name} fallback={name} size="sm" ring />)}
        </DepthLayer>
      </div>
    </DepthCard>
  )
}

const dots = (
  <div className="absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--color-foreground)_14%,transparent)_1px,transparent_1px)] [background-size:16px_16px]" />
)
const wash = (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-accent)_24%,transparent),transparent_70%)]" />
)
const bars = (
  <div className="absolute inset-x-6 top-5 flex h-14 items-end gap-2" aria-hidden>
    {["h-[35%]", "h-[52%]", "h-[44%]", "h-[70%]", "h-[62%]", "h-[88%]", "h-[100%]"].map((h) => (
      <div key={h} className={cn("flex-1 rounded-t-md bg-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]", h)} />
    ))}
  </div>
)
const logos = (
  <div className="absolute end-6 top-6 flex items-center gap-3" aria-hidden>
    <BrandIcon name="github" size="lg" /><BrandIcon name="vercel" size="lg" /><BrandIcon name="cloudflare" size="lg" />
  </div>
)

type BentoV = "glinr" | "plain" | "solid" | "glass"
function Bento({ variant, compact = false }: { variant?: BentoV; compact?: boolean }) {
  return (
    <BentoGrid className={cn("w-full max-w-4xl", compact ? "auto-rows-[11rem]" : "auto-rows-[16rem]")}>
      <BentoCard variant={variant} name="Analytics" description="Live charts for every release, per team." Icon={ChartLineUp} href="#analytics" cta="Open dashboard" background={bars} className="sm:col-span-2" />
      <BentoCard variant={variant} name="Security" description="Signed builds, scoped tokens." Icon={ShieldCheck} href="#security" cta="Read more" background={wash} />
      <BentoCard variant={variant} name="Speed" description="Zero runtime cost, tree-shaken." Icon={Lightning} background={dots} />
      <BentoCard variant={variant} name="Teams" description="Roles, reviews and audit logs." Icon={UsersThree} href="#teams" cta="Invite" background={wash} />
      <BentoCard variant={variant} name="Integrations" description="Ship to the tools you already use." Icon={Stack} href="#integrations" cta="Browse" background={logos} className="sm:col-span-2 lg:col-span-1" />
    </BentoGrid>
  )
}

function BentoVariants() {
  return (
    <div className={cn("grid w-full max-w-4xl gap-4", BACKDROP)}>
      {VARIANTS.slice(0, 4).map((variant) => (
        <BentoGrid key={variant} className="auto-rows-[9rem] sm:grid-cols-2 lg:grid-cols-2">
          <BentoCard variant={variant} name={variant} description="Bento tile surface." Icon={Stack} />
          <BentoCard variant={variant} name="Linked" description="The whole tile is one anchor." Icon={Lightning} href="#x" cta="Open" />
        </BentoGrid>
      ))}
    </div>
  )
}

function BentoTones() {
  const toneWash: Record<T, string> = {
    accent: "bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--tone-accent)_32%,transparent),transparent_70%)]",
    success: "bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--tone-success)_32%,transparent),transparent_70%)]",
    warning: "bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--tone-warning)_32%,transparent),transparent_70%)]",
    danger: "bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--tone-danger)_32%,transparent),transparent_70%)]",
    info: "bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--tone-info)_32%,transparent),transparent_70%)]"
  }
  return (
    <BentoGrid className="w-full max-w-4xl auto-rows-[10rem]">
      {TONES.map((tone) => (
        <BentoCard key={tone} name={tone} description="Tile wash follows the tone token." Icon={Gauge} background={<div className={cn("absolute inset-0", toneWash[tone])} />} />
      ))}
    </BentoGrid>
  )
}

function CardGrid({ items }: { items: Array<React.ComponentProps<typeof Card>> }) {
  return (
    <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((props, index) => (
        <Card key={index} {...props} />
      ))}
    </div>
  )
}

function FloatingHero() {
  return (
    <div className="relative h-80 w-full max-w-3xl overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-0)]">
      <FloatingPanel closable defaultX={24} defaultY={20} width={300} aria-label="Quick actions">
        <div className="flex flex-col gap-3">
          <Heading level={3} size="sm">Quick actions</Heading>
          {[
            ["New deploy", Lightning],
            ["Invite teammate", UsersThree],
            ["View audit log", ShieldCheck]
          ].map(([label, Icon]) => {
            const I = Icon as React.ElementType<{ className?: string; "aria-hidden"?: boolean }>
            return (
              <Button key={String(label)} variant="outline" size="sm" className="w-full justify-start gap-2">
                <I aria-hidden className="size-4" />{String(label)}
              </Button>
            )
          })}
        </div>
      </FloatingPanel>
      <FloatingPanel defaultX={360} defaultY={120} width={260} variant="soft" tone="accent" aria-label="Status">
        <div className="flex items-center gap-3">
          <IconFrame tone="accent"><Gauge aria-hidden className="size-5" /></IconFrame>
          <div><p className="text-sm font-semibold text-[var(--color-foreground)]">All systems normal</p><p className="text-xs text-[var(--color-muted)]">Drag me around</p></div>
        </div>
      </FloatingPanel>
    </div>
  )
}

/* Exports (flat, so server pages can import them) --------------------------- */

export const SpotlightCardHero = SpotlightGridHero
export const SpotlightCardVariants = spotlight.Variants
export const SpotlightCardTones = spotlight.Tones
export const SpotlightCardLayout = spotlight.Layout

export const DepthCardHero = DepthHero
export const DepthCardVariants = depth.Variants
export const DepthCardTones = depth.Tones
export const DepthCardLayout = depth.Layout

export const GlassCardHero = () => (
  <div className={cn("flex w-full max-w-3xl justify-center", BACKDROP, "py-10")}>{glass.Hero()}</div>
)
export const GlassCardVariants = glass.Variants
export const GlassCardTones = glass.Tones
export const GlassCardLayout = glass.Layout

export const MagicCardHero = magic.Hero
export const MagicCardVariants = magic.Variants
export const MagicCardTones = magic.Tones
export const MagicCardLayout = magic.Layout

export const NeonGradientCardHero = neon.Hero
export const NeonGradientCardVariants = neon.Variants
export const NeonGradientCardTones = neon.Tones
export const NeonGradientCardLayout = neon.Layout

export const ShineBorderHero = shine.Hero
export const ShineBorderVariants = shine.Variants
export const ShineBorderTones = shine.Tones
export const ShineBorderLayout = shine.Layout

export const BorderBeamHero = beam.Hero
export const BorderBeamVariants = beam.Variants
export const BorderBeamTones = beam.Tones
export const BorderBeamLayout = beam.Layout

export const GlowBorderHero = glow.Hero
export const GlowBorderVariants = glow.Variants
export const GlowBorderTones = glow.Tones
export const GlowBorderLayout = glow.Layout

export const PrismBorderHero = prism.Hero
export const PrismBorderVariants = prism.Variants
export const PrismBorderTones = prism.Tones
export const PrismBorderLayout = prism.Layout

export const FloatingPanelHero = FloatingHero
export const FloatingPanelVariants = panel.Variants
export const FloatingPanelTones = panel.Tones
export const FloatingPanelLayout = panel.Layout

export const BentoGridHero = () => <Bento />
export const BentoGridVariants = BentoVariants
export const BentoGridTones = BentoTones
export const BentoGridLayout = () => (
  <section aria-label="Product overview" className="flex w-full max-w-4xl flex-col gap-4">
    <div className="flex flex-col gap-1"><Heading level={2} size="sm">Everything in one place</Heading><Text size="sm" variant="muted">A landing section built from bento tiles.</Text></div>
    <Bento compact />
  </section>
)

export { CardGrid }
