"use client"

import * as React from "react"
import { CountUp, Reveal, SplitText, StaggerList } from "@glinui/ui"
import "@/components/engines/register-engines"
import type { ComponentDocMeta } from "../component-docs"

type EngineChoice = "css" | "motion" | "gsap"

const ENGINE_TITLES: Record<EngineChoice, string> = {
  css: "CSS engine",
  motion: "Motion engine",
  gsap: "GSAP engine"
}

type Example = ComponentDocMeta["examples"][number]

const INSTALL_HINT: Record<EngineChoice, string> = {
  css: "",
  motion: "// pnpm add motion (separate dependency, optional)\n// Once at your app entry:\nimport \"@glinui/motion/register/motion\"\n\n",
  gsap: "// pnpm add gsap (separate dependency under GreenSock's own license, not bundled by GLINUI)\n// Once at your app entry:\nimport \"@glinui/motion/register/gsap\"\n\n"
}

function withRegistration(engine: EngineChoice, code: string): string {
  return INSTALL_HINT[engine] + code
}

/** Builds the four standard examples: one per engine plus the static (animations off) state. */
function engineExamples(
  codeOf: (attrs: string) => string,
  renderOf: (engine: EngineChoice | undefined, off: boolean) => React.ReactNode
): Example[] {
  const engines: EngineChoice[] = ["css", "motion", "gsap"]
  const perEngine = engines.map<Example>((engine) => ({
    title: ENGINE_TITLES[engine],
    code: withRegistration(engine, codeOf(`engine="${engine}"`)),
    // Unpinned: the stage engine switcher drives the engine (ExampleBlock starts on the engine named in the code).
    render: renderOf(undefined, false)
  }))
  perEngine.push({
    title: "Static (animations off)",
    code: codeOf('motion="none"'),
    render: renderOf(undefined, true)
  })
  return perEngine
}

const SHARED_PROPS = [
  { prop: "engine", type: '"css" | "motion" | "gsap" | string', defaultValue: '"css"', description: "Animation engine. css is built in with zero dependencies; motion and gsap are opt-in (import \"@glinui/motion/register/<name>\" and install the package). Falls back to MotionEngineProvider, then data-glin-engine on <html>, then css." },
  { prop: "motion", type: '"full" | "subtle" | "none" | "system"', defaultValue: '"system"', description: "none renders the final state with no animation, subtle animates opacity only, system follows prefers-reduced-motion." }
]

const SHARED_REDUCED = {
  description: "Under prefers-reduced-motion the engine drops travel, blur and scale and only fades opacity. motion=\"none\" renders the final state immediately and never loads an animation library.",
  affected: ["opacity", "transform", "filter"]
}

const SHARED_A11Y = ["Content is in the DOM and visible to assistive tech before and after the animation.", "Animation never gates meaning: the static state is identical to the final animated state."]

