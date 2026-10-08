"use client"

import type { ReactNode } from "react"
import { Bell, FolderOpen, House, MagnifyingGlass, Gear, User } from "@phosphor-icons/react"
import {
  BlurFade,
  ChromaticText,
  DepthCard,
  FloatingPanel,
  GlassBreadcrumb,
  GlassCard,
  GlassCardContent,
  GlassCardHeader,
  GlassDock,
  GlassNavbar,
  GlassToggle,
  GlowBorder,
  LiquidButton,
  MagneticCTA,
  MorphingTabs,
  NumberTicker,
  PrismBorder,
  PulsatingButton,
  RevealText,
  RippleButton,
  ShimmerButton,
  SpotlightCard,
  Typewriter,
  WordRotate
} from "@glinui/ui"

import { DarkStage, LightStage } from "./signature-previews-a"

const ICON = "size-full"

const dockItems = [
  { id: "home", icon: <House className={ICON} />, label: "Home" },
  { id: "search", icon: <MagnifyingGlass className={ICON} />, label: "Search" },
  { id: "files", icon: <FolderOpen className={ICON} />, label: "Files" },
  { id: "bell", icon: <Bell className={ICON} />, label: "Alerts" },
  { id: "settings", icon: <Gear className={ICON} />, label: "Settings" }
]

const crumbs = [
  { id: "home", label: "Home", href: "#" },
  { id: "docs", label: "Docs", href: "#" },
  { id: "breadcrumb", label: "Breadcrumb" }
]

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" }
]

