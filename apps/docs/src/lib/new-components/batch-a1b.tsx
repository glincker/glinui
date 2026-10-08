"use client"

import { GradientText, SparklesText } from "@glinui/ui"
import type { BatchA1Doc } from "./batch-a1a"

export const batchA1bDocs: Record<string, BatchA1Doc> = {
  "sparkles-text": {
    badge: "Primitive / Atom",
    props: [
      { prop: "children", type: "ReactNode", description: "The text to decorate. Required." },
      { prop: "as", type: '"div" | "span" | "p" | "h1" to "h6"', defaultValue: "div", description: "Element to render." },
      { prop: "sparklesCount", type: "number", defaultValue: "10", description: "Sparkles alive at once. Capped at 24." },
      { prop: "colors", type: "{ first: string; second: string }", defaultValue: "accent, signal-ok tokens", description: "Sparkle colors, any CSS color." }
    ],
    accessibility: {
      summary: [
        "The text is real DOM text and is read normally.",
        "Every sparkle is a decorative svg with aria-hidden and is pointer-events none.",
        "No flashing: sparkles scale and fade over about one second each."
      ],
      aria: ["`aria-hidden` on every sparkle"]
    },
    reducedMotion: {
      description: "With prefers-reduced-motion or motion level none or subtle, the animated pool is replaced by two static stars.",
      affected: ["sparkle scale", "rotation", "opacity"]
    },
    notes: [
      "Adapted from Sparkles Text by Magic UI (MIT).",
      "Improvements: no motion dependency (Web Animations API), sparkles are created after mount so there is no hydration mismatch from Math.random, a fixed pool re-rolls position in place instead of replacing DOM every 100ms, positions use logical inline-start so RTL mirrors, and the count is capped."
    ],
    examples: [
      {
        title: "Basic",
        code: `import { SparklesText } from "@glinui/ui"\n\nexport function Demo() {\n  return <SparklesText>Glin UI</SparklesText>\n}`,
        render: <SparklesText>Glin UI</SparklesText>
      },
      {
        title: "Custom colors and count",
        description: "Any CSS color works, including tokens.",
        code: `import { SparklesText } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <SparklesText\n      sparklesCount={16}\n      colors={{ first: "var(--color-signal-live)", second: "var(--color-accent)" }}\n    >\n      Shipped\n    </SparklesText>\n  )\n}`,
        render: (
          <SparklesText sparklesCount={16} colors={{ first: "var(--color-signal-live)", second: "var(--color-accent)" }}>
            Shipped
          </SparklesText>
        )
      }
    ]
  },

  "gradient-text": {
    badge: "Primitive / Atom",
    props: [
      { prop: "effect", type: '"flow" | "shine"', defaultValue: "flow", description: "Looping two color gradient, or a glint sweeping over muted text." },
      { prop: "badge", type: "boolean", defaultValue: "false", description: "Wrap the text in a pill." },
      { prop: "variant", type: '"default" | "glass"', defaultValue: "default", description: "Pill surface when badge is set. `glass` uses backdrop blur and glass tokens." },
      { prop: "from", type: "string", defaultValue: "var(--color-accent)", description: "Gradient start (flow) or text color (shine)." },
      { prop: "to", type: "string", defaultValue: "var(--color-signal-ok)", description: "Gradient end (flow) or glint color (shine)." },
      { prop: "speed", type: "number", defaultValue: "1", description: "Animation speed multiplier. 0 holds the gradient still." }
    ],
    accessibility: {
      summary: [
        "Plain inline text, fully selectable and readable.",
        "Under forced colors (Windows high contrast) the clip gradient is dropped and the text uses CanvasText, so it never disappears.",
        "Keep contrast in mind: pick from and to colors that pass 3:1 against the background for large text."
      ]
    },
    reducedMotion: {
      description: "With prefers-reduced-motion or motion level none or subtle, the gradient is rendered static, with no sweep.",
      affected: ["background-position sweep"]
    },
    notes: [
      "Adapted from Animated Gradient Text and Animated Shiny Text by Magic UI (MIT).",
      "Improvements: colors come from tokens, the badge wrapper ships with solid and glass surfaces, forced-colors fallback, and the sweep is a Web Animations API loop with no global keyframes. Not to be confused with Animated Gradient, which is a background."
    ],
    examples: [
      {
        title: "Flow",
        code: `import { GradientText } from "@glinui/ui"\n\nexport function Demo() {\n  return <GradientText className="text-4xl font-bold">Build faster</GradientText>\n}`,
        render: <GradientText className="text-4xl font-bold">Build faster</GradientText>
      },
      {
        title: "Shine badge",
        description: "Muted text with a glint, inside a solid pill.",
        code: `import { GradientText } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <GradientText badge effect="shine">\n      Introducing Glin UI\n    </GradientText>\n  )\n}`,
        render: (
          <GradientText badge effect="shine">
            Introducing Glin UI
          </GradientText>
        )
      },
      {
        title: "Glass badge",
        description: "Glass pill with a shine sweep, best over a colorful or photographic background.",
        code: `import { GradientText } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <GradientText badge variant="glass" effect="shine" from="var(--color-foreground)" to="var(--color-accent)">\n      New release\n    </GradientText>\n  )\n}`,
        render: (
          <GradientText badge variant="glass" effect="shine" from="var(--color-foreground)" to="var(--color-accent)">
            New release
          </GradientText>
        )
      }
    ]
  }
}
