import * as React from "react"
import { cva } from "class-variance-authority"

import { useGlinStyle } from "../components/glin-provider"
import type { GlinStyle } from "./glin-config"
import { resolveVariant } from "./surface"

/**
 * Shared look for form controls (input, textarea, select, input group, OTP, combobox trigger).
 * Spec: docs-local/variant-system.md and design-dna.md.
 *
 * glinr   = inset well (liftWell face + elev-inset) inside a gradient hairline ring.
 * plain   = shadcn: 1px border, transparent fill, small radius.
 * solid / soft / outline / ghost / glass = vocabulary variants.
 * liquid / matte / underline / filled stay as component-specific legacy looks.
 */

export type ControlVariant =
  | "glinr"
  | "solid"
  | "plain"
  | "soft"
  | "outline"
  | "ghost"
  | "glass"
  | "liquid"
  | "matte"
  | "underline"
  | "filled"

/** Everything a consumer may pass: the resolved names plus ambient and legacy aliases. */
export type ControlVariantProp = ControlVariant | "default" | "frosted" | "gradient"

export const CONTROL_LEGACY_VARIANTS: readonly ControlVariant[] = ["liquid", "matte", "underline", "filled"]

/**
 * Resolves a control variant. Explicit names win; `default` or nothing follows the ambient style
 * (glinr -> glinr, minimal -> plain, glass -> glass); `frosted` is the glass alias; `gradient` has
 * no control look and maps to glinr. `allowed` lets a component limit the names it implements,
 * anything else falls back to the ambient default.
 */
export function resolveControlVariant(variantProp: string | null | undefined, ambientStyle?: GlinStyle): ControlVariant
export function resolveControlVariant<T extends ControlVariant>(
  variantProp: string | null | undefined,
  ambientStyle: GlinStyle,
  allowed: readonly T[]
): T
export function resolveControlVariant(
  variantProp: string | null | undefined,
  ambientStyle: GlinStyle = "glinr",
  allowed?: readonly ControlVariant[]
): ControlVariant {
  const ambient = resolveVariant(undefined, ambientStyle, "control")
  const fallback: ControlVariant = ambient === "glass" || ambient === "plain" ? ambient : "glinr"
  let resolved: ControlVariant
  if (variantProp && (CONTROL_LEGACY_VARIANTS as readonly string[]).includes(variantProp)) {
    resolved = variantProp as ControlVariant
  } else {
    const surface = resolveVariant(variantProp, ambientStyle, "control")
    resolved = surface === "gradient" ? "glinr" : (surface as ControlVariant)
  }
  if (allowed && !allowed.includes(resolved)) return allowed.includes(fallback) ? fallback : (allowed[0] ?? fallback)
  return resolved
}

/** Hook form of `resolveControlVariant`, reading the ambient `GlinProvider` style. */
export function useControlVariant(variantProp: string | null | undefined): ControlVariant
export function useControlVariant<T extends ControlVariant>(variantProp: string | null | undefined, allowed: readonly T[]): T
export function useControlVariant(
  variantProp: string | null | undefined,
  allowed?: readonly ControlVariant[]
): ControlVariant {
  const style = useGlinStyle()
  return React.useMemo(
    () => (allowed ? resolveControlVariant(variantProp, style, allowed) : resolveControlVariant(variantProp, style)),
    [variantProp, style, allowed]
  )
}

