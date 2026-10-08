import { cva, type VariantProps } from "class-variance-authority"

import type { GlinStyle } from "./glin-config"

/**
 * Shared variant vocabulary for every component that has a surface.
 * Spec: docs-local/variant-system.md
 *
 * Tone classes only assign local custom properties (--t-*); variant classes
 * read them. All colours come from tokens, so a surface adapts to the nearest
 * theme scope (.dark, [data-glin-theme]) with no `dark:` utilities.
 */

export const SURFACE_VARIANTS = ["glinr", "solid", "plain", "soft", "outline", "ghost", "gradient", "glass"] as const
export const SURFACE_TONES = ["neutral", "accent", "success", "warning", "danger", "info"] as const
export const SURFACE_ELEVATIONS = ["auto", "none", "1", "2", "3"] as const

export type SurfaceVariant = (typeof SURFACE_VARIANTS)[number]
export type SurfaceTone = (typeof SURFACE_TONES)[number]
export type SurfaceElevation = (typeof SURFACE_ELEVATIONS)[number]

/** Legacy variant names mapped to the vocabulary (extra looks like liquid, matte, frosted stay component-specific). */
export const SURFACE_VARIANT_ALIASES: Readonly<Record<string, { variant: SurfaceVariant; tone?: SurfaceTone }>> = {
  default: { variant: "solid" },
  primary: { variant: "solid", tone: "accent" },
  secondary: { variant: "soft" },
  destructive: { variant: "solid", tone: "danger" },
  success: { variant: "soft", tone: "success" },
  warning: { variant: "soft", tone: "warning" },
  info: { variant: "soft", tone: "info" },
  raised: { variant: "soft" },
  frosted: { variant: "glass" }
}

export function resolveSurfaceVariant(
  name: string | null | undefined,
  fallback: SurfaceVariant = "solid"
): { variant: SurfaceVariant; tone?: SurfaceTone } {
  if (!name) return { variant: fallback }
  if ((SURFACE_VARIANTS as readonly string[]).includes(name)) return { variant: name as SurfaceVariant }
  return SURFACE_VARIANT_ALIASES[name] ?? { variant: fallback }
}

export type ComponentKind = "container" | "control" | "key" | "overlay" | "signature"

/** Default variant per design style, used when a component has no explicit `variant`. */
export const STYLE_DEFAULT_VARIANT: Readonly<Record<GlinStyle, SurfaceVariant>> = {
  glinr: "glinr",
  minimal: "plain",
  glass: "glass"
}

/**
 * Picks the variant to render. An explicit variant wins (legacy names resolve through the alias map);
 * no variant, or the legacy placeholder "default", falls back to the ambient design style.
 * `kind` is accepted so a style can diverge per component kind later without changing call sites.
 */
export function resolveVariant(
  variantProp: string | null | undefined,
  ambientStyle: GlinStyle = "glinr",
  kind: ComponentKind = "container"
): SurfaceVariant {
  void kind
  if (!variantProp || variantProp === "default") return STYLE_DEFAULT_VARIANT[ambientStyle]
  return resolveSurfaceVariant(variantProp, STYLE_DEFAULT_VARIANT[ambientStyle]).variant
}

/**
 * Tone classes assign the --t-* custom properties read by every variant:
 * bg/bg-hover/bg-active (solid fill), fg (text on fill), text (text on soft, outline, ghost),
 * soft/soft-hover (tinted face), line (hairline), wash (hover tint), ring (hairline image), g1/g2 (gradient stops).
 * Literal strings on purpose: Tailwind scans source text and cannot see built strings.
 */