export const signaturePreviewsB: Record<string, ReactNode> = {
  "blur-fade": (
    <LightStage className="p-8">
      <div className="flex w-full max-w-[220px] flex-col gap-2.5">
        {["First item fades in", "Second item, delayed", "Third item, later"].map((text, i) => (
          <BlurFade key={text} delay={i * 200}>
            <div className="rounded-lg border border-[var(--line-soft)] bg-[var(--surface-2)] px-3 py-2 text-xs">{text}</div>
          </BlurFade>
        ))}
      </div>
    </LightStage>
  ),
  "chromatic-text": (
    <DarkStage>
      <h2 className="text-4xl font-bold text-white">
        <ChromaticText>Glin UI</ChromaticText>
      </h2>
    </DarkStage>
  ),
  "depth-card": (
    <DarkStage className="p-8">
      <DepthCard className="w-4/5 bg-neutral-900/50 p-5">
        <h3 className="text-sm font-semibold text-white">Glass Surface</h3>
        <p className="mt-1 text-xs text-neutral-300">Tilt and glare follow the cursor.</p>
      </DepthCard>
    </DarkStage>
  ),
  "floating-panel": (
    <DarkStage>
      <FloatingPanel defaultX={36} defaultY={44} width={170}>
        <h3 className="text-sm font-semibold text-white">Drag Me</h3>
        <p className="mt-1 text-xs text-neutral-400">This panel is draggable.</p>
      </FloatingPanel>
    </DarkStage>
  ),
  "glass-breadcrumb": (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <GlassBreadcrumb items={crumbs} />
    </div>
  ),
  "glass-card": (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <GlassCard className="w-4/5">
        <GlassCardHeader>
          <h3 className="text-sm font-semibold">Glass Card</h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Frosted glass surface</p>
        </GlassCardHeader>
        <GlassCardContent>
          <p className="text-xs">Depth-aware blur and edge highlights.</p>
        </GlassCardContent>
      </GlassCard>
    </div>
  ),
  "glass-dock": (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-sky-500 via-indigo-500 to-fuchsia-500 p-4">
      <GlassDock items={dockItems} />
    </div>
  ),
  "glass-navbar": (
    <div className="flex size-full items-start justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 pt-10">
      <GlassNavbar aria-label="Preview navigation" className="rounded-xl px-4">
        <div className="flex h-11 items-center justify-between gap-4">
          <span className="text-sm font-semibold">Glin UI</span>
          <span className="flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300">
            <span>Docs</span>
            <span>Components</span>
            <User className="size-4" aria-hidden="true" />
          </span>
        </div>
      </GlassNavbar>
    </div>
  ),
  "glass-toggle": (
    <div className="flex size-full items-center justify-center gap-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <GlassToggle size="sm" defaultChecked />
      <GlassToggle />
      <GlassToggle size="lg" defaultChecked />
    </div>
  ),
  "glow-border": (
    <LightStage className="p-8">
      <GlowBorder>
        <div className="p-5">
          <h3 className="text-sm font-semibold">Glow Border</h3>
          <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">Rotating conic glow.</p>
        </div>
      </GlowBorder>
    </LightStage>
  ),
  "liquid-button": (
    <LightStage>
      <LiquidButton variant="liquid">Start Free Trial</LiquidButton>
    </LightStage>
  ),
  "magnetic-cta": (
    <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <MagneticCTA variant="glass">Book a demo</MagneticCTA>
    </div>
  ),
  "morphing-tabs": (
    <LightStage>
      <MorphingTabs items={tabs} size="sm" />
    </LightStage>
  ),
  "number-ticker": (
    <LightStage>
      <span className="text-5xl font-bold tabular-nums">
        <NumberTicker value={1234} />
      </span>
    </LightStage>
  ),
  "prism-border": (
    <DarkStage className="p-8">
      <PrismBorder className="w-4/5">
        <div className="rounded-xl bg-neutral-900 p-5 text-center">
          <h3 className="text-sm font-semibold text-white">Prism Card</h3>
          <p className="mt-1 text-xs text-neutral-400">Rainbow border effect.</p>
        </div>
      </PrismBorder>
    </DarkStage>
  ),
  "pulsating-button": (
    <LightStage>
      <PulsatingButton>Subscribe</PulsatingButton>
    </LightStage>
  ),
  "reveal-text": (
    <LightStage className="p-6 text-center">
      <h2 className="text-2xl font-bold">
        <RevealText text="Welcome to Glin UI" triggerOnView={false} />
      </h2>
    </LightStage>
  ),
  "ripple-button": (
    <LightStage>
      <div className="grid grid-cols-2 gap-3">
        <RippleButton size="sm">Click Me</RippleButton>
        <RippleButton size="sm" variant="glass">Glass</RippleButton>
        <RippleButton size="sm" variant="frosted">Frosted</RippleButton>
        <RippleButton size="sm" variant="outline">Outline</RippleButton>
      </div>
    </LightStage>
  ),
  "shimmer-button": (
    <LightStage>
      <ShimmerButton>Get Started</ShimmerButton>
    </LightStage>
  ),
  "spotlight-card": (
    <LightStage className="p-8">
      <SpotlightCard className="w-4/5">
        <p className="text-sm font-semibold text-foreground">Spotlight Card</p>
        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Hover to track the cursor.</p>
      </SpotlightCard>
    </LightStage>
  ),
  typewriter: (
    <LightStage className="p-6">
      <h2 className="text-2xl font-bold">
        <Typewriter text="Welcome to Glin UI" />
      </h2>
    </LightStage>
  ),
  "word-rotate": (
    <LightStage className="p-6">
      <h2 className="text-2xl font-bold">
        Build with <WordRotate words={["React", "Next.js", "Tailwind", "Glin UI"]} className="text-[var(--color-accent)]" />
      </h2>
    </LightStage>
  )
}

/** Calm static frames for components driven by JS timers (mounted live only on hover). */
export const signatureStills: Record<string, ReactNode> = {
  "number-ticker": (
    <LightStage>
      <span className="text-5xl font-bold tabular-nums">1,234</span>
    </LightStage>
  ),
  typewriter: (
    <LightStage className="p-6">
      <h2 className="text-2xl font-bold">
        Welcome to Glin UI<span className="ml-0.5 inline-block h-6 w-0.5 translate-y-1 bg-current" />
      </h2>
    </LightStage>
  ),
  "word-rotate": (
    <LightStage className="p-6">
      <h2 className="text-2xl font-bold">
        Build with <span className="text-[var(--color-accent)]">Glin UI</span>
      </h2>
    </LightStage>
  )
}