/** Text-like field surface (input, textarea, select). Add a size class from the component. */
export const textControlVariants = cva(
  "w-full border font-medium text-[color:var(--color-foreground)] placeholder:text-[color:var(--color-muted)] transition-[background-color,border-color,box-shadow,color] duration-fast ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--surface-0)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none aria-[invalid=true]:border-[color:var(--tone-danger)] aria-[invalid=true]:[--ring-img:var(--tone-danger)] aria-[invalid=true]:focus-visible:ring-[color:var(--tone-danger)]",
  {
    variants: {
      variant: {
        glinr:
          "rounded-xl border-transparent [--well:var(--surface-well)] [--ring-img:var(--ring)] [background:linear-gradient(var(--well),var(--well))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-inset)] hover:[--ring-img:var(--ring-hot,var(--ring))] disabled:[--well:var(--surface-2)] focus-visible:ring-[color:var(--color-accent)]",
        solid:
          "rounded-xl border-[color:var(--color-border)] bg-[var(--surface-3)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)] hover:bg-[color-mix(in_oklab,var(--surface-3)_90%,var(--color-foreground))] focus-visible:ring-[color:var(--color-accent)]",
        plain:
          "rounded-md border-[color:var(--color-border)] bg-transparent shadow-sm hover:border-[color:color-mix(in_oklab,var(--color-foreground)_35%,transparent)] focus-visible:border-[color:var(--color-foreground)] focus-visible:ring-[color:color-mix(in_oklab,var(--color-foreground)_20%,transparent)]",
        soft:
          "rounded-xl border-transparent bg-[var(--surface-2)] shadow-[inset_0_0_0_1px_var(--line-soft)] hover:bg-[var(--surface-3)] focus-visible:ring-[color:var(--color-accent)]",
        outline:
          "rounded-xl border-[color:color-mix(in_oklab,var(--color-foreground)_30%,transparent)] bg-transparent hover:border-[color:color-mix(in_oklab,var(--color-foreground)_50%,transparent)] focus-visible:border-[color:var(--color-accent)] focus-visible:ring-[color:var(--color-accent)]",
        ghost:
          "rounded-xl border-transparent bg-transparent hover:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--color-foreground)_7%,transparent)] focus-visible:ring-[color:var(--color-accent)]",
        glass:
          "relative rounded-xl border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[var(--glass-readable)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] hover:border-[color:var(--glass-border-strong)] focus-visible:ring-[color:var(--color-accent)]",
        liquid:
          "relative rounded-xl border-white/[0.24] [border-top-color:var(--glass-refraction-top)] bg-[radial-gradient(circle_at_18%_12%,rgb(255_255_255_/_0.92),transparent_42%),radial-gradient(circle_at_84%_88%,rgb(226_232_240_/_0.58),transparent_58%),linear-gradient(145deg,rgb(255_255_255_/_0.82),rgb(235_241_246_/_0.55))] backdrop-blur-xl backdrop-saturate-[180%] shadow-[0_0_0_1px_rgb(255_255_255_/_0.24)_inset,0_10px_20px_-14px_rgb(15_23_42_/_0.26)] hover:border-white/[0.34] focus-visible:ring-[color:var(--color-accent)] dark:border-white/[0.12] dark:bg-[linear-gradient(145deg,rgb(255_255_255_/_0.13),rgb(255_255_255_/_0.05))]",
        matte:
          "rounded-xl border-black/[0.12] bg-[linear-gradient(180deg,rgb(249_250_251),rgb(237_239_242))] text-neutral-900 placeholder:text-neutral-600 shadow-[0_1px_0_rgb(255_255_255_/_0.88)_inset,0_6px_14px_-12px_rgb(15_23_42_/_0.24)] hover:border-black/[0.16] focus-visible:ring-[color:var(--color-accent)] dark:border-white/[0.14] dark:bg-[linear-gradient(180deg,rgb(49_54_63_/_0.92),rgb(34_38_46_/_0.92))] dark:text-neutral-50 dark:placeholder:text-neutral-300",
        underline:
          "rounded-none border-x-0 border-t-0 border-b-[color:var(--color-border)] bg-transparent px-0 shadow-none hover:border-b-[color:color-mix(in_oklab,var(--color-foreground)_40%,transparent)] focus-visible:border-b-[color:var(--color-accent)] focus-visible:ring-0 focus-visible:ring-offset-0",
        filled:
          "rounded-xl border-transparent bg-[color-mix(in_oklab,var(--color-foreground)_8%,transparent)] hover:bg-[color-mix(in_oklab,var(--color-foreground)_11%,transparent)] focus-visible:bg-[color-mix(in_oklab,var(--color-foreground)_11%,transparent)] focus-visible:ring-[color:var(--color-accent)]"
      }
    },
    defaultVariants: { variant: "glinr" }
  }
)

/** Shared field height / padding per size. sm/md/lg = h-8/h-9/h-10. */
export const CONTROL_SIZE_CLASSES = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm"
} as const

export type ControlSize = keyof typeof CONTROL_SIZE_CLASSES
