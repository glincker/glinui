"use client"

import * as React from "react"

// Namespace import: avoids the dev server barrel-export cache for freshly added exports.
import * as Glin from "@glinui/ui"
import type { SurfaceTone, SurfaceVariant } from "@glinui/ui"
import { VariantMatrix } from "@/components/variants/variant-matrix"

const { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardDescription, CardTitle, SURFACE_TONES, SURFACE_VARIANTS, ThemeScope, cn, interactiveSurface, resolveSurfaceVariant, surfaceVariants } = Glin

type LegacyMap = ReadonlyArray<{ standard: SurfaceVariant | string; legacy: string }>

/** Button variants shown under the standard vocabulary. */
const BUTTON_MAP: LegacyMap = [
  { standard: "solid", legacy: "default" },
  { standard: "solid", legacy: "primary" },
  { standard: "soft", legacy: "secondary" },
  { standard: "outline", legacy: "outline" },
  { standard: "ghost", legacy: "ghost" },
  { standard: "glass", legacy: "glass" },
  { standard: "extra", legacy: "liquid" },
  { standard: "extra", legacy: "matte" },
  { standard: "extra", legacy: "glow" },
  { standard: "extra", legacy: "key" },
  { standard: "extra", legacy: "key-white" }
]

type ButtonVariant = React.ComponentProps<typeof Button>["variant"]
type BadgeVariant = React.ComponentProps<typeof Badge>["variant"]
type AlertVariant = React.ComponentProps<typeof Alert>["variant"]
type CardVariant = React.ComponentProps<typeof Card>["variant"]

export function SurfaceMatrixDemo() {
  return (
    <VariantMatrix
      label="Surface variants by tone"
      variants={SURFACE_VARIANTS}
      tones={SURFACE_TONES}
      render={(variant, tone) => (
        <button
          type="button"
          className={cn(
            "h-9 rounded-full px-4 text-sm font-medium",
            surfaceVariants({ variant: variant as SurfaceVariant, tone: tone as SurfaceTone }),
            interactiveSurface({ variant: variant as SurfaceVariant })
          )}
        >
          {tone ?? variant}
        </button>
      )}
    />
  )
}

export function ButtonMatrixDemo() {
  return (
    <VariantMatrix
      label="Button variants"
      variants={BUTTON_MAP.map((row) => `${row.standard}: ${row.legacy}`)}
      render={(row) => {
        const legacy = row.split(": ")[1] as ButtonVariant
        return <Button variant={legacy}>{legacy}</Button>
      }}
    />
  )
}

export function BadgeMatrixDemo() {
  const variants: BadgeVariant[] = ["default", "outline", "ghost", "glass", "success", "warning", "destructive", "info"]
  return (
    <VariantMatrix
      label="Badge variants"
      variants={variants.map(String)}
      render={(variant) => <Badge variant={variant as BadgeVariant}>{variant}</Badge>}
    />
  )
}

export function CardMatrixDemo() {
  const variants: CardVariant[] = ["default", "elevated", "interactive", "glass"]
  return (
    <VariantMatrix
      label="Card variants"
      variants={variants.map(String)}
      render={(variant) => (
        <Card variant={variant as CardVariant} className="w-44 p-3">
          <CardTitle className="text-sm">{variant}</CardTitle>
          <CardDescription className="text-xs">Surface text</CardDescription>
        </Card>
      )}
    />
  )
}

export function AlertMatrixDemo() {
  const variants: AlertVariant[] = ["default", "glass", "matte"]
  return (
    <VariantMatrix
      label="Alert variants"
      variants={variants.map(String)}
      render={(variant) => (
        <Alert variant={variant as AlertVariant} className="w-64">
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>Readable in both scopes.</AlertDescription>
        </Alert>
      )}
    />
  )
}

export function ThemeScopeDemo() {
  return (
    <div className="rounded-2xl border border-border/60 p-4">
      <p className="mb-3 text-sm text-[var(--color-muted)]">This area follows the page theme.</p>
      <Button>Page theme button</Button>
      <ThemeScope theme="dark" fill className="mt-4 rounded-xl p-5">
        <p className="mb-3 text-sm text-[var(--color-muted)]">A dark section inside the page.</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Solid</Button>
          <Button variant="outline">Outline</Button>
          <Badge variant="success">Success</Badge>
        </div>
      </ThemeScope>
    </div>
  )
}

const ALIASES = ["default", "primary", "secondary", "destructive", "success", "frosted"] as const

export function AliasList() {
  return (
    <ul className="grid gap-2 text-sm sm:grid-cols-2">
      {ALIASES.map((legacy) => {
        const resolved = resolveSurfaceVariant(legacy)
        return (
          <li key={legacy} className="rounded-lg border border-border/60 px-3 py-2">
            <code className="font-mono text-xs">{legacy}</code> resolves to <code className="font-mono text-xs">{resolved.variant}</code>, tone{" "}
            <code className="font-mono text-xs">{resolved.tone ?? "neutral"}</code>
          </li>
        )
      })}
    </ul>
  )
}
