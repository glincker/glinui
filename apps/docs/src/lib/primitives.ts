import {
  generatedComponentDescriptions,
  generatedComponentTitles
} from "./generated-registry-metadata"
import { newComponentCopy, newComponentIds, type NewComponentId } from "./new-component-ids"

export { aiComponentIds, newComponentIds } from "./new-component-ids"
export type { AiComponentId, NewComponentId } from "./new-component-ids"

// ── Primitive (Atom) Components ──────────────────────────────────────────────
export const primitiveComponentIds = [
  "accordion",
  "alert",
  "alert-dialog",
  "animated-beam",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "bento-grid",
  "border-trail",
  "breadcrumb",
  "browser-frame",
  "bubble",
  "button",
  "button-group",
  "card",
  "checkbox",
  "chip",
  "circular-gallery",
  "code",
  "code-panel",
  "collapsible",
  "combobox",
  "command",
  "context-menu",
  "copy-button",
  "count-up",
  "counter",
  "cta-band",
  "cylinder-carousel",
  "data-table",
  "dropdown-menu",
  "empty",
  "faq-section",
  "feature-grid",
  "field",
  "flickering-grid",
  "footer-block",
  "generate-button",
  "gooey-text-reveal",
  "gradient-text",
  "grid-pattern",
  "heading",
  "hero-section",
  "highlight-grid",
  "hover-card",
  "hyper-text",
  "icon-frame",
  "image-comparison",
  "input",
  "input-group",
  "input-otp",
  "install-command",
  "interactive-hover-button",
  "item",
  "kbd",
  "label",
  "light-rays",
  "link",
  "logo-cloud",
  "magic-card",
  "menubar",
  "message",
  "message-scroller",
  "modal",
  "morphing-text",
  "navigation-menu",
  "neon-gradient-card",
  "pagination",
  "popover",
  "pricing-section",
  "progress",
  "progressive-blur",
  "prompt-input",
  "questionnaire",
  "radio-group",
  "reveal",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "shine-border",
  "sidebar",
  "skeleton",
  "slider",
  "sparkles-text",
  "spinner",
  "spinning-text",
  "split-text",
  "stagger-list",
  "status-dot",
  "streaming-text",
  "switch",
  "table",
  "tabs",
  "terminal",
  "testimonials-wall",
  "text",
  "textarea",
  "thinking",
  "toast",
  "toggle",
  "toggle-group",
  "tooltip",
  "tree"
] as const

export type PrimitiveComponentId = (typeof primitiveComponentIds)[number]

// ── Signature (Glass) Components ────────────────────────────────────────────
export const signatureComponentIds = [
  "animated-gradient",
  "aurora-background",
  "blur-fade",
  "blur-spotlight",
  "border-beam",
  "chromatic-text",
  "depth-card",
  "dot-pattern",
  "floating-panel",
  "glass-breadcrumb",
  "glass-card",
  "glass-dock",
  "glass-navbar",
  "glass-toggle",
  "glow-border",
  "gradient-mesh",
  "light-leak",
  "liquid-button",
  "magnetic-cta",
  "marquee",
  "meteor-shower",
  "morphing-tabs",
  "number-ticker",
  "orbiting-circles",
  "particle-field",
  "prism-border",
  "pulsating-button",
  "retro-grid",
  "reveal-text",
  "ripple-button",
  "ripple",
  "shimmer-button",
  "spotlight",
  "spotlight-card",
  "text-reveal",
  "typewriter",
  "word-rotate"
] as const

export type SignatureComponentId = (typeof signatureComponentIds)[number]

export type ComponentId = PrimitiveComponentId | SignatureComponentId

export const allComponentIds = [...primitiveComponentIds, ...signatureComponentIds] as const

export type ComponentMaturity = "stable" | "beta"

const primitiveBetaIds: PrimitiveComponentId[] = [
  "alert-dialog",
  "command",
  "data-table",
  "hover-card",
  "sheet",
  "slider",
  "table",
  "toast",
  "tree"
]

const primitiveBetaSet = new Set<PrimitiveComponentId>([...primitiveBetaIds, ...newComponentIds])

export const primitiveMaturity = Object.fromEntries(
  primitiveComponentIds.map((id) => [id, primitiveBetaSet.has(id) ? "beta" : "stable"])
) as Record<PrimitiveComponentId, ComponentMaturity>

function toTitleCaseFromId(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function toDescriptionFallback(id: string) {
  return `${toTitleCaseFromId(id)} component.`
}

function lookup(source: Readonly<Record<string, string>>, id: string): string | undefined {
  return source[id]
}

function isNewId(id: string): id is NewComponentId {
  return (newComponentIds as readonly string[]).includes(id)
}

function newTitle(id: string): string | undefined {
  return isNewId(id) ? newComponentCopy[id].title : undefined
}

function newDescription(id: string): string | undefined {
  return isNewId(id) ? newComponentCopy[id].description : undefined
}

function buildRegistryRecord<TIds extends readonly string[]>(
  ids: TIds,
  resolver: (id: TIds[number]) => string
): Record<TIds[number], string> {
  return Object.fromEntries(ids.map((id) => [id, resolver(id)])) as Record<TIds[number], string>
}

// ── Titles ──────────────────────────────────────────────────────────────────
export const primitiveTitles = buildRegistryRecord(
  primitiveComponentIds,
  (id) => lookup(generatedComponentTitles, id) ?? newTitle(id) ?? toTitleCaseFromId(id)
)

export const signatureTitles = buildRegistryRecord(
  signatureComponentIds,
  (id) => generatedComponentTitles[id] ?? toTitleCaseFromId(id)
)

export const componentTitles: Record<ComponentId, string> = {
  ...(primitiveTitles as Record<ComponentId, string>),
  ...(signatureTitles as Record<ComponentId, string>)
}

// ── Descriptions ────────────────────────────────────────────────────────────
export const primitiveDescriptions = buildRegistryRecord(
  primitiveComponentIds,
  (id) => lookup(generatedComponentDescriptions, id) ?? newDescription(id) ?? toDescriptionFallback(id)
)

export const signatureDescriptions = buildRegistryRecord(
  signatureComponentIds,
  (id) => generatedComponentDescriptions[id] ?? toDescriptionFallback(id)
)
