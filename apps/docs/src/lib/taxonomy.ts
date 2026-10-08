import { getRegistryItem } from "@glinui/registry"
import {
  aiComponentIds,
  allComponentIds,
  componentTitles,
  newComponentIds,
  primitiveComponentIds,
  primitiveMaturity,
  signatureComponentIds
} from "./primitives"

/**
 * Single source of truth for how components are grouped in the sidebar, gallery,
 * command palette and "Related" strip. Categories answer "what job do I need done",
 * families group a base primitive with its animated and variant siblings.
 *
 * Adding a component: add its id to a `family(...)` or `single(...)` line below.
 * Ids that are not listed fall back to the `motion` category and the taxonomy test fails.
 */

export type CategoryId =
  | "buttons"
  | "text"
  | "backgrounds"
  | "cards"
  | "navigation"
  | "forms"
  | "overlays"
  | "feedback"
  | "data"
  | "layout"
  | "blocks"
  | "ai"
  | "motion"

export type ComponentTag = "primitive" | "animated" | "webgl" | "ai" | "glass" | "new" | "beta" | "adapted" | "block"

export type Category = {
  id: CategoryId
  title: string
  description: string
  /** Phosphor icon name, resolved in components/layout/category-icons.tsx. */
  icon: string
  order: number
}

export type TaxonomyEntry = {
  category: CategoryId
  tags: ComponentTag[]
  family?: string
  base?: boolean
}

export const FALLBACK_CATEGORY: CategoryId = "motion"

export const categories: readonly Category[] = [
  { id: "buttons", title: "Buttons", description: "Things you press: buttons, toggles and calls to action.", icon: "CursorClick", order: 1 },
  { id: "text", title: "Text and code", description: "Static type, animated text, code and keyboard hints.", icon: "TextAa", order: 2 },
  { id: "backgrounds", title: "Backgrounds", description: "Ambient surfaces and decoration behind your content.", icon: "Gradient", order: 3 },
  { id: "cards", title: "Cards and borders", description: "Containers, panels and animated borders.", icon: "Cards", order: 4 },
  { id: "navigation", title: "Navigation", description: "Wayfinding: menus, tabs, breadcrumbs and docks.", icon: "Compass", order: 5 },
  { id: "forms", title: "Forms and inputs", description: "Collect data with accessible controls.", icon: "Textbox", order: 6 },
  { id: "overlays", title: "Overlays and menus", description: "Dialogs, popovers, sheets and menus that sit above the page.", icon: "Stack", order: 7 },
  { id: "feedback", title: "Feedback and status", description: "Alerts, toasts, loading and empty states.", icon: "Bell", order: 8 },
  { id: "data", title: "Data display", description: "Show records, metrics and identity.", icon: "Table", order: 9 },
  { id: "layout", title: "Layout and structure", description: "Arrange, separate and disclose content.", icon: "SquaresFour", order: 10 },
  { id: "blocks", title: "Blocks", description: "Page-level sections composed from Glin primitives: hero, pricing, proof, FAQ, CTA and footer.", icon: "Layout", order: 11 },
  { id: "ai", title: "AI", description: "Conversational UI for assistants and agents.", icon: "Sparkle", order: 12 },
  { id: "motion", title: "Motion", description: "Entrance, scroll and ambient motion building blocks.", icon: "Lightning", order: 13 }
]

type Def = { category: CategoryId; family?: string; ids: readonly string[] }

function family(category: CategoryId, name: string, ids: readonly string[]): Def {
  return { category, family: name, ids }
}

function single(category: CategoryId, id: string): Def {
  return { category, ids: [id] }
}

