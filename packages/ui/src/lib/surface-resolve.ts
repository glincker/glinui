import type { GlinStyle } from "./glin-config"
import { liftShell, PLAIN_CONTAINER } from "./lift"
import {
  resolveSurfaceVariant,
  resolveVariant,
  surfaceVariants,
  type ComponentKind,
  type SurfaceTone,
  type SurfaceVariant
} from "./surface"

/**
 * Resolves a `variant` prop (vocabulary name, legacy alias, component-specific extra, or undefined)
 * to a vocabulary variant plus the tone implied by a legacy alias (for example `success` -> soft + success).
 * Names listed in `extras` are returned untouched as `extra` so the component can render its own look.
 */
export function resolveSurfaceProps<E extends string = never>(
  variantProp: string | null | undefined,
  ambientStyle: GlinStyle,
  kind: ComponentKind = "container",
  extras: readonly E[] = [],
  remap: Readonly<Record<string, SurfaceVariant>> = {}
): { variant: SurfaceVariant; tone?: SurfaceTone; extra?: E } {
  const name = variantProp ? (remap[variantProp] ?? variantProp) : variantProp
  if (name && (extras as readonly string[]).includes(name)) {
    return { variant: resolveVariant(undefined, ambientStyle, kind), extra: name as E }
  }
  const variant = resolveVariant(name, ambientStyle, kind)
  const tone = name && name !== "default" ? resolveSurfaceVariant(name, variant).tone : undefined
  return { variant, tone }
}

export type ContainerRadius = "lg" | "xl" | "2xl"

const RADIUS_CLASS: Record<ContainerRadius, string> = {
  lg: "rounded-[var(--radius-lg)]",
  xl: "rounded-[var(--lift-r-outer)]",
  "2xl": "rounded-[var(--radius-2xl)]"
}

/**
 * Class string for a container-kind surface (panels, lists, bubbles) per vocabulary variant.
 * glinr = lift shell, plain = shadcn flat container, solid = neutral with tonal depth.
 * Literal strings only, so Tailwind sees every class.
 */
export function containerSurface(
  variant: SurfaceVariant,
  opts: { radius?: ContainerRadius; elevation?: "1" | "2" | "3"; tone?: SurfaceTone } = {}
): string {
  const { radius = "xl", elevation = "1", tone = "neutral" } = opts
  const r = RADIUS_CLASS[radius]
  switch (variant) {
    case "glinr":
      return liftShell({ radius, elevation })
    case "plain":
      return PLAIN_CONTAINER
    case "solid":
      return `${r} border border-[color:var(--color-border)] bg-[var(--surface-1)] text-[color:var(--color-foreground)] [box-shadow:var(--solid-elev-1)]`
    case "gradient":
      return `${liftShell({ radius, elevation })} [background:linear-gradient(135deg,color-mix(in_oklab,var(--gradient-from)_16%,var(--surface-1)),color-mix(in_oklab,var(--gradient-to)_12%,var(--surface-1)))_padding-box,var(--ring)_border-box]`
    case "soft":
    case "outline":
    case "ghost":
    case "glass":
      return `${surfaceVariants({ variant, tone, elevation: variant === "glass" || variant === "soft" ? "auto" : "none" })} ${r}`
  }
}