const TONE_CLASSES: Record<SurfaceTone, string> = {
    neutral: "[--t-bg:var(--neutral-solid)] [--t-bg-hover:var(--neutral-solid-hover)] [--t-bg-active:var(--neutral-solid-active)] [--t-fg:var(--neutral-solid-fg)] [--t-text:var(--color-foreground)] [--t-soft:var(--surface-2)] [--t-soft-hover:var(--surface-3)] [--t-line:color-mix(in_oklab,var(--color-foreground)_22%,transparent)] [--t-wash:color-mix(in_oklab,var(--color-foreground)_7%,transparent)] [--t-ring:var(--ring)] [--t-g1:var(--gradient-from)] [--t-g2:var(--gradient-to)]",
    accent: "[--t-bg:var(--tone-accent)] [--t-bg-hover:color-mix(in_oklab,var(--tone-accent)_88%,white)] [--t-bg-active:color-mix(in_oklab,var(--tone-accent)_88%,black)] [--t-fg:var(--tone-accent-fg)] [--t-text:var(--tone-accent-text)] [--t-soft:color-mix(in_oklab,var(--tone-accent)_12%,var(--surface-1))] [--t-soft-hover:color-mix(in_oklab,var(--tone-accent)_18%,var(--surface-1))] [--t-line:color-mix(in_oklab,var(--tone-accent)_38%,transparent)] [--t-wash:color-mix(in_oklab,var(--tone-accent)_10%,transparent)] [--t-ring:linear-gradient(180deg,color-mix(in_oklab,var(--tone-accent)_55%,transparent),color-mix(in_oklab,var(--tone-accent)_24%,transparent))] [--t-g1:var(--gradient-from)] [--t-g2:var(--gradient-to)]",
    success: "[--t-bg:var(--tone-success)] [--t-bg-hover:color-mix(in_oklab,var(--tone-success)_88%,white)] [--t-bg-active:color-mix(in_oklab,var(--tone-success)_88%,black)] [--t-fg:var(--tone-success-fg)] [--t-text:var(--tone-success-text)] [--t-soft:color-mix(in_oklab,var(--tone-success)_12%,var(--surface-1))] [--t-soft-hover:color-mix(in_oklab,var(--tone-success)_18%,var(--surface-1))] [--t-line:color-mix(in_oklab,var(--tone-success)_38%,transparent)] [--t-wash:color-mix(in_oklab,var(--tone-success)_10%,transparent)] [--t-ring:linear-gradient(180deg,color-mix(in_oklab,var(--tone-success)_55%,transparent),color-mix(in_oklab,var(--tone-success)_24%,transparent))] [--t-g1:color-mix(in_oklab,var(--tone-success)_100%,black_6%)] [--t-g2:color-mix(in_oklab,var(--tone-success)_100%,black_34%)]",
    warning: "[--t-bg:var(--tone-warning)] [--t-bg-hover:color-mix(in_oklab,var(--tone-warning)_88%,white)] [--t-bg-active:color-mix(in_oklab,var(--tone-warning)_88%,black)] [--t-fg:var(--tone-warning-fg)] [--t-text:var(--tone-warning-text)] [--t-soft:color-mix(in_oklab,var(--tone-warning)_12%,var(--surface-1))] [--t-soft-hover:color-mix(in_oklab,var(--tone-warning)_18%,var(--surface-1))] [--t-line:color-mix(in_oklab,var(--tone-warning)_38%,transparent)] [--t-wash:color-mix(in_oklab,var(--tone-warning)_10%,transparent)] [--t-ring:linear-gradient(180deg,color-mix(in_oklab,var(--tone-warning)_55%,transparent),color-mix(in_oklab,var(--tone-warning)_24%,transparent))] [--t-g1:color-mix(in_oklab,var(--tone-warning)_100%,black_30%)] [--t-g2:color-mix(in_oklab,var(--tone-warning)_100%,black_48%)]",
    danger: "[--t-bg:var(--tone-danger)] [--t-bg-hover:color-mix(in_oklab,var(--tone-danger)_88%,white)] [--t-bg-active:color-mix(in_oklab,var(--tone-danger)_88%,black)] [--t-fg:var(--tone-danger-fg)] [--t-text:var(--tone-danger-text)] [--t-soft:color-mix(in_oklab,var(--tone-danger)_12%,var(--surface-1))] [--t-soft-hover:color-mix(in_oklab,var(--tone-danger)_18%,var(--surface-1))] [--t-line:color-mix(in_oklab,var(--tone-danger)_38%,transparent)] [--t-wash:color-mix(in_oklab,var(--tone-danger)_10%,transparent)] [--t-ring:linear-gradient(180deg,color-mix(in_oklab,var(--tone-danger)_55%,transparent),color-mix(in_oklab,var(--tone-danger)_24%,transparent))] [--t-g1:color-mix(in_oklab,var(--tone-danger)_100%,black_6%)] [--t-g2:color-mix(in_oklab,var(--tone-danger)_100%,black_34%)]",
    info: "[--t-bg:var(--tone-info)] [--t-bg-hover:color-mix(in_oklab,var(--tone-info)_88%,white)] [--t-bg-active:color-mix(in_oklab,var(--tone-info)_88%,black)] [--t-fg:var(--tone-info-fg)] [--t-text:var(--tone-info-text)] [--t-soft:color-mix(in_oklab,var(--tone-info)_12%,var(--surface-1))] [--t-soft-hover:color-mix(in_oklab,var(--tone-info)_18%,var(--surface-1))] [--t-line:color-mix(in_oklab,var(--tone-info)_38%,transparent)] [--t-wash:color-mix(in_oklab,var(--tone-info)_10%,transparent)] [--t-ring:linear-gradient(180deg,color-mix(in_oklab,var(--tone-info)_55%,transparent),color-mix(in_oklab,var(--tone-info)_24%,transparent))] [--t-g1:color-mix(in_oklab,var(--tone-info)_100%,black_6%)] [--t-g2:color-mix(in_oklab,var(--tone-info)_100%,black_34%)]"
}

const FOCUS_ACCENT =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)]"
const PRESS = "active:scale-[0.98] motion-reduce:active:scale-100"

