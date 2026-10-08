import { cn } from "@glinui/ui"

import { BRANDS, type BrandName } from "./brands"
import { BRAND_MODULES } from "./brand-modules"
import { sanitizeBrandSvg } from "./brand-sanitize"

export type BrandVariant = "auto" | "default" | "mono" | "light" | "dark"
export type BrandSize = "sm" | "md" | "lg" | "xl" | 12 | 14 | 16 | 18 | 20 | 24 | 28 | 32 | 40 | 48

/** Static class map so Tailwind can see every size. No style attributes. */
const SIZE_CLASS: Record<string, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-7",
  xl: "size-10",
  "12": "size-3",
  "14": "size-3.5",
  "16": "size-4",
  "18": "size-[18px]",
  "20": "size-5",
  "24": "size-6",
  "28": "size-7",
  "32": "size-8",
  "40": "size-10",
  "48": "size-12"
}

type VariantKey = "default" | "mono" | "light" | "dark"

const cache = new Map<string, string>()

/** thesvg variants: `light` is drawn for light backgrounds, `dark` for dark backgrounds. */
function markup(name: BrandName, key: VariantKey): string {
  const cacheKey = `${name}:${key}`
  const hit = cache.get(cacheKey)
  if (hit !== undefined) return hit
  const mod = BRAND_MODULES[name]
  const raw = key === "default" ? mod.svg : mod.variants?.[key]
  const html = raw
    ? sanitizeBrandSvg(raw, { prefix: `bi-${name.replace(/[^a-z0-9]/g, "")}-${key}`, currentColor: key === "mono" })
    : ""
  cache.set(cacheKey, html)
  return html
}

function has(name: BrandName, key: VariantKey): boolean {
  return markup(name, key) !== ""
}

function Layer({ html, className }: { html: string; className?: string }) {
  return <span aria-hidden className={cn("block size-full", className)} dangerouslySetInnerHTML={{ __html: html }} />
}

/** Full color mark that swaps between thesvg light/dark variants with CSS only. */
function ColorLayers({ name, extra }: { name: BrandName; extra?: string }) {
  if (has(name, "light") && has(name, "dark")) {
    return (
      <>
        <Layer html={markup(name, "light")} className={cn("dark:hidden", extra)} />
        <Layer html={markup(name, "dark")} className={cn("hidden dark:block", extra)} />
      </>
    )
  }
  return <Layer html={markup(name, "default")} className={extra} />
}

export type BrandIconProps = {
  name: BrandName
  size?: BrandSize
  /**
   * auto: full color, adapts to the theme (default). mono: currentColor silhouette (falls back to auto
   * when the brand has no mono mark). default | light | dark force one thesvg variant.
   */
  variant?: BrandVariant
  /**
   * Mono at rest, full color on hover or focus of the nearest `group/brand` ancestor. Opacity only,
   * and the swap is instant under reduced motion.
   */
  reveal?: boolean
  /** Accessible name. Omit when adjacent text already names the brand (the icon is then decorative). */
  title?: string
  className?: string
}

export function BrandIcon({ name, size = "md", variant = "auto", reveal = false, title, className }: BrandIconProps) {
  const meta = BRANDS[name]
  const sizeClass = SIZE_CLASS[String(size)] ?? "size-5"
  const tile = meta.needsTile && variant !== "mono" ? "dark:rounded-md dark:bg-white/90 dark:p-[10%]" : undefined
  const a11y = title ? ({ role: "img", "aria-label": title } as const) : ({ "aria-hidden": true } as const)
  const base = cn("relative inline-block shrink-0 align-middle", sizeClass, className)

  if (variant === "mono" || (reveal && has(name, "mono"))) {
    if (has(name, "mono")) {
      if (reveal) {
        return (
          <span {...a11y} className={base}>
            <Layer
              html={markup(name, "mono")}
              className="transition-opacity duration-200 group-hover/brand:opacity-0 group-focus-visible/brand:opacity-0 motion-reduce:transition-none"
            />
            <span
              aria-hidden
              className={cn(
                "absolute inset-0 opacity-0 transition-opacity duration-200 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100 motion-reduce:transition-none",
                tile
              )}
            >
              <ColorLayers name={name} />
            </span>
          </span>
        )
      }
      return (
        <span {...a11y} className={base}>
          <Layer html={markup(name, "mono")} />
        </span>
      )
    }
  }

  if (variant === "default" || variant === "light" || variant === "dark") {
    const key: VariantKey = has(name, variant) ? variant : "default"
    return (
      <span {...a11y} className={base}>
        <Layer html={markup(name, key)} />
      </span>
    )
  }

  if (reveal) {
    // No mono mark in thesvg for this brand: dim the color mark at rest instead.
    return (
      <span {...a11y} className={cn(base, tile)}>
        <ColorLayers
          name={name}
          extra="opacity-60 transition-opacity duration-200 group-hover/brand:opacity-100 group-focus-visible/brand:opacity-100 motion-reduce:transition-none"
        />
      </span>
    )
  }

  return (
    <span {...a11y} className={cn(base, tile)}>
      <ColorLayers name={name} />
    </span>
  )
}
