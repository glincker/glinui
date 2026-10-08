"use client"

import * as React from "react"
import { Bell, ChartLineUp, Cube, Lightning, Moon, Palette, ShieldCheck, Sparkle, Stack, Sun } from "@phosphor-icons/react/dist/ssr"
import {
  Badge,
  Button,
  Card,
  CircularGallery,
  type CircularGalleryItem,
  CylinderCarousel,
  HighlightGrid,
  type HighlightGridCell,
  ImageComparison
} from "@glinui/ui"

/** Token-only gradients. Literal strings so Tailwind can see them. */
const FACES = [
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--tone-accent)_55%,var(--surface-1)),color-mix(in_oklab,var(--tone-info)_30%,var(--surface-1)))]",
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--tone-success)_50%,var(--surface-1)),color-mix(in_oklab,var(--tone-info)_25%,var(--surface-1)))]",
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--tone-warning)_55%,var(--surface-1)),color-mix(in_oklab,var(--tone-danger)_30%,var(--surface-1)))]",
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--tone-danger)_45%,var(--surface-1)),color-mix(in_oklab,var(--tone-accent)_35%,var(--surface-1)))]",
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--tone-info)_55%,var(--surface-1)),color-mix(in_oklab,var(--tone-success)_25%,var(--surface-1)))]",
  "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-foreground)_22%,var(--surface-1)),color-mix(in_oklab,var(--tone-accent)_28%,var(--surface-1)))]"
] as const

const ICONS = [Sparkle, Lightning, Palette, Cube, ChartLineUp, ShieldCheck] as const
const NAMES = ["Aurora", "Voltage", "Palette", "Prism", "Signal", "Vault"] as const

export function GradientTile({ index, caption }: { index: number; caption?: string }) {
  const Icon = ICONS[index % ICONS.length]
  return (
    <div className={`flex size-full flex-col items-center justify-center gap-3 p-4 text-[color:var(--color-foreground)] ${FACES[index % FACES.length]}`}>
      <span className="grid size-12 place-items-center rounded-full bg-[var(--surface-1)] [box-shadow:var(--elev-1)]">
        <Icon aria-hidden="true" className="size-6" weight="duotone" />
      </span>
      <span className="text-sm font-semibold">{NAMES[index % NAMES.length]}</span>
      {caption ? <span className="text-xs text-[color:var(--color-muted)]">{caption}</span> : null}
    </div>
  )
}

const slides = (count: number) => Array.from({ length: count }, (_, i) => <GradientTile key={i} index={i} caption={`Slide ${i + 1}`} />)

export function CylinderCarouselHero() {
  return <CylinderCarousel label="Featured palettes" items={slides(6)} className="max-w-xl" />
}

export function CylinderCarouselVariants() {
  return (
    <div className="grid w-full gap-6">
      {(["glinr", "plain", "solid"] as const).map((variant) => (
        <div key={variant} className="grid gap-2">
          <Badge variant="outline" className="w-fit">{variant}</Badge>
          <CylinderCarousel label={`${variant} carousel`} variant={variant} items={slides(5)} cardWidth={140} cardHeight={180} />
        </div>
      ))}
    </div>
  )
}

export function CylinderCarouselAuto() {
  return <CylinderCarousel label="Autoplay carousel" items={slides(5)} autoPlay autoPlayInterval={2800} cardWidth={150} cardHeight={190} />
}

export function CylinderCarouselLayout() {
  return (
    <section aria-labelledby="cc-layout" className="grid w-full gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-center">
      <div className="grid gap-3">
        <Badge tone="accent" variant="soft" className="w-fit">New</Badge>
        <h3 id="cc-layout" className="text-2xl font-semibold text-[color:var(--color-foreground)]">Pick a palette</h3>
        <p className="text-sm text-[color:var(--color-muted)]">Spin through curated palettes with the arrows, swipe or the arrow keys.</p>
        <Button className="w-fit">Use palette</Button>
      </div>
      <CylinderCarousel label="Palettes" items={slides(6)} cardWidth={160} cardHeight={210} />
    </section>
  )
}

