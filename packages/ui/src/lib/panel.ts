import { cva, type VariantProps } from "class-variance-authority"

import type { GlinStyle } from "./glin-config"
import { resolveVariant, type SurfaceVariant } from "./surface"

/**
 * Floating panel surface shared by dialogs, sheets, popovers, menus, hover cards,
 * command palettes and navigation viewports. Spec: docs-local/variant-system.md
 *
 * Every string is a complete literal so Tailwind can see it. Colours come from tokens only,
 * so a panel adapts to the nearest theme scope with no `dark:` utilities.
 *
 * Panels publish `--panel-item-*` custom properties; menu items read them, so the highlighted
 * item of a `glinr` panel is a raised pill and in every other look a flat wash.
 */

/** Variant names accepted by panel components: the vocabulary plus legacy aliases. */
export type PanelVariantProp = SurfaceVariant | "default" | "frosted" | "matte" | "liquid"

/**
 * Resolves the look of a panel. An omitted variant or "default" follows the ambient style
 * (glinr, plain or glass). Legacy `frosted` and `liquid` map to `glass`, `matte` maps to `solid`.
 */
export function resolvePanelVariant(variantProp: PanelVariantProp | null | undefined, ambientStyle: GlinStyle = "glinr"): SurfaceVariant {
  if (variantProp === "matte") return "solid"
  if (variantProp === "liquid") return "glass"
  return resolveVariant(variantProp, ambientStyle, "overlay")
}

const ITEM_RAISED =
  "[--panel-item-bg:var(--sheen)_padding-box,linear-gradient(var(--face-3,var(--surface-3)),var(--face-3,var(--surface-3)))_padding-box,var(--ring)_border-box] [--panel-item-shadow:var(--elev-1)] [--panel-item-r:0.5rem]"
const ITEM_WASH =
  "[--panel-item-bg:color-mix(in_oklab,var(--color-foreground)_8%,transparent)] [--panel-item-shadow:none] [--panel-item-r:0.5rem]"

/** Only the `--panel-item-*` custom properties, for rows that live outside a panel (menubar and navigation triggers). */
export const panelItemTone = cva("", {
  variants: {
    variant: {
      glinr: ITEM_RAISED,
      plain: "[--panel-item-bg:var(--surface-2)] [--panel-item-shadow:none] [--panel-item-r:0.25rem]",
      solid: ITEM_WASH,
      soft: ITEM_WASH,
      outline: ITEM_WASH,
      ghost: ITEM_WASH,
      gradient: ITEM_RAISED,
      glass: ITEM_WASH
    }
  },
  defaultVariants: { variant: "glinr" }
})

export const panelSurface = cva("text-[color:var(--color-foreground)]", {
  variants: {
    variant: {
      glinr: `border border-transparent [--face:var(--face-1,var(--surface-1))] [--ring-img:var(--ring)] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-3)] ${ITEM_RAISED}`,
      plain:
        "border border-[color:var(--color-border)] bg-[var(--surface-1)] shadow-md [--panel-item-bg:var(--surface-2)] [--panel-item-shadow:none] [--panel-item-r:0.25rem]",
      solid: `border border-transparent [--face:var(--surface-2)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.05),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-solid)_border-box] [box-shadow:var(--solid-elev-3)] ${ITEM_WASH}`,
      soft: `border border-transparent [--face:var(--surface-2)] [background:linear-gradient(180deg,rgb(255_255_255_/_0.08),transparent)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring)_border-box] [box-shadow:var(--elev-2)] ${ITEM_WASH}`,
      outline: `border border-[color:color-mix(in_oklab,var(--color-foreground)_22%,transparent)] bg-[var(--surface-1)] shadow-none ${ITEM_WASH}`,
      ghost: `border border-transparent bg-[var(--surface-1)] [box-shadow:var(--elev-3)] ${ITEM_WASH}`,
      gradient: `border border-transparent [--face:var(--face-1,var(--surface-1))] [--ring-img:linear-gradient(135deg,var(--gradient-from),var(--gradient-to))] [background:var(--sheen)_padding-box,linear-gradient(var(--face),var(--face))_padding-box,var(--ring-img)_border-box] [box-shadow:var(--elev-3)] ${ITEM_RAISED}`,
      glass: `border border-[color:var(--glass-border)] [border-top-color:var(--glass-refraction-top)] bg-[color-mix(in_oklab,var(--surface-1)_88%,transparent)] bg-clip-padding backdrop-blur-xl backdrop-saturate-[180%] [box-shadow:var(--elev-3)] [@media(prefers-reduced-transparency:reduce)]:bg-[var(--surface-1)] [@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none ${ITEM_WASH}`
    },
    shape: {
      menu: "rounded-xl",
      popover: "rounded-xl",
      dialog: "rounded-2xl",
      none: ""
    }
  },
  compoundVariants: [
    { variant: "plain", shape: "menu", class: "rounded-md" },
    { variant: "plain", shape: "popover", class: "rounded-md" },
    { variant: "plain", shape: "dialog", class: "rounded-lg" }
  ],
  defaultVariants: { variant: "glinr", shape: "popover" }
})

export type PanelSurfaceProps = VariantProps<typeof panelSurface>

/** Interactive row inside a menu-like panel (dropdown, context menu, menubar, command, navigation). */
export const PANEL_ITEM =
  "relative flex cursor-default select-none items-center gap-2 rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-2 py-1.5 outline-none transition-[background-color,box-shadow,color] duration-fast motion-reduce:transition-none data-[highlighted]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[highlighted]:[box-shadow:var(--panel-item-shadow,none)] data-[highlighted]:text-[color:var(--color-foreground)] [@media(pointer:coarse)]:min-h-11 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"

/** Same row look for cmdk (`data-selected`) and other non-Radix lists. */
export const PANEL_ITEM_SELECTABLE =
  "relative flex cursor-default select-none items-center gap-2 rounded-[var(--panel-item-r,0.5rem)] border border-transparent px-2 py-1.5 outline-none transition-[background-color,box-shadow,color] duration-fast motion-reduce:transition-none data-[selected=true]:[background:var(--panel-item-bg,color-mix(in_oklab,var(--color-foreground)_8%,transparent))] data-[selected=true]:[box-shadow:var(--panel-item-shadow,none)] data-[selected=true]:text-[color:var(--color-foreground)] [@media(pointer:coarse)]:min-h-11 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

export const PANEL_SEPARATOR = "my-1 h-px bg-[color:var(--line-soft)]"

/** Open and close animation shared by every floating panel (respects reduced motion). */
export const PANEL_MOTION =
  "[--tw-duration:var(--motion-overlay-in)] ease-[var(--ease-out)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=closed]:[--tw-duration:var(--motion-overlay-out)] data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
