"use client"

import * as React from "react"

import {
  Badge,
  BorderBeam,
  Button,
  Marquee,
  NumberTicker,
  Progress,
  ShimmerButton,
  Switch,
  Tabs,
  TabsList,
  TabsTrigger
} from "@glinui/ui"
import type { ComponentId } from "@/lib/primitives"

export type GalleryItem = {
  id: ComponentId
  title: string
  note: string
  className: string
  Preview: React.ComponentType
}

function ButtonPreview() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button size="sm">Default</Button>
      <Button size="sm" variant="outline">Outline</Button>
      <Button size="sm" variant="glass">Glass</Button>
    </div>
  )
}

function SwitchPreview() {
  return (
    <div className="w-full max-w-[12rem] space-y-4">
      <label className="flex items-center justify-between text-sm">
        Notifications
        <Switch defaultChecked aria-label="Notifications" />
      </label>
      <Progress value={64} aria-label="Upload progress" />
    </div>
  )
}

function ShimmerPreview() {
  return <ShimmerButton>Get started</ShimmerButton>
}

function TickerPreview() {
  return (
    <p className="text-5xl font-light tabular-nums tracking-[-0.03em] text-[var(--color-foreground)]">
      <NumberTicker value={2480} />
    </p>
  )
}

function MarqueePreview() {
  return (
    <Marquee className="w-full" speed={24}>
      {["Radix", "Tailwind", "React 19", "Next.js", "Motion"].map((name) => (
        <Badge key={name} variant="glass" className="mx-1.5">{name}</Badge>
      ))}
    </Marquee>
  )
}

function BeamPreview() {
  return (
    <div className="relative w-full max-w-[13rem] overflow-hidden rounded-xl bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-2)]">
      <p className="text-sm font-semibold">Border beam</p>
      <p className="mt-1 text-xs text-[var(--color-muted)]">A light that travels the edge.</p>
      <BorderBeam size={90} duration={6} />
    </div>
  )
}

function TabsPreview() {
  return (
    <Tabs defaultValue="a">
      <TabsList aria-label="Preview tabs">
        <TabsTrigger value="a">Design</TabsTrigger>
        <TabsTrigger value="b">Code</TabsTrigger>
        <TabsTrigger value="c">Prompt</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export const GALLERY: GalleryItem[] = [
  { id: "button", title: "Button", note: "Seven surface variants", className: "w-[19rem]", Preview: ButtonPreview },
  { id: "number-ticker", title: "Number Ticker", note: "Counts up when seen", className: "w-[15rem]", Preview: TickerPreview },
  { id: "border-beam", title: "Border Beam", note: "Animated edge light", className: "w-[19rem]", Preview: BeamPreview },
  { id: "switch", title: "Switch", note: "Keyboard and screen reader ready", className: "w-[17rem]", Preview: SwitchPreview },
  { id: "marquee", title: "Marquee", note: "Pauses on hover", className: "w-[19rem]", Preview: MarqueePreview },
  { id: "shimmer-button", title: "Shimmer Button", note: "Free motion component", className: "w-[16rem]", Preview: ShimmerPreview },
  { id: "tabs", title: "Tabs", note: "Roving focus built in", className: "w-[17rem]", Preview: TabsPreview }
]