export const surfaceVariants = cva("border border-transparent", {
  variants: {
    variant: {
      glinr:
        "[--face:var(--face-1,var(--surface-1))] text-[color:var(--t-text)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--t-ring)_border-box] [--sh-1:var(--elev-1)] [--sh-2:var(--elev-2)] [--sh-3:var(--elev-3)]",
      solid:
        "[--face:var(--t-bg)] text-[color:var(--t-fg)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.12),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-solid)_border-box] [--sh-1:var(--solid-elev-1)] [--sh-2:var(--solid-elev-2)] [--sh-3:var(--solid-elev-3)]",
      plain:
        "rounded-md border-[color:var(--t-bg)] bg-[var(--t-bg)] text-sm font-medium text-[color:var(--t-fg)] [--sh-1:none] [--sh-2:var(--shadow-glass-sm)] [--sh-3:var(--shadow-glass-sm)]",
      soft:
        "[--face:var(--t-soft)] text-[color:var(--t-text)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.08),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--t-ring)_border-box] [--sh-1:var(--elev-1)] [--sh-2:var(--elev-2)] [--sh-3:var(--elev-3)]",
      outline:
        "border-[color:var(--t-line)] bg-transparent text-[color:var(--t-text)] [--sh-1:none] [--sh-2:var(--elev-1)] [--sh-3:var(--elev-2)]",
      ghost:
        "bg-transparent text-[color:var(--t-text)] [--sh-1:none] [--sh-2:var(--elev-1)] [--sh-3:var(--elev-2)]",
      gradient:
        "text-white [background:linear-gradient(180deg,rgb(255_255_255_/_0.16),transparent)_padding-box,linear-gradient(135deg,var(--t-g1),var(--t-g2))_padding-box,var(--ring-solid)_border-box] [--sh-1:var(--solid-elev-1)] [--sh-2:var(--solid-elev-2)] [--sh-3:var(--solid-elev-3)]",
      glass:
        "relative isolate border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding text-[color:var(--color-foreground)] backdrop-blur-xl backdrop-saturate-[180%] [--sh-1:var(--glass-2-shadow)] [--sh-2:var(--glass-3-shadow)] [--sh-3:var(--glass-4-shadow)]"
    },
    tone: TONE_CLASSES,
    elevation: {
      auto: "",
      none: "shadow-none",
      "1": "[box-shadow:var(--sh-1)]",
      "2": "[box-shadow:var(--sh-2)]",
      "3": "[box-shadow:var(--sh-3)]"
    }
  },
  compoundVariants: [
    { variant: ["glinr", "solid", "soft", "gradient", "glass"], elevation: "auto", class: "[box-shadow:var(--sh-1)]" },
    { variant: "glass", tone: ["success", "warning", "danger", "info", "accent"], class: "text-[color:var(--t-text)]" }
  ],
  defaultVariants: { variant: "glinr", tone: "neutral", elevation: "auto" }
})

export type SurfaceVariantProps = VariantProps<typeof surfaceVariants>

/** Hover, press, focus ring and disabled behavior. Compose after `surfaceVariants` with the same `variant`. */
export const interactiveSurface = cva(
  "transition-[transform,box-shadow,color,background-color,border-color,filter] duration-fast ease-standard motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        glinr: `${FOCUS_ACCENT} ${PRESS} hover:[--ring-img:var(--ring-hot,var(--ring))] hover:[--face:var(--face-2,var(--surface-2))] active:[--face:var(--surface-well)] active:[box-shadow:var(--elev-inset)]`,
        solid: `${FOCUS_ACCENT} ${PRESS} hover:[--face:var(--t-bg-hover)] active:[--face:var(--t-bg-active)] active:[box-shadow:var(--solid-elev-inset)]`,
        plain:
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] hover:bg-[color-mix(in_oklab,var(--t-bg)_90%,transparent)]",
        soft: `${FOCUS_ACCENT} ${PRESS} hover:[--face:var(--t-soft-hover)] active:[box-shadow:var(--elev-inset)]`,
        outline: `${FOCUS_ACCENT} ${PRESS} hover:bg-[var(--t-wash)] active:bg-[var(--t-wash)]`,
        ghost: `${FOCUS_ACCENT} ${PRESS} hover:bg-[var(--t-wash)] active:bg-[var(--t-wash)]`,
        gradient: `${FOCUS_ACCENT} ${PRESS} hover:brightness-110 active:brightness-95 active:[box-shadow:var(--solid-elev-inset)]`,
        glass: `${FOCUS_ACCENT} ${PRESS} hover:border-[color:var(--glass-border-strong)] hover:brightness-105 active:brightness-95`
      }
    },
    defaultVariants: { variant: "glinr" }
  }
)

export type InteractiveSurfaceProps = VariantProps<typeof interactiveSurface>
