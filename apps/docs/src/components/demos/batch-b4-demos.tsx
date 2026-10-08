"use client"

// Demos for batch B4: gooey-text-reveal, spinning-text, border-trail, progressive-blur.
// Deep imports keep this file independent of the package index until the integrator wires exports.

import * as React from "react"
import { ArrowUpRight, Lightning, ShieldCheck } from "@phosphor-icons/react/dist/ssr"
import {
  Badge,
  BorderTrail,
  Button,
  Card,
  GooeyTextReveal,
  ProgressiveBlur,
  SpinningText
} from "@glinui/ui"

/* Gooey text reveal ---------------------------------------------------------- */

export function GooeyHero() {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-4 py-6 text-center">
      <Badge>New release</Badge>
      <GooeyTextReveal as="h2" text="Interfaces that melt into place" className="text-3xl sm:text-5xl" />
      <p className="max-w-md text-sm text-[var(--color-muted)]">Words blur in through one shared goo filter, then settle into crisp type.</p>
    </div>
  )
}

export function GooeyVariants() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      {(["default", "plain", "glass"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] p-4">
          <GooeyTextReveal as="h3" variant={variant} trigger="mount" text="Liquid type" className="text-2xl" />
          <span className="text-xs text-[var(--color-muted)]">{variant}</span>
        </div>
      ))}
    </div>
  )
}

export function GooeyStates() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] p-4">
        <GooeyTextReveal as="h3" text={["Design", "Build", "Ship"]} className="text-3xl" />
        <span className="text-xs text-[var(--color-muted)]">Morph between phrases</span>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] p-4">
        <GooeyTextReveal as="h3" text="Bigger blobs" blur={20} stagger={160} trigger="mount" className="text-3xl" />
        <span className="text-xs text-[var(--color-muted)]">blur 20, stagger 160ms</span>
      </div>
    </div>
  )
}

export function GooeyLayout() {
  return (
    <section aria-labelledby="gooey-layout" className="flex w-full flex-col items-center gap-5 rounded-2xl border border-[var(--color-border)] px-6 py-10 text-center">
      <GooeyTextReveal as="h2" text="Ship the interface your users remember" className="text-3xl sm:text-4xl" />
      <p id="gooey-layout" className="max-w-md text-sm text-[var(--color-muted)]">Real text stays in the page for search and screen readers.</p>
      <Button>Get started</Button>
    </section>
  )
}

/* Spinning text -------------------------------------------------------------- */

function Seal({ children, ...rest }: React.ComponentProps<typeof SpinningText>) {
  return (
    <div className="relative inline-grid place-items-center">
      <SpinningText fontSize={0.8} radius={6} {...rest}>
        {children}
      </SpinningText>
      <Lightning aria-hidden="true" weight="fill" className="absolute size-6 text-[var(--color-accent)]" />
    </div>
  )
}

export function SpinningHero() {
  return (
    <div className="flex items-center gap-6 py-4">
      <Seal pauseOnHover>{"open source * made to be owned * "}</Seal>
      <div className="max-w-xs">
        <p className="text-base font-semibold">Own every component</p>
        <p className="text-sm text-[var(--color-muted)]">Hover the seal to pause it.</p>
      </div>
    </div>
  )
}

export function SpinningVariants() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {(["default", "plain", "glass"] as const).map((variant) => (
        <Seal key={variant} variant={variant} duration={14}>
          {`${variant} variant * ${variant} variant * `}
        </Seal>
      ))}
    </div>
  )
}

export function SpinningStates() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Seal duration={6}>{"fast spin * fast spin * "}</Seal>
      <Seal reverse>{"reversed * reversed * reversed * "}</Seal>
      <Seal radius={4} fontSize={0.7}>{"tight ring * tight ring * "}</Seal>
    </div>
  )
}

export function SpinningLayout() {
  return (
    <Card className="flex w-full max-w-md items-center gap-5 p-5">
      <Seal duration={16}>{"verified * verified * verified * "}</Seal>
      <div>
        <p className="font-semibold">Trusted by teams</p>
        <p className="text-sm text-[var(--color-muted)]">A rotating badge beside a proof point.</p>
      </div>
    </Card>
  )
}

/* Border trail --------------------------------------------------------------- */