/** Order here is display order: categories group by `categories`, families keep their listed order, base first. */
const definitions: readonly Def[] = [
  // Buttons
  family("buttons", "button", ["button", "shimmer-button", "ripple-button", "pulsating-button", "liquid-button", "magnetic-cta", "interactive-hover-button", "generate-button", "button-group", "copy-button"]),
  family("buttons", "toggle", ["toggle", "toggle-group", "glass-toggle"]),
  // Text and code
  family("text", "text", ["text", "heading", "text-reveal", "reveal-text", "typewriter", "word-rotate", "chromatic-text", "hyper-text", "morphing-text", "sparkles-text", "gradient-text", "gooey-text-reveal", "spinning-text"]),
  family("text", "code", ["code", "code-panel", "install-command", "terminal"]),
  single("text", "kbd"),
  // Backgrounds
  family("backgrounds", "gradient", ["animated-gradient", "gradient-mesh", "aurora-background"]),
  family("backgrounds", "pattern", ["dot-pattern", "retro-grid", "grid-pattern", "flickering-grid"]),
  family("backgrounds", "spotlight", ["spotlight", "blur-spotlight", "light-rays"]),
  family("backgrounds", "particles", ["particle-field", "meteor-shower"]),
  single("backgrounds", "light-leak"),
  single("backgrounds", "ripple"),
  single("backgrounds", "animated-beam"),
  // Cards and borders
  family("cards", "card", ["card", "glass-card", "depth-card", "spotlight-card", "magic-card", "neon-gradient-card"]),
  family("cards", "border", ["glow-border", "border-beam", "border-trail", "prism-border", "shine-border"]),
  single("cards", "bento-grid"),
  single("cards", "icon-frame"),
  single("cards", "highlight-grid"),
  // Navigation
  family("navigation", "navigation-menu", ["navigation-menu", "menubar", "glass-navbar", "glass-dock"]),
  family("navigation", "tabs", ["tabs", "morphing-tabs"]),
  family("navigation", "breadcrumb", ["breadcrumb", "glass-breadcrumb"]),
  single("navigation", "sidebar"),
  single("navigation", "pagination"),
  single("navigation", "link"),
  // Forms and inputs
  family("forms", "input", ["input", "textarea", "input-group", "input-otp"]),
  family("forms", "select", ["select", "combobox"]),
  family("forms", "field", ["field", "label"]),
  single("forms", "checkbox"),
  single("forms", "radio-group"),
  single("forms", "switch"),
  single("forms", "slider"),
  // Overlays and menus
  family("overlays", "modal", ["modal", "alert-dialog", "sheet", "floating-panel"]),
  family("overlays", "popover", ["popover", "hover-card", "tooltip"]),
  family("overlays", "menu", ["dropdown-menu", "context-menu", "command"]),
  // Feedback and status
  family("feedback", "alert", ["alert", "toast"]),
  family("feedback", "loading", ["spinner", "skeleton", "progress"]),
  single("feedback", "empty"),
  single("feedback", "status-dot"),
  // Data display
  family("data", "badge", ["badge", "chip"]),
  family("data", "table", ["table", "data-table"]),
  family("data", "counter", ["counter", "number-ticker"]),
  single("data", "avatar"),
  single("data", "item"),
  single("data", "tree"),
  single("data", "image-comparison"),
  // Layout and structure
  family("layout", "accordion", ["accordion", "collapsible"]),
  single("layout", "scroll-area"),
  single("layout", "separator"),
  single("layout", "aspect-ratio"),
  single("layout", "browser-frame"),
  single("layout", "progressive-blur"),
  family("layout", "carousel", ["cylinder-carousel", "circular-gallery"]),

  family("blocks", "page-sections", ["hero-section", "feature-grid", "pricing-section", "faq-section", "cta-band", "footer-block"]),
  family("blocks", "social-proof", ["logo-cloud", "testimonials-wall"]),
  // AI and chat
  family("ai", "chat", ["message", "bubble", "message-scroller", "prompt-input", "attachment", "questionnaire"]),
  family("ai", "streaming", ["streaming-text", "thinking"]),
  // Motion
  family("motion", "motion-engines", ["reveal", "split-text", "count-up", "stagger-list"]),
  single("motion", "blur-fade"),
  single("motion", "marquee"),
  single("motion", "orbiting-circles")
]

const ANIMATED_EXTRA: ReadonlySet<string> = new Set(["progress", "skeleton", "spinner", "message-scroller", "streaming-text", "thinking", "reveal", "split-text", "count-up", "stagger-list",
  "hyper-text", "morphing-text", "sparkles-text", "gradient-text", "shine-border", "magic-card", "neon-gradient-card", "light-rays", "animated-beam", "flickering-grid", "interactive-hover-button", "generate-button", "terminal"])
/** Batch B animated items. Kept apart from ANIMATED_EXTRA until the playback pill has metadata for them. */
const ANIMATED_BATCH_B: ReadonlySet<string> = new Set([
  "logo-cloud", "testimonials-wall", "cylinder-carousel", "circular-gallery", "highlight-grid", "gooey-text-reveal", "spinning-text", "border-trail", "image-comparison"
])
const GLASS_IDS: ReadonlySet<string> = new Set([
  "glass-toggle", "glass-card", "glass-breadcrumb", "glass-dock", "glass-navbar", "floating-panel", "morphing-tabs",
  "shine-border", "magic-card", "neon-gradient-card", "gradient-text", "bento-grid", "interactive-hover-button", "generate-button", "browser-frame", "terminal"
])
const BLOCK_IDS: ReadonlySet<string> = new Set(["hero-section", "pricing-section", "logo-cloud", "feature-grid", "testimonials-wall", "faq-section", "cta-band", "footer-block"])
const WEBGL_IDS: ReadonlySet<string> = new Set([])

