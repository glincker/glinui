"use client"

import type { ReactNode } from "react"
import { Globe, Lightning, Palette, Sparkle } from "@phosphor-icons/react"
import {
  AnimatedGradient,
  AuroraBackground,
  Badge,
  BlurSpotlight,
  BorderBeam,
  DotPattern,
  GradientMesh,
  LightLeak,
  Marquee,
  MeteorShower,
  OrbitingCircles,
  ParticleField,
  Ripple,
  RetroGrid
} from "@glinui/ui"

export function DarkStage({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`relative flex size-full items-center justify-center overflow-hidden bg-neutral-950 ${className}`}>
      {children}
    </div>
  )
}

export function LightStage({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <div className={`relative flex size-full items-center justify-center overflow-hidden bg-[var(--surface-1)] ${className}`}>
      {children}
    </div>
  )
}

export function Label({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`relative z-10 text-lg font-semibold tracking-tight ${dark ? "text-white" : "text-foreground"}`}
    >
      {children}
    </span>
  )
}

const marqueeTags = ["React", "Next.js", "Tailwind", "Radix", "TypeScript"]

export const signaturePreviewsA: Record<string, ReactNode> = {
  "animated-gradient": (
    <AnimatedGradient className="flex size-full items-center justify-center">
      <span className="text-sm font-medium">Animated Gradient</span>
    </AnimatedGradient>
  ),
  "aurora-background": (
    <DarkStage>
      <AuroraBackground />
      <Label dark>Aurora</Label>
    </DarkStage>
  ),
  "blur-spotlight": (
    <DarkStage>
      <BlurSpotlight />
      <Label dark>Hover Me</Label>
    </DarkStage>
  ),
  "border-beam": (
    <LightStage className="p-8">
      <div className="relative flex h-24 w-4/5 items-center justify-center rounded-xl border border-[var(--line-soft)] bg-[var(--surface-2)]">
        <BorderBeam />
        <Label>Border Beam</Label>
      </div>
    </LightStage>
  ),
  "dot-pattern": (
    <LightStage>
      <DotPattern />
      <Label>Dot Pattern</Label>
    </LightStage>
  ),
  "gradient-mesh": (
    <DarkStage>
      <GradientMesh />
      <Label dark>Mesh</Label>
    </DarkStage>
  ),
  "light-leak": (
    <DarkStage>
      <LightLeak />
      <Label dark>Light Leak</Label>
    </DarkStage>
  ),
  marquee: (
    <LightStage>
      <Marquee className="py-4" gap={24}>
        {marqueeTags.map((tag) => (
          <Badge key={tag} variant="glass" className="mx-2 text-sm">
            {tag}
          </Badge>
        ))}
      </Marquee>
    </LightStage>
  ),
  "meteor-shower": (
    <DarkStage>
      <MeteorShower />
      <Label dark>Meteors</Label>
    </DarkStage>
  ),
  "orbiting-circles": (
    <LightStage>
      <Globe className="size-7 text-neutral-400" aria-hidden="true" />
      <OrbitingCircles radius={64} duration={16} delay={0} path>
        <Lightning className="size-4 text-neutral-700 dark:text-neutral-300" />
      </OrbitingCircles>
      <OrbitingCircles radius={64} duration={16} delay={5}>
        <Palette className="size-4 text-neutral-700 dark:text-neutral-300" />
      </OrbitingCircles>
      <OrbitingCircles radius={64} duration={16} delay={10}>
        <Sparkle className="size-4 text-neutral-700 dark:text-neutral-300" />
      </OrbitingCircles>
    </LightStage>
  ),
  "particle-field": (
    <DarkStage>
      <ParticleField color="rgba(255,255,255,0.6)" />
      <Label dark>Particles</Label>
    </DarkStage>
  ),
  "retro-grid": (
    <LightStage>
      <RetroGrid />
      <Label>Retro Grid</Label>
    </LightStage>
  ),
  ripple: (
    <LightStage>
      <Ripple />
      <Label>Ripple</Label>
    </LightStage>
  )
}

export const particleStill: ReactNode = (
  <DarkStage>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.35)_0_1.5px,transparent_2px),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.3)_0_1.5px,transparent_2px),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.25)_0_1px,transparent_2px),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.25)_0_1px,transparent_2px)]" />
    <Label dark>Particles</Label>
  </DarkStage>
)