function TrailCard({ children, className, ...trail }: React.ComponentProps<typeof BorderTrail> & { children: React.ReactNode }) {
  return (
    <Card className="relative w-72 max-w-full overflow-hidden p-5">
      <BorderTrail className={className} {...trail} />
      {children}
    </Card>
  )
}

const TrailBody = ({ title }: { title: string }) => (
  <div className="flex flex-col gap-2">
    <ShieldCheck aria-hidden="true" className="size-6 text-[var(--color-accent)]" />
    <p className="font-semibold">{title}</p>
    <p className="text-sm text-[var(--color-muted)]">A comet runs along the edge.</p>
  </div>
)

export function TrailHero() {
  return (
    <TrailCard size={90} borderWidth={2} duration={6}>
      <TrailBody title="Secure by default" />
    </TrailCard>
  )
}

export function TrailVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["default", "plain", "glass"] as const).map((variant) => (
        <TrailCard key={variant} variant={variant} borderWidth={2} duration={5}>
          <TrailBody title={variant} />
        </TrailCard>
      ))}
    </div>
  )
}

export function TrailStates() {
  return (
    <div className="flex flex-wrap gap-4">
      <TrailCard color="var(--color-signal-ok)" size={120} borderWidth={2}>
        <TrailBody title="Long green trail" />
      </TrailCard>
      <TrailCard radius={32} duration={3} borderWidth={3} size={50}>
        <TrailBody title="Fast and thick" />
      </TrailCard>
    </div>
  )
}

export function TrailLayout() {
  return (
    <section aria-label="Plans" className="grid w-full gap-4 sm:grid-cols-2">
      <Card className="p-5">
        <p className="font-semibold">Starter</p>
        <p className="text-sm text-[var(--color-muted)]">For side projects.</p>
      </Card>
      <Card className="relative overflow-hidden p-5">
        <BorderTrail borderWidth={2} size={100} duration={6} />
        <p className="font-semibold">Team</p>
        <p className="mb-3 text-sm text-[var(--color-muted)]">The highlighted plan wears the trail.</p>
        <Button size="sm" trailingIcon={<ArrowUpRight aria-hidden="true" />}>Choose Team</Button>
      </Card>
    </section>
  )
}

/* Progressive blur ----------------------------------------------------------- */

const ROWS = Array.from({ length: 14 }, (_, i) => `Activity entry ${i + 1}: deploy finished in ${40 + i * 3}s`)

function Feed({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative isolate h-56 w-72 max-w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className ?? ""}`}>
      <ul className="flex h-full flex-col gap-2 overflow-y-auto p-4 text-sm" tabIndex={0} aria-label="Activity feed">
        {ROWS.map((row) => (
          <li key={row} className="rounded-md bg-[var(--color-surface)] px-3 py-2">
            {row}
          </li>
        ))}
      </ul>
      {children}
    </div>
  )
}

export function BlurHero() {
  return (
    <Feed>
      <ProgressiveBlur direction="bottom" size={72} />
    </Feed>
  )
}

export function BlurVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["top", "bottom", "start", "end"] as const).map((direction) => (
        <Feed key={direction} className="!w-40 !h-40">
          <ProgressiveBlur direction={direction} size={56} />
        </Feed>
      ))}
    </div>
  )
}

export function BlurStates() {
  return (
    <div className="flex flex-wrap gap-4">
      <Feed>
        <ProgressiveBlur blurLayers={3} blurIntensity={2} size={64} />
      </Feed>
      <Feed>
        <ProgressiveBlur blurLayers={8} blurIntensity={0.6} size={96} />
      </Feed>
    </div>
  )
}

export function BlurLayout() {
  return (
    <div className="relative isolate h-64 w-full max-w-md overflow-hidden rounded-xl border border-[var(--color-border)]">
      <ProgressiveBlur direction="top" size={56} className="!z-20" />
      <div className="absolute inset-x-0 top-0 z-30 flex h-12 items-center justify-between px-4">
        <span className="text-sm font-semibold">Changelog</span>
        <Badge>v2</Badge>
      </div>
      <ul className="h-full overflow-y-auto p-4 pt-14 text-sm" tabIndex={0} aria-label="Changelog entries">
        {ROWS.map((row) => (
          <li key={row} className="border-b border-[var(--color-border)] py-3">
            {row}
          </li>
        ))}
      </ul>
    </div>
  )
}
