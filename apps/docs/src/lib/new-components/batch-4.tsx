import type { ComponentDocMeta } from "@/lib/component-docs"
import { batch4aDocs } from "./batch-4a"
import { batch4bDocs } from "./batch-4b"

/** Docs for the AI / chat component batch. Keyed by component id. */
export const batch4Docs: Record<string, ComponentDocMeta> = {
  ...batch4aDocs,
  ...batch4bDocs
}

export type Batch4Meta = {
  id: string
  title: string
  description: string
  badge: "Primitive / Molecule" | "Primitive / Organism"
  maturity: "beta"
  category: "ai"
  files: string[]
  dependencies: string[]
}

const file = (id: string) => `packages/ui/src/components/${id}.tsx`
const ICONS = "@phosphor-icons/react"

export const batch4Meta: Batch4Meta[] = [
  { id: "message", title: "Message", description: "Chat turn layout with roles, avatar, bubble content and an actions toolbar (copy, regenerate, feedback).", badge: "Primitive / Molecule", maturity: "beta", category: "ai", files: [file("message"), file("bubble"), file("avatar")], dependencies: [ICONS, "class-variance-authority"] },
  { id: "bubble", title: "Bubble", description: "Chat bubble surface with default, muted, accent and glass variants, optional tail and grouped spacing.", badge: "Primitive / Molecule", maturity: "beta", category: "ai", files: [file("bubble")], dependencies: ["class-variance-authority"] },
  { id: "message-scroller", title: "Message Scroller", description: "Conversation log that sticks to the bottom, shows a jump to latest pill and announces new messages politely.", badge: "Primitive / Organism", maturity: "beta", category: "ai", files: [file("message-scroller"), "packages/ui/src/lib/use-prefers-reduced-motion.ts"], dependencies: [ICONS] },
  { id: "prompt-input", title: "Prompt Input", description: "Auto-growing chat composer with send and stop, IME-safe Enter handling, attachment slot and character hint.", badge: "Primitive / Organism", maturity: "beta", category: "ai", files: [file("prompt-input")], dependencies: [ICONS, "class-variance-authority"] },
  { id: "attachment", title: "Attachment", description: "File chip or image thumbnail with type icon, size, upload progress and remove button.", badge: "Primitive / Molecule", maturity: "beta", category: "ai", files: [file("attachment")], dependencies: [ICONS, "class-variance-authority"] },
  { id: "thinking", title: "Thinking", description: "Reasoning indicator with animated dots or pulsing text and collapsible reasoning details.", badge: "Primitive / Molecule", maturity: "beta", category: "ai", files: [file("thinking")], dependencies: [ICONS] },
  { id: "streaming-text", title: "Streaming Text", description: "Progressive text reveal with caret and completion callback, instant under reduced motion.", badge: "Primitive / Molecule", maturity: "beta", category: "ai", files: [file("streaming-text"), "packages/ui/src/lib/use-prefers-reduced-motion.ts"], dependencies: [] },
  { id: "questionnaire", title: "Questionnaire", description: "Multi-step form with single and multiple choice option cards, progress and keyboard accessible radio and checkbox semantics.", badge: "Primitive / Organism", maturity: "beta", category: "ai", files: [file("questionnaire")], dependencies: [ICONS, "class-variance-authority"] }
]
