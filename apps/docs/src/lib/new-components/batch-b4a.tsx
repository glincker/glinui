"use client"

import {
  GooeyHero,
  GooeyLayout,
  GooeyStates,
  GooeyVariants,
  SpinningHero,
  SpinningLayout,
  SpinningStates,
  SpinningVariants
} from "@/components/demos/batch-b4-demos"
import type { ComponentDocMeta } from "../component-docs"

export type BatchB4Doc = ComponentDocMeta & { notes: string[] }

const MOTION_NONE = "Under motion none or prefers-reduced-motion the component renders its static frame."

export const batchB4aDocs: Record<string, BatchB4Doc> = {
  "gooey-text-reveal": {
    badge: "Primitive / Molecule",
    notes: [
      "Our own design, written from a behavior spec. One SVG filter (a small gaussian blur plus an alpha contrast matrix) is shared by the whole stage, and each word fades and blurs in with a staggered delay, so the soft edges merge like liquid before settling.",
      "The filter is attached only while an animation runs and is removed afterwards, so settled type is always crisp. Every instance gets its own filter id from `useId`.",
      "Pass an array to `text` to morph between phrases in a loop (the loop pauses offscreen and in hidden tabs). SVG filters on large HTML text cost GPU time: keep it to headings and avoid several large instances in the viewport at once. Safari renders CSS filters that reference SVG filters on HTML but can soften text mid animation, which is expected."
    ],
    props: [
      { prop: "text", type: "string | string[]", description: "A string reveals word by word. An array of two or more strings morphs between phrases." },
      { prop: "as", type: '"h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span"', defaultValue: "h2", description: "Element to render." },
      { prop: "variant", type: '"default" | "plain" | "glass"', defaultValue: "default", description: "Type treatment. `glass` adds a soft halo for translucent backdrops." },
      { prop: "stagger", type: "number", defaultValue: "90", description: "Milliseconds between words (reveal)." },
      { prop: "duration", type: "number", defaultValue: "900", description: "Milliseconds for one word reveal or one morph." },
      { prop: "hold", type: "number", defaultValue: "2200", description: "Milliseconds each phrase rests before morphing (array text)." },
      { prop: "blur", type: "number", defaultValue: "12", description: "Starting blur in pixels. Larger values give fatter blobs." },
      { prop: "trigger", type: '"mount" | "view"', defaultValue: "view", description: "Start on mount or when scrolled into view (string text)." },
      { prop: "once", type: "boolean", defaultValue: "true", description: "Reveal once, or replay each time it re-enters the viewport." }
    ],
    accessibility: {
      summary: [
        "The full text is the element's accessible name through `aria-label`; the animated words and the SVG are `aria-hidden`.",
        "Array text is announced as a comma separated list of every phrase.",
        "The heading level is yours to choose with `as`.",
        "Animation pauses offscreen and while the tab is hidden."
      ],
      aria: ["`aria-label` on the root with the full text", "`aria-hidden=\"true\"` on the stage and the filter SVG"]
    },
    reducedMotion: {
      description: `Motion subtle swaps the goo for a plain opacity fade. ${MOTION_NONE} The final text is shown with no filter.`,
      affected: ["blur", "translate", "opacity", "goo filter", "phrase morph loop"]
    },
    examples: [
      { title: "Default", description: "The headline melts in when it scrolls into view.", code: "import { GooeyTextReveal } from \"@glinui/ui\"\n\nexport function Demo() {\n  return <GooeyTextReveal as=\"h2\" text=\"Interfaces that melt into place\" className=\"text-5xl\" />\n}", render: <GooeyHero /> },
      { title: "Variants", description: "Type treatments for each style.", code: "<GooeyTextReveal variant=\"plain\" trigger=\"mount\" text=\"Liquid type\" />", render: <GooeyVariants /> },
      { title: "States", description: "Morph between phrases, or tune the blob size and stagger.", code: "<GooeyTextReveal text={[\"Design\", \"Build\", \"Ship\"]} />\n<GooeyTextReveal text=\"Bigger blobs\" blur={20} stagger={160} />", render: <GooeyStates /> },
      { title: "In a layout", description: "A hero section with the reveal as the headline.", code: "<section>\n  <GooeyTextReveal as=\"h2\" text=\"Ship the interface your users remember\" />\n  <Button>Get started</Button>\n</section>", render: <GooeyLayout /> }
    ]
  },
  "spinning-text": {
    badge: "Primitive / Atom",
    notes: [
      "Adapted from Spinning Text by Motion Primitives (MIT). Modified: motion/react removed (the ring turns through the Web Animations API), per-glyph angle is a CSS variable, the string is the accessible name of a `role=\"img\"` wrapper, and RTL mirrors the glyph order and spin direction.",
      "Improvement over the original: pause on hover or focus, pause offscreen and in hidden tabs, static ring at motion none, no inline style attributes.",
      "End the string with a separator and a space so the loop reads as a ring: `\"open source * made to be owned * \"`."
    ],
    props: [
      { prop: "children", type: "string", description: "Text laid out on the ring. It is also the accessible name." },
      { prop: "variant", type: '"default" | "plain" | "glass"', defaultValue: "default", description: "Type treatment." },
      { prop: "duration", type: "number", defaultValue: "10", description: "Seconds per full turn." },
      { prop: "reverse", type: "boolean", defaultValue: "false", description: "Spin counter-clockwise (mirrored in RTL)." },
      { prop: "fontSize", type: "number", defaultValue: "1", description: "Glyph size in rem." },
      { prop: "radius", type: "number", defaultValue: "5", description: "Ring radius in ch units." },
      { prop: "pauseOnHover", type: "boolean", defaultValue: "false", description: "Pause while hovered or focused within." }
    ],
    accessibility: {
      summary: [
        "The wrapper is `role=\"img\"` with `aria-label` set to the full string; the individual glyphs are `aria-hidden`.",
        "Decorative by default. Pair it with a visible heading if the text carries meaning.",
        "Never traps focus or intercepts pointer events beyond the optional hover pause."
      ],
      aria: ["`role=\"img\"` with `aria-label`", "`aria-hidden=\"true\"` on the glyph ring"]
    },
    reducedMotion: {
      description: `The ring only turns at motion level full. ${MOTION_NONE} Glyphs stay placed on the circle.`,
      affected: ["ring rotation"]
    },
    examples: [
      { title: "Default", description: "A rotating seal. Hover to pause.", code: "import { SpinningText } from \"@glinui/ui\"\n\n<SpinningText pauseOnHover>{\"open source * made to be owned * \"}</SpinningText>", render: <SpinningHero /> },
      { title: "Variants", description: "Type treatments.", code: "<SpinningText variant=\"glass\">{\"glass * glass * \"}</SpinningText>", render: <SpinningVariants /> },
      { title: "States", description: "Speed, direction and ring size.", code: "<SpinningText duration={6} reverse radius={4} fontSize={0.7}>...</SpinningText>", render: <SpinningStates /> },
      { title: "In a layout", description: "A verified badge beside a proof point.", code: "<Card className=\"flex items-center gap-5\">\n  <SpinningText>{\"verified * \"}</SpinningText>\n  <p>Trusted by teams</p>\n</Card>", render: <SpinningLayout /> }
    ]
  }
}