export const enginesDocs: Record<string, ComponentDocMeta> = {
  reveal: {
    badge: "Primitive / Atom",
    props: [
      { prop: "as", type: "RevealTag", defaultValue: '"div"', description: "Element to render." },
      { prop: "variant", type: '"fade" | "slide" | "blur" | "blur-slide" | "scale"', defaultValue: '"slide"', description: "Visual treatment of the reveal." },
      { prop: "direction", type: '"up" | "down" | "left" | "right" | "none"', defaultValue: '"up"', description: "Direction the content travels in." },
      { prop: "distance", type: "number", defaultValue: "16", description: "Travel distance in px for slide variants." },
      { prop: "duration / delay", type: "number", description: "Milliseconds. Duration defaults to 520 or the spring settling time." },
      { prop: "spring", type: "SpringInput", description: "Spring preset name or custom physics. Uses real physics on the motion and gsap engines." },
      { prop: "once", type: "boolean", defaultValue: "true", description: "Only animate the first time it enters the viewport." },
      { prop: "threshold", type: "number", defaultValue: "0.15", description: "Visible fraction required to trigger." },
      { prop: "immediate", type: "boolean", defaultValue: "false", description: "Play on mount instead of waiting for the viewport." },
      ...SHARED_PROPS
    ],
    accessibility: { summary: SHARED_A11Y },
    reducedMotion: SHARED_REDUCED,
    examples: [...engineExamples(
      (attrs) => `import { Reveal } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <Reveal ${attrs} variant="blur-slide" className="rounded-card border border-line-soft bg-surface-1 p-4">\n      Revealed when it scrolls into view.\n    </Reveal>\n  )\n}`,
      (engine, off) => (
        <Reveal
          engine={engine}
          motion={off ? "none" : undefined}
          variant="blur-slide"
          immediate
          className="rounded-card border border-line-soft bg-surface-1 p-4"
        >
          Revealed when it scrolls into view.
        </Reveal>
      )
    )]
  },
  "split-text": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "text", type: "string", description: "Text to split and reveal." },
      { prop: "as", type: '"p" | "span" | "div" | "h1" | "h2" | "h3" | "h4"', defaultValue: '"p"', description: "Element to render." },
      { prop: "by", type: '"words" | "chars"', defaultValue: '"words"', description: "Reveal granularity." },
      { prop: "variant", type: "RevealVariant", defaultValue: '"blur-slide"', description: "Visual treatment of each part." },
      { prop: "step", type: "number", defaultValue: "40 (words), 18 (chars)", description: "Delay between parts in ms." },
      { prop: "order", type: '"forward" | "reverse" | "center-out" | "edges-in"', defaultValue: '"forward"', description: "Order parts appear in." },
      { prop: "duration / delay / spring / once / threshold / immediate", type: "see Reveal", description: "Same behavior as Reveal." },
      ...SHARED_PROPS
    ],
    accessibility: {
      summary: [
        "The container carries aria-label with the full text and a visually hidden copy, so screen readers read the sentence once.",
        "Every animated word or character is aria-hidden, which avoids letter-by-letter announcements."
      ],
      aria: ["aria-label on the container", "aria-hidden on the animated parts"]
    },
    reducedMotion: SHARED_REDUCED,
    examples: [...engineExamples(
      (attrs) => `import { SplitText } from "@glinui/ui"\n\nexport function Demo() {\n  return <SplitText ${attrs} text="Motion that you can turn off" as="h3" className="type-h3" />\n}`,
      (engine, off) => (
        <SplitText engine={engine} motion={off ? "none" : undefined} text="Motion that you can turn off" as="h3" immediate className="text-xl font-semibold" />
      )
    )]
  },
  "count-up": {
    badge: "Primitive / Atom",
    props: [
      { prop: "value", type: "number", description: "Final value." },
      { prop: "from", type: "number", defaultValue: "0", description: "Start value." },
      { prop: "decimals", type: "number", description: "Fraction digits. Defaults to the digits of value." },
      { prop: "locale", type: "string", description: "Intl.NumberFormat locale." },
      { prop: "prefix / suffix", type: "string", description: "Text around the number, for example $ or +." },
      { prop: "format", type: "(value: number) => string", description: "Custom formatter. Overrides decimals and locale." },
      { prop: "duration / delay / spring / once / threshold / immediate", type: "see Reveal", description: "Same behavior as Reveal." },
      ...SHARED_PROPS
    ],
    accessibility: {
      summary: [
        "Assistive tech always reads the final value: the accessible copy is rendered once and never changes.",
        "The animating digits are aria-hidden, so there are no repeated announcements.",
        "The invisible final value reserves the width, so the layout never shifts while counting."
      ]
    },
    reducedMotion: { description: "Reduced motion and motion=\"subtle\" jump straight to the final number.", affected: ["number tween"] },
    examples: [...engineExamples(
      (attrs) => `import { CountUp } from "@glinui/ui"\n\nexport function Demo() {\n  return <CountUp ${attrs} value={12480} suffix="+" className="text-3xl font-semibold" />\n}`,
      (engine, off) => <CountUp engine={engine} motion={off ? "none" : undefined} value={12480} suffix="+" immediate className="text-3xl font-semibold" />
    )]
  },
  "stagger-list": {
    badge: "Primitive / Molecule",
    props: [
      { prop: "as", type: '"div" | "ul" | "ol" | "section" | "nav"', defaultValue: '"div"', description: "Element to render." },
      { prop: "step", type: "number", defaultValue: "60", description: "Delay between children in ms." },
      { prop: "order", type: '"forward" | "reverse" | "center-out" | "edges-in"', defaultValue: '"forward"', description: "Order children appear in." },
      { prop: "variant / direction / distance", type: "see Reveal", description: "Treatment applied to each child." },
      { prop: "duration / delay / spring / once / threshold / immediate", type: "see Reveal", description: "Same behavior as Reveal." },
      ...SHARED_PROPS
    ],
    accessibility: { summary: [...SHARED_A11Y, "List semantics are preserved: render with as=\"ul\" and li children."] },
    reducedMotion: SHARED_REDUCED,
    examples: [...engineExamples(
      (attrs) => `import { StaggerList } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <StaggerList ${attrs} as="ul" step={80} className="space-y-2">\n      <li>Design tokens</li>\n      <li>Primitives</li>\n      <li>Blocks</li>\n    </StaggerList>\n  )\n}`,
      (engine, off) => (
        <StaggerList engine={engine} motion={off ? "none" : undefined} as="ul" step={80} immediate className="space-y-2">
          <li className="rounded-card border border-line-soft bg-surface-1 px-3 py-2 text-sm">Design tokens</li>
          <li className="rounded-card border border-line-soft bg-surface-1 px-3 py-2 text-sm">Primitives</li>
          <li className="rounded-card border border-line-soft bg-surface-1 px-3 py-2 text-sm">Blocks</li>
        </StaggerList>
      )
    )]
  }
}

export type EnginesMetaEntry = {
  id: string
  title: string
  description: string
  badge: "Primitive / Atom" | "Primitive / Molecule"
  maturity: "beta"
  category: "motion"
  files: string[]
  dependencies: string[]
}

const file = (id: string) => `packages/ui/src/components/${id}.tsx`
const ENGINE_FILES = [file("motion-engine"), "packages/motion/src/engine.ts"]

export const enginesMeta: EnginesMetaEntry[] = [
  { id: "reveal", title: "Reveal", description: "In-view fade, blur and slide reveal that renders through the selected animation engine (css, motion or gsap).", badge: "Primitive / Atom", maturity: "beta", category: "motion", files: [file("reveal"), ...ENGINE_FILES], dependencies: ["@glinui/motion"] },
  { id: "split-text", title: "Split Text", description: "Word or character reveal that keeps the full text accessible, driven by the selected animation engine.", badge: "Primitive / Molecule", maturity: "beta", category: "motion", files: [file("split-text"), file("reveal"), ...ENGINE_FILES], dependencies: ["@glinui/motion"] },
  { id: "count-up", title: "Count Up", description: "Number that counts to its final value in view, with a stable layout and an accessible final value.", badge: "Primitive / Atom", maturity: "beta", category: "motion", files: [file("count-up"), file("reveal"), ...ENGINE_FILES], dependencies: ["@glinui/motion"] },
  { id: "stagger-list", title: "Stagger List", description: "Reveals direct children in sequence with a configurable order, driven by the selected animation engine.", badge: "Primitive / Molecule", maturity: "beta", category: "motion", files: [file("stagger-list"), file("reveal"), ...ENGINE_FILES], dependencies: ["@glinui/motion"] }
]
