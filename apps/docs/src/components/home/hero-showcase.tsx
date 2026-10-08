"use client"

import { Lightning, PaintBrush, Sparkle } from "@phosphor-icons/react"

import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Chip,
  GlassCard,
  Progress,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@glinui/ui"

import { Surface } from "./surface"

const SWATCHES = [
  "bg-[var(--color-accent)]",
  "bg-[var(--color-signal-live)]",
  "bg-[var(--color-signal-ok)]",
  "bg-[var(--surface-3)]",
  "bg-[var(--color-foreground)]"
]

/** Live composition of real @glinui/ui components. Motion is transform-only. */
export function HeroShowcase() {
  return (
    <div className="relative isolate mx-auto w-full max-w-[34rem] lg:mx-0">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(70%_60%_at_70%_20%,color-mix(in_oklab,var(--color-accent)_16%,transparent),transparent_70%),radial-gradient(50%_50%_at_10%_90%,color-mix(in_oklab,var(--color-signal-ok)_10%,transparent),transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-[1.5rem] bg-[radial-gradient(circle,var(--line-soft)_1px,transparent_1.4px)] bg-[length:16px_16px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 px-0 py-6 sm:px-6 sm:py-10">
        <Surface elevation={3} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar fallback="MK" size="md" status="online" />
              <div className="leading-tight">
                <p className="text-sm font-semibold text-[var(--color-foreground)]">Maya Kowalski</p>
                <p className="text-xs text-[var(--color-muted)]">Design systems</p>
              </div>
            </div>
            <Badge variant="success" size="sm">Live</Badge>
          </div>

          <Tabs defaultValue="overview" className="mt-5">
            <TabsList aria-label="Workspace sections">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[var(--color-muted)]">
                  <span>Components adopted</span>
                  <span className="font-mono tabular-nums">72 / 100</span>
                </div>
                <Progress value={72} aria-label="Components adopted" />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-[var(--surface-well)] px-3 py-2.5 [box-shadow:var(--elev-inset)]">
                <span className="text-sm text-[var(--color-foreground)]">Reduced motion</span>
                <Switch aria-label="Reduced motion" defaultChecked />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Ship it</Button>
                <Button size="sm" variant="outline">Preview</Button>
                <AvatarGroup max={3} spacing="loose" className="ml-auto gap-0.5 [&>*]:ring-2 [&>*]:ring-[var(--surface-1)]">
                  <Avatar fallback="AK" size="sm" />
                  <Avatar fallback="BL" size="sm" />
                  <Avatar fallback="CM" size="sm" />
                  <Avatar fallback="DN" size="sm" />
                </AvatarGroup>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="mt-4 text-sm text-[var(--color-muted)]">
              14 components copied this week.
            </TabsContent>
            <TabsContent value="billing" className="mt-4 text-sm text-[var(--color-muted)]">
              MIT licensed. Nothing to pay.
            </TabsContent>
          </Tabs>
        </Surface>

        <div className="grid gap-4 sm:grid-cols-2">
          <GlassCard size="sm" className="landing-float-slow">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-muted)]">
              <Sparkle className="size-3.5" aria-hidden="true" />
              Surface: glass
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--color-foreground)]">One variant, not the whole system.</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Chip>blur</Chip>
              <Chip>refraction</Chip>
            </div>
          </GlassCard>

          <Surface elevation={2} className="landing-float-reverse p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-muted)]">
              <PaintBrush className="size-3.5" aria-hidden="true" />
              OKLCH tokens
            </div>
            <div className="mt-3 flex gap-1.5" aria-hidden="true">
              {SWATCHES.map((swatch) => (
                <span key={swatch} className={`h-7 flex-1 rounded-md [box-shadow:var(--elev-1)] ${swatch}`} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
              <Lightning className="size-3.5" weight="fill" aria-hidden="true" />
              Light and dark, one source
            </div>
          </Surface>
        </div>
      </div>
    </div>
  )
}
