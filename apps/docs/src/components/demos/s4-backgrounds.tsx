"use client"

// Showcase demos for the Backgrounds category: every effect is shown as a real hero section, a variants row
// and an in-layout card. Render output and code strings are produced from the same specs so they stay in sync.
// The logo row uses the docs-only BrandIcon marks; the copyable code leaves a placeholder for your own logos.

import * as React from "react"
import { AuroraBackground, Badge, Button, DotPattern, FlickeringGrid, GradientMesh, GridPattern, Heading, Input, Label, LightLeak, LightRays, MeteorShower, ParticleField, RetroGrid, Text } from "@glinui/ui"

import { BrandIcon } from "@/components/brand/brand-icon"
import type { BrandName } from "@/components/brand/brands"
import type { ComponentExample } from "@/lib/component-docs"

type Copy = { badge: string; title: string; sub: string; primary: string; secondary: string }

const COPY = {
  deploy: { badge: "Branch previews are live", title: "Ship every branch to a live URL", sub: "Push to Git and get a shareable preview in under a minute, with logs, rollbacks and per-branch environment variables.", primary: "Start deploying", secondary: "Read the docs" },
  analytics: { badge: "Dashboards 2.0", title: "Answers from your data, without the SQL", sub: "Connect a warehouse, ask in plain language and pin the result to a dashboard your whole team can open.", primary: "Connect a source", secondary: "See a sample" },
  photo: { badge: "Film presets", title: "Every frame keeps its warmth", sub: "Twelve presets tuned on real film scans. Apply once, batch export a whole shoot and keep the original files untouched.", primary: "Try the presets", secondary: "Compare looks" },
  security: { badge: "SOC 2 Type II", title: "See every login before it becomes an incident", sub: "Risk scoring on each sign in, device trust checks and one click session revocation from a single audit trail.", primary: "Book a review", secondary: "Security overview" },
  dev: { badge: "Open source", title: "A typed API client in every language", sub: "Generate SDKs from your OpenAPI spec on every merge and publish them to npm, PyPI and Maven without leaving CI.", primary: "Generate an SDK", secondary: "View on GitHub" },
  docs: { badge: "Docs, reimagined", title: "Documentation your team keeps current", sub: "Write in Markdown, review in pull requests and publish to a fast static site with search and versioning built in.", primary: "Create a site", secondary: "Browse examples" },
  infra: { badge: "Status", title: "Know about the outage before your users do", sub: "Probe from 14 regions every 30 seconds, route alerts to the right on-call and publish incidents to a status page.", primary: "Start monitoring", secondary: "View pricing" },
  launch: { badge: "Oct 21, online", title: "Launch Week: five days, five releases", sub: "Join the live walkthroughs, ask the engineers questions and get early access to everything we announce.", primary: "Save my seat", secondary: "See the schedule" },
  stars: { badge: "Realtime", title: "Presence for every page, in one hook", sub: "Show who is viewing, typing and pointing without running your own socket servers or paying per connection.", primary: "Add presence", secondary: "Try the demo" },
  meteor: { badge: "Changelog", title: "Everything we shipped this quarter", sub: "Forty two improvements across builds, caching and observability, with migration notes where behavior changed.", primary: "Read the changelog", secondary: "Subscribe" }
} satisfies Record<string, Copy>

type CopyKey = keyof typeof COPY

const LOGOS: Array<{ name: BrandName; label: string }> = [
  { name: "vercel", label: "Vercel" },
  { name: "github", label: "GitHub" },
  { name: "cloudflare", label: "Cloudflare" },
  { name: "astro", label: "Astro" }
]

const SECTION = "relative isolate flex min-h-[26rem] w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-xl bg-[var(--surface-0)] px-4 py-14 text-center sm:px-8"

