import type { ComponentDocMeta, ComponentExample } from "@/lib/component-docs"
import { bgExamples } from "@/components/demos/s4-backgrounds"
import { codeDocsExamples } from "@/components/demos/s4-code-docs"
import { aiExamples } from "@/components/demos/s4-ai"
import { typeExamples } from "@/components/demos/s4-type"

/**
 * Showcase pass S4 (backgrounds, text and code, AI): replaces the leading examples of data driven pages with
 * composed, product-like demos. `keep` lists titles of the original examples that stay after the new ones.
 */
type Override = { examples: ComponentExample[]; keep?: string[] }

const overrides: Record<string, Override> = {
  "light-rays": { examples: bgExamples["light-rays"] },
  "grid-pattern": { examples: bgExamples["grid-pattern"], keep: ["Interactive"] },
  "flickering-grid": { examples: bgExamples["flickering-grid"] },
  "message": { examples: aiExamples["message"], keep: ["Variants", "Glass (opt-in)"] },
  "bubble": { examples: aiExamples["bubble"], keep: ["Variants", "Glass (opt-in)"] },
  "message-scroller": { examples: aiExamples["message-scroller"], keep: ["Variants", "Glass (opt-in)"] },
  "prompt-input": { examples: aiExamples["prompt-input"], keep: ["Variants", "Glass (opt-in)"] },
  "attachment": { examples: aiExamples["attachment"], keep: ["Variants", "Glass (opt-in)"] },
  "thinking": { examples: aiExamples["thinking"], keep: ["Variants", "Glass (opt-in)"] },
  "streaming-text": { examples: aiExamples["streaming-text"], keep: ["Variants", "Glass (opt-in)"] },
  "questionnaire": { examples: aiExamples["questionnaire"], keep: ["Variants", "Glass (opt-in)"] },
  heading: { examples: typeExamples.heading, keep: ["Glass (opt-in)"] },
  text: { examples: typeExamples.text },
  link: { examples: typeExamples.link },
  code: { examples: typeExamples.code },
  kbd: { examples: typeExamples.kbd },
  "gradient-text": { examples: typeExamples["gradient-text"] },
  "code-panel": { examples: codeDocsExamples["code-panel"] },
  "install-command": { examples: codeDocsExamples["install-command"] },
  "browser-frame": { examples: codeDocsExamples["browser-frame"] }
}

export function applyShowcaseS4(docs: Record<string, ComponentDocMeta>): void {
  for (const [id, override] of Object.entries(overrides)) {
    const meta = docs[id]
    if (!meta) continue
    const kept = meta.examples.filter((example) => override.keep?.includes(example.title))
    docs[id] = { ...meta, examples: [...override.examples, ...kept] }
  }
}
