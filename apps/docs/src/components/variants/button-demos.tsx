"use client"

import { ArrowRight, Plus } from "@phosphor-icons/react/dist/ssr"

// Namespace import: avoids the dev server barrel-export cache for freshly added exports.
import * as Glin from "@glinui/ui"
import type { SurfaceTone, SurfaceVariant } from "@glinui/ui"
import { VariantMatrix } from "@/components/variants/variant-matrix"

const { Button, SURFACE_TONES, SURFACE_VARIANTS } = Glin

/** Every vocabulary variant (rows) by tone (columns), once per theme scope. */
export function ButtonVariantsMatrix() {
  return (
    <VariantMatrix
      label="Button variants by tone"
      variants={SURFACE_VARIANTS}
      tones={SURFACE_TONES}
      render={(variant, tone) => (
        <Button variant={variant as SurfaceVariant} tone={tone as SurfaceTone} size="sm">
          {tone ?? variant}
        </Button>
      )}
    />
  )
}

/** The tone axis on the default (glinr) and solid variants. */
export function ButtonTonesRow() {
  return (
    <div className="space-y-3">
      {[undefined, "solid", "soft"].map((variant) => (
        <div key={variant ?? "default"} className="flex flex-wrap items-center gap-2">
          {SURFACE_TONES.map((tone) => (
            <Button key={tone} variant={variant as SurfaceVariant | undefined} tone={tone}>
              {tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )
}

export function ButtonIconsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon={<Plus weight="bold" />}>New project</Button>
      <Button variant="solid" trailingIcon={<ArrowRight weight="bold" />} iconNudge>
        Continue
      </Button>
      <Button variant="outline" size="icon" aria-label="Add item">
        <Plus weight="bold" />
      </Button>
    </div>
  )
}

export function ButtonLoadingDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving</Button>
      <Button variant="solid" loading>
        Saving
      </Button>
      <Button variant="outline" loading>
        Saving
      </Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