/** Hero section with headline, subcopy, two buttons and a logo row layered above an effect. */
export function BgHero({ effect, copy }: { effect: React.ReactNode; copy: CopyKey }) {
  const c = COPY[copy]
  return (
    <section data-glin-theme="dark" aria-label={c.title} className={SECTION}>
      {effect}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4">
        <Badge tone="accent" variant="soft">{c.badge}</Badge>
        <Heading level={1} size="display">{c.title}</Heading>
        <Text size="lg" variant="muted" className="max-w-xl">{c.sub}</Text>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button size="lg">{c.primary}</Button>
          <Button size="lg" variant="outline">{c.secondary}</Button>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Text size="sm" variant="muted">Works with</Text>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[var(--color-foreground)]">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="flex items-center gap-2 text-sm font-medium">
              <BrandIcon name={logo.name} size={18} variant="mono" />
              {logo.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function heroCode(imp: string, effectCode: string, copy: CopyKey): string {
  const c = COPY[copy]
  return `import { ${imp}${imp ? ", " : ""}Badge, Button, Heading, Text } from "@glinui/ui"

export function Hero() {
  return (
    <section data-glin-theme="dark" className="${SECTION}">
      ${effectCode}
      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-4">
        <Badge tone="accent" variant="soft">${c.badge}</Badge>
        <Heading level={1} size="display">${c.title}</Heading>
        <Text size="lg" variant="muted" className="max-w-xl">
          ${c.sub}
        </Text>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button size="lg">${c.primary}</Button>
          <Button size="lg" variant="outline">${c.secondary}</Button>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Text size="sm" variant="muted">Works with</Text>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[var(--color-foreground)]">
          {/* Your partner or customer logos go here */}
          <li className="text-sm font-medium">Vercel</li>
          <li className="text-sm font-medium">GitHub</li>
          <li className="text-sm font-medium">Cloudflare</li>
          <li className="text-sm font-medium">Astro</li>
        </ul>
      </div>
    </section>
  )
}`
}

type Tile = { label: string; effect: React.ReactNode; code: string }

const TILE = "relative isolate flex h-44 items-end overflow-hidden rounded-xl bg-[var(--surface-0)] p-3"
const CHIP = "relative z-10 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-white"

export function BgTiles({ tiles }: { tiles: Tile[] }) {
  return (
    <div data-glin-theme="dark" className="grid w-full gap-3 sm:grid-cols-3">
      {tiles.map((tile) => (
        <div key={tile.label} className={TILE}>
          {tile.effect}
          <span className={CHIP}>{tile.label}</span>
        </div>
      ))}
    </div>
  )
}

function tilesCode(imp: string, tiles: Tile[]): string {
  const body = tiles
    .map((tile) => `      <div className="${TILE}">\n        ${tile.code}\n        <span className="${CHIP}">${tile.label}</span>\n      </div>`)
    .join("\n")
  return `import { ${imp} } from "@glinui/ui"

export function Variants() {
  return (
    <div data-glin-theme="dark" className="grid w-full gap-3 sm:grid-cols-3">
${body}
    </div>
  )
}`
}

const AUTH_SECTION = "relative isolate flex min-h-[26rem] w-full items-center justify-center overflow-hidden rounded-xl bg-[var(--surface-0)] px-4 py-10"
const AUTH_CARD = "relative z-10 flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-6 text-left [box-shadow:var(--shadow-lg)]"

/** Sign-in card centered on an effect: the background stays behind a real form. */
export function BgAuth({ effect }: { effect: React.ReactNode }) {
  return (
    <section data-glin-theme="dark" aria-label="Sign in" className={AUTH_SECTION}>
      {effect}
      <form className={AUTH_CARD}>
        <div className="flex flex-col gap-1">
          <Heading level={2} size="sm">Sign in to Northwind</Heading>
          <Text size="sm" variant="muted">Use your work email to continue.</Text>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bg-auth-email">Work email</Label>
          <Input id="bg-auth-email" type="email" autoComplete="email" placeholder="you@company.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="bg-auth-password">Password</Label>
          <Input id="bg-auth-password" type="password" autoComplete="current-password" placeholder="At least 12 characters" />
        </div>
        <Button type="button" className="w-full">Continue</Button>
      </form>
    </section>
  )
}

function authCode(imp: string, effectCode: string): string {
  return `import { ${imp}, Button, Heading, Input, Label, Text } from "@glinui/ui"

export function SignIn() {
  return (
    <section data-glin-theme="dark" className="${AUTH_SECTION}">
      ${effectCode}
      <form className="${AUTH_CARD}">
        <div className="flex flex-col gap-1">
          <Heading level={2} size="sm">Sign in to Northwind</Heading>
          <Text size="sm" variant="muted">Use your work email to continue.</Text>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="At least 12 characters" />
        </div>
        <Button type="submit" className="w-full">Continue</Button>
      </form>
    </section>
  )
}`
}

const STATS: Array<[string, string, string]> = [
  ["Requests", "2.41M", "+8.2%"],
  ["p95 latency", "184 ms", "-12 ms"],
  ["Error rate", "0.03%", "-0.01%"]
]
const STATS_SECTION = "relative isolate flex min-h-[22rem] w-full flex-col justify-end gap-6 overflow-hidden rounded-xl bg-[var(--surface-0)] p-6 sm:p-8"

/** Dashboard header over an effect: title row, actions and three stat tiles. */
export function BgStats({ effect }: { effect: React.ReactNode }) {
  return (
    <section data-glin-theme="dark" aria-label="Usage overview" className={STATS_SECTION}>
      {effect}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="eyebrow">Production, last 24 hours</Text>
          <Heading level={2} size="md">API overview</Heading>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Export CSV</Button>
          <Button size="sm">Create alert</Button>
        </div>
      </div>
      <dl className="relative z-10 grid gap-3 sm:grid-cols-3">
        {STATS.map(([label, value, delta]) => (
          <div key={label} className="rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4">
            <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--color-foreground)]">{value}</dd>
            <dd className="text-xs text-[var(--tone-success-text)]">{delta} vs yesterday</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function statsCode(imp: string, effectCode: string): string {
  return `import { ${imp}, Button, Heading, Text } from "@glinui/ui"

const stats = [
  ["Requests", "2.41M", "+8.2%"],
  ["p95 latency", "184 ms", "-12 ms"],
  ["Error rate", "0.03%", "-0.01%"]
]

export function UsageHeader() {
  return (
    <section data-glin-theme="dark" className="${STATS_SECTION}">
      ${effectCode}
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Text variant="eyebrow">Production, last 24 hours</Text>
          <Heading level={2} size="md">API overview</Heading>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">Export CSV</Button>
          <Button size="sm">Create alert</Button>
        </div>
      </div>
      <dl className="relative z-10 grid gap-3 sm:grid-cols-3">
        {stats.map(([label, value, delta]) => (
          <div key={label} className="rounded-xl border border-[var(--line-soft)] bg-[var(--surface-1)] p-4">
            <dt className="text-xs text-[var(--color-muted)]">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-[var(--color-foreground)]">{value}</dd>
            <dd className="text-xs text-[var(--tone-success-text)]">{delta} vs yesterday</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}`
}

type Spec = {
  imp: string
  copy: CopyKey
  effect: React.ReactNode
  effectCode: string
  heroNote: string
  tiles: Tile[]
  tilesNote: string
  layout: "auth" | "stats"
  layoutNote: string
}

function build(spec: Spec): ComponentExample[] {
  const layoutEffect = spec.effect
  const layout =
    spec.layout === "auth"
      ? { render: <BgAuth effect={layoutEffect} />, code: authCode(spec.imp, spec.effectCode) }
      : { render: <BgStats effect={layoutEffect} />, code: statsCode(spec.imp, spec.effectCode) }
  return [
    { title: "Hero section", description: spec.heroNote, code: heroCode(spec.imp, spec.effectCode, spec.copy), render: <BgHero effect={spec.effect} copy={spec.copy} /> },
    { title: "Variants", description: spec.tilesNote, code: tilesCode(spec.imp, spec.tiles), render: <BgTiles tiles={spec.tiles} /> },
    { title: spec.layout === "auth" ? "Behind a sign in card" : "Behind a dashboard header", description: spec.layoutNote, code: layout.code, render: layout.render }
  ]
}

const HERO_NOTE = "Headline, subcopy, two buttons and a logo row sit above the effect. The section opts into the dark token scope so text keeps AA contrast. The logo row uses docs-only BrandIcon marks; swap in your own logos."

const specs: Record<string, Spec> = {
  "aurora-background": {
    imp: "AuroraBackground", copy: "deploy",
    effect: <AuroraBackground intensity={0.55} />, effectCode: "<AuroraBackground intensity={0.55} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <AuroraBackground intensity={0.6} />, code: "<AuroraBackground intensity={0.6} />" },
      { label: "Cool tones", effect: <AuroraBackground colors={["#06b6d4", "#3b82f6", "#8b5cf6"]} intensity={0.6} />, code: '<AuroraBackground colors={["#06b6d4", "#3b82f6", "#8b5cf6"]} intensity={0.6} />' },
      { label: "Dense", effect: <AuroraBackground blobCount={5} duration={12} blur={100} intensity={0.6} />, code: "<AuroraBackground blobCount={5} duration={12} blur={100} intensity={0.6} />" }
    ],
    tilesNote: "Default palette, a cool palette through the colors prop, and a denser field with five blobs.",
    layout: "auth", layoutNote: "Keep the form on an opaque surface so the moving aurora never reduces input contrast."
  },
  "gradient-mesh": {
    imp: "GradientMesh", copy: "analytics",
    effect: <GradientMesh intensity={0.5} />, effectCode: "<GradientMesh intensity={0.5} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <GradientMesh intensity={0.6} />, code: "<GradientMesh intensity={0.6} />" },
      { label: "Warm", effect: <GradientMesh colors={["#f43f5e", "#f97316", "#eab308"]} intensity={0.5} />, code: '<GradientMesh colors={["#f43f5e", "#f97316", "#eab308"]} intensity={0.5} />' },
      { label: "Slow and soft", effect: <GradientMesh duration={24} blur={120} intensity={0.5} />, code: "<GradientMesh duration={24} blur={120} intensity={0.5} />" }
    ],
    tilesNote: "Palette, duration and blur change the mood without touching the layout.",
    layout: "auth", layoutNote: "A mesh behind an auth card gives a branded sign in screen with no image assets."
  },
  "light-leak": {
    imp: "LightLeak", copy: "photo",
    effect: <LightLeak intensity={0.5} />, effectCode: "<LightLeak intensity={0.5} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <LightLeak intensity={0.6} />, code: "<LightLeak intensity={0.6} />" },
      { label: "Cool", effect: <LightLeak colors={["#06b6d4", "#3b82f6", "#8b5cf6"]} intensity={0.5} />, code: '<LightLeak colors={["#06b6d4", "#3b82f6", "#8b5cf6"]} intensity={0.5} />' },
      { label: "Three leaks", effect: <LightLeak count={3} duration={14} intensity={0.5} />, code: "<LightLeak count={3} duration={14} intensity={0.5} />" }
    ],
    tilesNote: "Warm default, a cool palette and a three leak composition.",
    layout: "stats", layoutNote: "Leaks drift behind a dashboard header; the stat tiles sit on solid surfaces."
  },
  "light-rays": {
    imp: "LightRays", copy: "security",
    effect: <LightRays intensity={0.4} />, effectCode: "<LightRays intensity={0.4} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Soft", effect: <LightRays intensity={0.45} />, code: "<LightRays intensity={0.45} />" },
      { label: "Crisp", effect: <LightRays variant="crisp" count={5} intensity={0.45} />, code: '<LightRays variant="crisp" count={5} intensity={0.45} />' },
      { label: "Seed 4", effect: <LightRays seed={4} count={9} blur={40} intensity={0.45} />, code: "<LightRays seed={4} count={9} blur={40} intensity={0.45} />" }
    ],
    tilesNote: "Soft rays, crisp rays and another seed for a different layout.",
    layout: "auth", layoutNote: "Rays at intensity 0.45 or lower keep body text above AA contrast."
  },
  "grid-pattern": {
    imp: "GridPattern", copy: "dev",
    effect: <GridPattern fade="radial" squares={[[4, 4], [5, 1], [8, 2], [10, 5], [2, 2]]} />, effectCode: '<GridPattern fade="radial" squares={[[4, 4], [5, 1], [8, 2], [10, 5], [2, 2]]} />',
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Grid", effect: <GridPattern fade="radial" />, code: '<GridPattern fade="radial" />' },
      { label: "Dashed", effect: <GridPattern fade="radial" strokeDasharray="4 2" width={32} height={32} />, code: '<GridPattern fade="radial" strokeDasharray="4 2" width={32} height={32} />' },
      { label: "Stripes", effect: <GridPattern variant="stripes" width={12} height={12} fade="bottom" />, code: '<GridPattern variant="stripes" width={12} height={12} fade="bottom" />' }
    ],
    tilesNote: "Plain grid, dashed grid and the stripes variant.",
    layout: "stats", layoutNote: "A faded grid gives dashboard headers structure without competing with the data."
  },
  "dot-pattern": {
    imp: "DotPattern", copy: "docs",
    effect: <DotPattern className="[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" />, effectCode: '<DotPattern className="[mask-image:radial-gradient(520px_circle_at_center,white,transparent)]" />',
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <DotPattern className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />, code: '<DotPattern className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />' },
      { label: "Large dots", effect: <DotPattern dotSize={2.5} gap={30} dotOpacity={0.35} className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />, code: '<DotPattern dotSize={2.5} gap={30} dotOpacity={0.35} className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />' },
      { label: "Tight", effect: <DotPattern dotSize={1} gap={12} dotOpacity={0.3} className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />, code: '<DotPattern dotSize={1} gap={12} dotOpacity={0.3} className="[mask-image:radial-gradient(240px_circle_at_center,white,transparent)]" />' }
    ],
    tilesNote: "Dot size, gap and opacity, each masked to a soft circle.",
    layout: "auth", layoutNote: "Dots behind a form read as quiet texture and never fight the fields."
  },
  "flickering-grid": {
    imp: "FlickeringGrid", copy: "infra",
    effect: <FlickeringGrid squareSize={4} gridGap={6} maxOpacity={0.35} className="absolute inset-0" />, effectCode: '<FlickeringGrid squareSize={4} gridGap={6} maxOpacity={0.35} className="absolute inset-0" />',
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Square", effect: <FlickeringGrid squareSize={4} gridGap={6} maxOpacity={0.4} className="absolute inset-0" />, code: '<FlickeringGrid squareSize={4} gridGap={6} maxOpacity={0.4} className="absolute inset-0" />' },
      { label: "Round", effect: <FlickeringGrid variant="round" squareSize={4} gridGap={8} maxOpacity={0.4} className="absolute inset-0" />, code: '<FlickeringGrid variant="round" squareSize={4} gridGap={8} maxOpacity={0.4} className="absolute inset-0" />' },
      { label: "Busy", effect: <FlickeringGrid squareSize={3} gridGap={5} flickerChance={0.6} maxOpacity={0.4} className="absolute inset-0" />, code: '<FlickeringGrid squareSize={3} gridGap={5} flickerChance={0.6} maxOpacity={0.4} className="absolute inset-0" />' }
    ],
    tilesNote: "Square and round cells, and a busier field with a higher flicker chance.",
    layout: "stats", layoutNote: "A quiet flicker behind live metrics suggests activity without distracting from numbers."
  },
  "retro-grid": {
    imp: "RetroGrid", copy: "launch",
    effect: <RetroGrid />, effectCode: "<RetroGrid />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <RetroGrid />, code: "<RetroGrid />" },
      { label: "Steep angle", effect: <RetroGrid angle={75} cellSize={40} />, code: "<RetroGrid angle={75} cellSize={40} />" },
      { label: "Wide cells", effect: <RetroGrid cellSize={90} lineOpacity={0.5} />, code: "<RetroGrid cellSize={90} lineOpacity={0.5} />" }
    ],
    tilesNote: "Angle, cell size and line opacity change the perspective floor.",
    layout: "auth", layoutNote: "The scrolling floor sits low in the frame; the card keeps the form readable."
  },
  "particle-field": {
    imp: "ParticleField", copy: "stars",
    effect: <ParticleField count={40} />, effectCode: "<ParticleField count={40} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <ParticleField count={30} />, code: "<ParticleField count={30} />" },
      { label: "Squares", effect: <ParticleField count={30} shape="square" maxSize={5} />, code: '<ParticleField count={30} shape="square" maxSize={5} />' },
      { label: "Long drift", effect: <ParticleField count={24} distance={140} duration={10} />, code: "<ParticleField count={24} distance={140} duration={10} />" }
    ],
    tilesNote: "Circle and square particles, and a longer drift distance.",
    layout: "stats", layoutNote: "Particles drift behind the header; tiles stay on opaque surfaces."
  },
  "meteor-shower": {
    imp: "MeteorShower", copy: "meteor",
    effect: <MeteorShower count={14} />, effectCode: "<MeteorShower count={14} />",
    heroNote: HERO_NOTE,
    tiles: [
      { label: "Default", effect: <MeteorShower count={10} />, code: "<MeteorShower count={10} />" },
      { label: "Steep", effect: <MeteorShower count={10} angle={235} />, code: "<MeteorShower count={10} angle={235} />" },
      { label: "Heavy", effect: <MeteorShower count={24} minDuration={2} maxDuration={5} />, code: "<MeteorShower count={24} minDuration={2} maxDuration={5} />" }
    ],
    tilesNote: "Angle, count and duration range.",
    layout: "auth", layoutNote: "Meteors cross the page behind a card; the card stays opaque."
  }
}

/** Examples for the Backgrounds pages that use the three-example hero, variants and layout pattern. */
export const bgExamples: Record<string, ComponentExample[]> = Object.fromEntries(
  Object.entries(specs).map(([id, spec]) => [id, build(spec)])
)

export const bgCode = (id: string, index: number): string => bgExamples[id][index].code
export const bgRender = (id: string, index: number): React.ReactNode => bgExamples[id][index].render
