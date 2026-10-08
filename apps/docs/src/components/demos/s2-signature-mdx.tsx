"use client"

// Client wrapper so signature MDX pages (server components) can render the S2 signature hero demos.
// The code string is generated from the demo source (pnpm showcase:code), so copy matches the render.
import type { ComponentProps } from "react"
import { ComponentHero } from "@/components/docs/component-hero"
import {
  FloatingPanelProductHero,
  GlassBreadcrumbHero,
  GlassDockHero,
  GlassNavbarHero,
  MorphingTabsHero
} from "@/components/demos/s2-signature-heroes"
import { showcaseS2Code } from "@/lib/new-components/showcase-s2-code.generated"

const heroes = {
  GlassNavbarHero,
  GlassDockHero,
  GlassBreadcrumbHero,
  MorphingTabsHero,
  FloatingPanelProductHero
}

export function SigHero({
  id,
  title,
  name,
  stage
}: {
  id: ComponentProps<typeof ComponentHero>["componentId"]
  title: string
  name: keyof typeof heroes
  stage?: ComponentProps<typeof ComponentHero>["stage"]
}) {
  const Demo = heroes[name]
  return (
    <ComponentHero componentId={id} title={title} stage={stage} code={showcaseS2Code[name]}>
      <Demo />
    </ComponentHero>
  )
}