const signatureSet: ReadonlySet<string> = new Set(signatureComponentIds)
const primitiveSet: ReadonlySet<string> = new Set(primitiveComponentIds)
const aiSet: ReadonlySet<string> = new Set(aiComponentIds)
const newSet: ReadonlySet<string> = new Set(newComponentIds)

function tagsFor(id: string): ComponentTag[] {
  const tags: ComponentTag[] = []
  if (primitiveSet.has(id)) tags.push("primitive")
  if (signatureSet.has(id) || ANIMATED_EXTRA.has(id) || ANIMATED_BATCH_B.has(id)) tags.push("animated")
  if (WEBGL_IDS.has(id)) tags.push("webgl")
  if (BLOCK_IDS.has(id)) tags.push("block")
  if (aiSet.has(id)) tags.push("ai")
  if (GLASS_IDS.has(id)) tags.push("glass")
  if (newSet.has(id)) tags.push("new")
  if (getRegistryItem(id)?.provenance) tags.push("adapted")
  if ((primitiveMaturity as Record<string, string>)[id] === "beta" && !newSet.has(id)) tags.push("beta")
  return tags
}

export const componentTaxonomy: Record<string, TaxonomyEntry> = (() => {
  const out: Record<string, TaxonomyEntry> = {}
  for (const def of definitions) {
    def.ids.forEach((id, index) => {
      out[id] = {
        category: def.category,
        tags: tagsFor(id),
        ...(def.family ? { family: def.family, base: index === 0 } : {})
      }
    })
  }
  return out
})()

/** Display order: category order, then definition order (families contiguous, base first). */
const orderedIds: readonly string[] = (() => {
  const rank = new Map(categories.map((c) => [c.id, c.order]))
  const flat = definitions.flatMap((def) => def.ids)
  return flat
    .map((id, index) => ({ id, index }))
    .sort((a, b) => (rank.get(componentTaxonomy[a.id].category) ?? 0) - (rank.get(componentTaxonomy[b.id].category) ?? 0) || a.index - b.index)
    .map((x) => x.id)
})()

/** Every id the docs know about, mapped or not. */
function knownIds(): string[] {
  return Array.from(new Set<string>([...allComponentIds, ...newComponentIds, ...orderedIds]))
}

/** Total lookup: unmapped ids fall back to the Motion category with no family. */
export function getEntry(id: string): TaxonomyEntry {
  return componentTaxonomy[id] ?? { category: FALLBACK_CATEGORY, tags: tagsFor(id) }
}

export function getCategory(id: CategoryId): Category {
  return categories.find((c) => c.id === id) ?? categories[categories.length - 1]
}

export function getCategories(): readonly Category[] {
  return categories
}

/** Component ids in a category in display order. Unmapped ids are appended to the fallback category. */
export function getComponentsByCategory(category: CategoryId): string[] {
  const mapped = orderedIds.filter((id) => componentTaxonomy[id].category === category)
  if (category !== FALLBACK_CATEGORY) return mapped
  const unmapped = knownIds().filter((id) => !componentTaxonomy[id])
  return [...mapped, ...unmapped]
}

/** Family members in display order, base first. Empty for ids without a family. */
export function getFamily(id: string): string[] {
  const name = getEntry(id).family
  if (!name) return []
  return orderedIds.filter((other) => componentTaxonomy[other].family === name)
}

/** Siblings in the same family first, then the rest of the category. Never includes `id`. */
export function getRelated(id: string): string[] {
  const entry = getEntry(id)
  const siblings = getFamily(id).filter((other) => other !== id)
  const peers = getComponentsByCategory(entry.category).filter((other) => other !== id && !siblings.includes(other))
  return [...siblings, ...peers]
}

export function getTitle(id: string): string {
  const known = (componentTitles as Record<string, string | undefined>)[id]
  if (known) return known
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Completeness check: lists ids the docs know about that have no taxonomy entry. */
export const allCategorized: { complete: boolean; missing: string[] } = (() => {
  const missing = knownIds().filter((id) => !componentTaxonomy[id])
  return { complete: missing.length === 0, missing }
})()

if (process.env.NODE_ENV === "development" && !allCategorized.complete) {
  console.warn(`[taxonomy] Uncategorized components default to "${FALLBACK_CATEGORY}": ${allCategorized.missing.join(", ")}`)
}
