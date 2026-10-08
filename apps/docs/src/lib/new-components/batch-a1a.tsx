"use client"

import { HyperText, MorphingText } from "@glinui/ui"
import type { ComponentDocMeta } from "../component-docs"

export type BatchA1Doc = ComponentDocMeta & { notes: string[] }

export const batchA1aDocs: Record<string, BatchA1Doc> = {
  "hyper-text": {
    badge: "Primitive / Atom",
    props: [
      { prop: "children", type: "string", description: "The text to reveal. Required." },
      { prop: "as", type: '"div" | "span" | "p" | "h1" to "h6"', defaultValue: "div", description: "Element to render." },
      { prop: "trigger", type: '"hover" | "view" | "mount"', defaultValue: "hover", description: "Run on pointer or focus, once when scrolled into view, or once on mount." },
      { prop: "duration", type: "number", defaultValue: "800", description: "Scramble length in milliseconds." },
      { prop: "delay", type: "number", defaultValue: "0", description: "Delay before a view or mount run, in milliseconds." },
      { prop: "characterSet", type: "string | readonly string[]", defaultValue: "A to Z", description: "Characters used while scrambling." },
      { prop: "tabular", type: "boolean", defaultValue: "true", description: "Render each glyph in a one character wide cell so the line width never changes." },
      { prop: "focusable", type: "boolean", defaultValue: "false", description: "Make the element tabbable so keyboard users can trigger the hover effect." }
    ],
    accessibility: {
      summary: [
        "The real string is always present in a screen reader only span; the scrambling glyph layer is aria-hidden.",
        "Assistive tech never reads random characters.",
        "With focusable, keyboard focus triggers the same effect as hover and shows a visible focus ring."
      ],
      keyboard: [{ key: "Tab", description: "Focus the text (only when focusable is set) to run the scramble." }],
      aria: ["`aria-hidden` on the glyph layer", "real text in an `sr-only` span"]
    },
    reducedMotion: {
      description: "With prefers-reduced-motion, or Glin motion level none or subtle, no scramble runs and the final text is shown immediately.",
      affected: ["scramble", "glyph swaps"]
    },
    notes: [
      "Adapted from Hyper Text by Magic UI (MIT).",
      "Improvements: no motion dependency (a single rAF loop), per code point cells with no layout shift, graphemes kept together for emoji and combining marks, view and mount triggers, SSR renders the final text so there is no hydration mismatch, and every frame and timer is cancelled on unmount."
    ],
    examples: [
      {
        title: "Hover scramble",
        description: "Hover or focus the heading to re-run the scramble.",
        code: `import { HyperText } from "@glinui/ui"\n\nexport function Demo() {\n  return <HyperText focusable>Hyper Text</HyperText>\n}`,
        render: <HyperText focusable>Hyper Text</HyperText>
      },
      {
        title: "On view with custom characters",
        description: "Runs once when scrolled into view, scrambling through binary digits.",
        code: `import { HyperText } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <HyperText trigger="view" characterSet="01" duration={1200} as="h3">\n      Decrypting signal\n    </HyperText>\n  )\n}`,
        render: (
          <HyperText trigger="view" characterSet="01" duration={1200} as="h3">
            Decrypting signal
          </HyperText>
        )
      },
      {
        title: "Proportional glyphs",
        description: "Turn off tabular cells to use the natural font width.",
        code: `import { HyperText } from "@glinui/ui"\n\nexport function Demo() {\n  return <HyperText tabular={false} className="font-sans text-2xl">Mixed width</HyperText>\n}`,
        render: <HyperText tabular={false} className="font-sans text-2xl">Mixed width</HyperText>
      }
    ]
  },

  "morphing-text": {
    badge: "Primitive / Atom",
    props: [
      { prop: "texts", type: "string[]", description: "Words or phrases to cycle through. Required." },
      { prop: "morphTime", type: "number", defaultValue: "1.5", description: "Seconds each morph takes." },
      { prop: "cooldownTime", type: "number", defaultValue: "0.5", description: "Seconds each text rests before the next morph." }
    ],
    accessibility: {
      summary: [
        "All texts are exposed once in a screen reader only span, so the animation never spams a live region.",
        "The visual layer is aria-hidden.",
        "The loop pauses while the component is off screen and in background tabs."
      ],
      aria: ["`aria-hidden` on the visual layer", "all texts joined in an `sr-only` span"]
    },
    reducedMotion: {
      description: "Motion level none (or prefers-reduced-motion) shows the first text and runs no loop. Level subtle swaps texts with a plain opacity crossfade, no blur and no filter.",
      affected: ["blur", "SVG threshold filter", "opacity"]
    },
    notes: [
      "Adapted from Morphing Text by Magic UI (MIT).",
      "Improvements: the SVG filter id is unique per instance (the original used a global id that collides), the loop pauses off screen, large frame gaps are clamped, text size is container relative with clamp, and initial markup is the first text, readable before JS runs.",
      "Difference from Word Rotate: Morphing Text is a blur and threshold gooey crossfade in place, Word Rotate swaps words with a vertical slide."
    ],
    examples: [
      {
        title: "Basic",
        description: "Cycles through three words.",
        code: `import { MorphingText } from "@glinui/ui"\n\nexport function Demo() {\n  return <MorphingText texts={["Design", "Build", "Ship"]} />\n}`,
        render: <MorphingText texts={["Design", "Build", "Ship"]} />
      },
      {
        title: "Slower timing",
        description: "Longer morph and rest times, smaller text via className.",
        code: `import { MorphingText } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <MorphingText\n      texts={["Calm", "Clear", "Considered"]}\n      morphTime={2.4}\n      cooldownTime={1.2}\n      className="text-[var(--color-accent)]"\n    />\n  )\n}`,
        render: (
          <MorphingText
            texts={["Calm", "Clear", "Considered"]}
            morphTime={2.4}
            cooldownTime={1.2}
            className="text-[var(--color-accent)]"
          />
        )
      }
    ]
  }
}