function Mockup({ polished }: { polished: boolean }) {
  return (
    <div className="flex size-full flex-col gap-3 bg-[var(--surface-0)] px-4 pb-4 pt-12 text-[color:var(--color-foreground)]">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Notifications</span>
        <Badge variant={polished ? "soft" : "outline"} tone={polished ? "accent" : "neutral"}>{polished ? "3 new" : "3"}</Badge>
      </div>
      <Card variant={polished ? "glinr" : "plain"} className="flex items-center gap-3 p-3">
        <span className={polished ? "grid size-9 place-items-center rounded-full bg-[color-mix(in_oklab,var(--tone-accent)_16%,var(--surface-1))]" : "grid size-9 place-items-center rounded-md border border-[color:var(--color-border)]"}>
          <Bell aria-hidden="true" className="size-5" weight={polished ? "duotone" : "regular"} />
        </span>
        <span className="grid text-sm">
          <span className="font-medium">Deploy finished</span>
          <span className="text-xs text-[color:var(--color-muted)]">2 minutes ago</span>
        </span>
      </Card>
      <Card variant={polished ? "glinr" : "plain"} className="flex items-center gap-3 p-3">
        <span className={polished ? "grid size-9 place-items-center rounded-full bg-[color-mix(in_oklab,var(--tone-success)_16%,var(--surface-1))]" : "grid size-9 place-items-center rounded-md border border-[color:var(--color-border)]"}>
          <Stack aria-hidden="true" className="size-5" weight={polished ? "duotone" : "regular"} />
        </span>
        <span className="grid text-sm">
          <span className="font-medium">Build queued</span>
          <span className="text-xs text-[color:var(--color-muted)]">Just now</span>
        </span>
      </Card>
      <div className="mt-auto flex gap-2">
        <Button size="sm" variant={polished ? "glinr" : "plain"}>Mark all read</Button>
        <Button size="sm" variant="ghost">Settings</Button>
      </div>
    </div>
  )
}

export function ImageComparisonHero() {
  return <ImageComparison className="aspect-[4/5] max-w-2xl sm:aspect-[16/10]" before={<Mockup polished={false} />} after={<Mockup polished />} beforeLabel="Before" afterLabel="After" />
}

export function ImageComparisonVariants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <ImageComparison className="aspect-[4/5] sm:aspect-[4/3]" before={<Mockup polished={false} />} after={<Mockup polished />} orientation="vertical" defaultValue={40} label="Vertical comparison" />
      <ImageComparison className="aspect-[4/5] sm:aspect-[4/3]" before={<Mockup polished={false} />} after={<Mockup polished />} hover defaultValue={65} label="Hover comparison" />
    </div>
  )
}

export function ImageComparisonThemes() {
  const light = (
    <div className="grid size-full place-items-center bg-[linear-gradient(135deg,#f6f3ee,#dfe7f5)] text-[#1b1d22]">
      <span className="flex items-center gap-2 text-lg font-semibold"><Sun aria-hidden="true" className="size-6" weight="duotone" />Light</span>
    </div>
  )
  const dark = (
    <div className="grid size-full place-items-center bg-[linear-gradient(135deg,#14161b,#242a3a)] text-[#f1f3f8]">
      <span className="flex items-center gap-2 text-lg font-semibold"><Moon aria-hidden="true" className="size-6" weight="duotone" />Dark</span>
    </div>
  )
  return <ImageComparison className="max-w-xl" before={light} after={dark} beforeLabel="Light" afterLabel="Dark" label="Theme comparison" />
}

