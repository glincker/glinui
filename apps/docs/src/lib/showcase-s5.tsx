import * as React from "react"
import type { ComponentDocMeta, ComponentExample } from "@/lib/component-docs"
import { EngineColumns } from "@/components/demos/s5-engines"
import { engineCompareCode } from "@/components/demos/s5-engine-code"
import * as demos from "@/components/demos/s5-motion"
import { s5Code } from "@/lib/s5-code.generated"
import { playbackMeta } from "@/lib/playback-meta"

/**
 * Showcase pass S5 (motion family): composed hero demos for data driven pages, an Engines note,
 * and an Engine comparison example for engine-aware components. MDX pages carry the same pieces inline.
 */
const HEROES: Record<string, keyof typeof demos> = {
  reveal: "RevealCards",
  "split-text": "SplitTextHeadline",
  "count-up": "CountUpStats",
  "stagger-list": "StaggerListSteps",
  "hyper-text": "HyperTextHero",
  "sparkles-text": "SparklesHero",
  "morphing-text": "MorphingHero",
  terminal: "TerminalInstall",
  "shine-border": "LoginShine",
  "animated-beam": "IntegrationsBeam",
  "bento-grid": "BentoEntrance"
}

const ENGINE_COMPARE_IDS = ["hyper-text", "terminal", "bento-grid"]

const AWARE_NOTE =
  "Engines: this component drives its main animation through the pluggable motion engine. Pass `engine` (css, motion or gsap), wrap a subtree in `MotionEngineProvider`, or set `data-glin-engine` on `<html>`. The css engine is built in and dependency free; motion and gsap are opt-in via `@glinui/motion/register/*`. `motion=\"none\"` renders the final state and `subtle` is opacity only."

export function applyS5Showcase(docs: Record<string, ComponentDocMeta>): void {
  for (const [id, demoName] of Object.entries(HEROES)) {
    const meta = docs[id]
    const Demo = demos[demoName] as React.ComponentType
    if (!meta || !Demo) continue
    const first = meta.examples[0]
    const hero: ComponentExample = {
      title: first?.title ?? "Default",
      description: first?.description,
      code: s5Code[demoName] ?? first?.code ?? "",
      render: <Demo />
    }
    docs[id] = { ...meta, examples: [hero, ...meta.examples.slice(1)] }
  }
  for (const id of ENGINE_COMPARE_IDS) {
    const meta = docs[id]
    if (!meta) continue
    const compare: ComponentExample = {
      title: "Engine comparison",
      description: "The same component on the css, motion and gsap engines. Replay restarts all three.",
      code: engineCompareCode(id),
      render: <EngineColumns id={id} />
    }
    docs[id] = { ...meta, notes: [...(meta.notes ?? []), AWARE_NOTE], examples: [...meta.examples, compare] }
  }
  for (const [id, meta] of Object.entries(docs)) {
    const note = playbackMeta[id]?.engineNote
    if (note && !(meta.notes ?? []).some((n) => n.startsWith("Engines:"))) {
      docs[id] = { ...meta, notes: [...(meta.notes ?? []), `Engines: the \`engine\` prop is not applicable. ${note}`] }
    }
  }
}
