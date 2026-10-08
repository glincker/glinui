import type { SignatureComponentId } from "@/lib/primitives"

export const ANIMATION_CATEGORIES = [
  "Text",
  "Backgrounds",
  "Borders and glows",
  "Buttons",
  "Cards",
  "Scroll and reveal",
  "Loaders"
] as const

export type AnimationCategory = (typeof ANIMATION_CATEGORIES)[number]

export type HubAnimation = { id: SignatureComponentId; category: AnimationCategory }

export const hubAnimations: HubAnimation[] = [
  { id: "typewriter", category: "Text" },
  { id: "word-rotate", category: "Text" },
  { id: "number-ticker", category: "Text" },
  { id: "reveal-text", category: "Text" },
  { id: "chromatic-text", category: "Text" },
  { id: "aurora-background", category: "Backgrounds" },
  { id: "animated-gradient", category: "Backgrounds" },
  { id: "gradient-mesh", category: "Backgrounds" },
  { id: "retro-grid", category: "Backgrounds" },
  { id: "dot-pattern", category: "Backgrounds" },
  { id: "particle-field", category: "Backgrounds" },
  { id: "meteor-shower", category: "Backgrounds" },
  { id: "light-leak", category: "Backgrounds" },
  { id: "blur-spotlight", category: "Backgrounds" },
  { id: "border-beam", category: "Borders and glows" },
  { id: "glow-border", category: "Borders and glows" },
  { id: "prism-border", category: "Borders and glows" },
  { id: "pulsating-button", category: "Buttons" },
  { id: "shimmer-button", category: "Buttons" },
  { id: "ripple-button", category: "Buttons" },
  { id: "liquid-button", category: "Buttons" },
  { id: "magnetic-cta", category: "Buttons" },
  { id: "morphing-tabs", category: "Buttons" },
  { id: "depth-card", category: "Cards" },
  { id: "spotlight-card", category: "Cards" },
  { id: "glass-card", category: "Cards" },
  { id: "blur-fade", category: "Scroll and reveal" },
  { id: "text-reveal", category: "Scroll and reveal" },
  { id: "marquee", category: "Scroll and reveal" },
  { id: "orbiting-circles", category: "Loaders" },
  { id: "ripple", category: "Loaders" }
]

export type MotionToken = {
  name: string
  value: string
  kind: "curve" | "duration"
  note: string
  /** Static Tailwind class so the demo never needs a style prop. */
  easeClass: string
  durationClass: string
}

export const motionTokens: MotionToken[] = [
  { name: "--ease-out", value: "cubic-bezier(0.23, 1, 0.32, 1)", kind: "curve", note: "Entrances and hovers. Fast start, soft landing.", easeClass: "ease-[var(--ease-out)]", durationClass: "duration-700" },
  { name: "--ease-in-out", value: "cubic-bezier(0.77, 0, 0.175, 1)", kind: "curve", note: "On-screen movement and morphs.", easeClass: "ease-[var(--ease-in-out)]", durationClass: "duration-700" },
  { name: "--ease-drawer", value: "cubic-bezier(0.32, 0.72, 0, 1)", kind: "curve", note: "Sheets, drawers, and docked panels.", easeClass: "ease-[var(--ease-drawer)]", durationClass: "duration-700" },
  { name: "--motion-fast", value: "150ms", kind: "duration", note: "Hover and press feedback.", easeClass: "ease-[var(--ease-out)]", durationClass: "duration-150" },
  { name: "--motion-normal", value: "250ms", kind: "duration", note: "Menus, tooltips, small reveals.", easeClass: "ease-[var(--ease-out)]", durationClass: "duration-[250ms]" },
  { name: "--motion-slow", value: "400ms", kind: "duration", note: "Large surfaces and page level shifts.", easeClass: "ease-[var(--ease-out)]", durationClass: "duration-[400ms]" }
]

export function toPascalCase(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
