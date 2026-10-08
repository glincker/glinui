import { newComponentIds, type ComponentId } from "@/lib/primitives"
import { categories, type CategoryId, type ComponentTag } from "@/lib/taxonomy"

export type GalleryCategory = CategoryId
export type GalleryTag = Extract<ComponentTag, "animated" | "webgl" | "ai" | "glass" | "new" | "adapted">

/** Categories in display order, sourced from the taxonomy. */
export const galleryCategoryOrder: GalleryCategory[] = categories.map((category) => category.id)

/** Tag filter chips, in display order. */
export const galleryTagOptions: ReadonlyArray<{ id: GalleryTag; label: string }> = [
  { id: "animated", label: "Animated" },
  { id: "webgl", label: "WebGL" },
  { id: "ai", label: "AI" },
  { id: "glass", label: "Glass" },
  { id: "new", label: "New" },
  { id: "adapted", label: "Adapted" }
]

export type GalleryItem = {
  id: ComponentId
  title: string
  description: string
  href: string
  category: GalleryCategory
  kind: "primitive" | "signature"
  maturity: "stable" | "beta"
  isNew: boolean
  order: number
  tags: ComponentTag[]
  family?: string
  /** True when this item is the family base and the family has more than one member. */
  hasVariants: boolean
  /** Number of siblings beneath the base (family size minus one). */
  variantCount: number
  /** Name of the upstream project when the component is adapted from one. */
  adaptedFrom?: string
}

export type GallerySort = "default" | "az"

/** Recently added components that get a "New" tag: the whole 2026 expansion. */
export const NEW_COMPONENT_IDS: readonly ComponentId[] = newComponentIds

/** Previews driven by CSS keyframes: rendered always, paused until hover or focus. */
export const CSS_ANIMATED_IDS: ReadonlySet<string> = new Set([
  "marquee",
  "meteor-shower",
  "orbiting-circles",
  "border-beam",
  "ripple",
  "retro-grid",
  "aurora-background",
  "animated-gradient",
  "glow-border",
  "pulsating-button",
  "shimmer-button",
  "gradient-mesh",
  "light-leak",
  "prism-border",
  "chromatic-text",
  "liquid-button"
])

/** Previews driven by JS timers or canvas: a static still is shown until hover or focus mounts the live demo. */
export const LIVE_ON_HOVER_IDS: ReadonlySet<string> = new Set(["typewriter", "word-rotate", "number-ticker", "particle-field"])