export function ImageComparisonLayout() {
  return (
    <section aria-labelledby="ic-layout" className="grid w-full gap-4">
      <h3 id="ic-layout" className="text-xl font-semibold text-[color:var(--color-foreground)]">See the redesign</h3>
      <ImageComparison className="aspect-[4/5] sm:aspect-[16/10]" before={<Mockup polished={false} />} after={<Mockup polished />} />
    </section>
  )
}

const GALLERY: CircularGalleryItem[] = NAMES.map((name, i) => ({ id: name.toLowerCase(), label: name, content: <GradientTile index={i} /> }))

export function CircularGalleryHero() {
  return <CircularGallery label="Collections" items={GALLERY} className="max-w-2xl" />
}

export function CircularGalleryVariants() {
  return (
    <div className="grid w-full gap-4">
      {(["glinr", "plain", "solid"] as const).map((variant) => (
        <CircularGallery key={variant} label={`${variant} gallery`} variant={variant} items={GALLERY.slice(0, 5)} tileWidth={110} tileHeight={140} tilt={4} showCaption={false} />
      ))}
    </div>
  )
}

export function CircularGalleryAuto() {
  return <CircularGallery label="Auto gallery" items={GALLERY} autoRotate autoRotateInterval={2600} />
}

export function CircularGalleryLayout() {
  return (
    <section aria-labelledby="cg-layout" className="grid w-full gap-4 text-center">
      <h3 id="cg-layout" className="text-xl font-semibold text-[color:var(--color-foreground)]">Browse collections</h3>
      <CircularGallery label="Collections" items={GALLERY} wheel={false} />
    </section>
  )
}

const FEATURES: HighlightGridCell[] = [
  { id: "speed", label: "Speed" },
  { id: "safety", label: "Safety" },
  { id: "design", label: "Design" },
  { id: "motion", label: "Motion" },
  { id: "themes", label: "Themes" },
  { id: "a11y", label: "Accessibility" }
]
const FEATURE_ICONS = [Lightning, ShieldCheck, Palette, Sparkle, Sun, Cube] as const
const FEATURE_COPY = ["Ships with no runtime cost per cell.", "Keyboard and screen reader ready.", "Every surface comes from tokens.", "Respects reduced motion everywhere.", "Light, dark and custom scopes.", "Roving focus and visible rings."] as const

function featureCell(cell: HighlightGridCell, state: { index: number; active: boolean }) {
  const Icon = FEATURE_ICONS[state.index % FEATURE_ICONS.length]
  return (
    <span className="grid gap-2">
      <Icon aria-hidden="true" className="size-6" weight={state.active ? "fill" : "duotone"} />
      <span className="text-sm font-semibold text-[color:var(--color-foreground)]">{cell.label}</span>
      <span className="text-sm text-[color:var(--color-muted)]">{FEATURE_COPY[state.index % FEATURE_COPY.length]}</span>
    </span>
  )
}

export function HighlightGridHero() {
  return <HighlightGrid cells={FEATURES} cellRenderer={featureCell} className="w-full max-w-3xl" />
}

export function HighlightGridVariants() {
  return (
    <div className="grid w-full gap-4">
      {(["glinr", "plain", "glass"] as const).map((variant) => (
        <HighlightGrid key={variant} variant={variant} columns={3} cells={FEATURES.slice(0, 3)} cellRenderer={featureCell} />
      ))}
    </div>
  )
}

export function HighlightGridLinks() {
  const cells = FEATURES.slice(0, 4).map((cell) => ({ ...cell, href: `#${cell.id}` }))
  return <HighlightGrid columns={2} cells={cells} cellRenderer={featureCell} className="max-w-xl" />
}

export function HighlightGridLayout() {
  return (
    <section aria-labelledby="hg-layout" className="grid w-full gap-4">
      <h3 id="hg-layout" className="text-xl font-semibold text-[color:var(--color-foreground)]">Why teams switch</h3>
      <HighlightGrid columns={3} cells={FEATURES} cellRenderer={featureCell} />
    </section>
  )
}
