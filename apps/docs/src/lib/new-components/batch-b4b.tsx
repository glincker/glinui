"use client"

import {
  BlurHero,
  BlurLayout,
  BlurStates,
  BlurVariants,
  TrailHero,
  TrailLayout,
  TrailStates,
  TrailVariants
} from "@/components/demos/batch-b4-demos"
import type { BatchB4Doc } from "./batch-b4a"

export const batchB4bDocs: Record<string, BatchB4Doc> = {
  "border-trail": {
    badge: "Primitive / Atom",
    notes: [
      "Adapted from Border Trail by Motion Primitives (MIT). Modified: motion/react removed (the comet follows `offset-path: rect()` driven by the Web Animations API), token colors with a soft radial head, the path radius defaults to the parent's border radius, and a rotating conic ring is used where `offset-path: rect()` is unsupported.",
      "The parent must be `relative` with a border radius, and should clip overflow. Distinct from BorderBeam (a dot) and ShineBorder (a drifting gradient): a short comet on a thin track.",
      "Improvement over the original: no hardcoded zinc, offscreen and hidden tab pause, static corner glow at motion none, hidden under forced-colors."
    ],
    props: [
      { prop: "variant", type: '"default" | "plain" | "glass"', defaultValue: "default", description: "Color source: accent, foreground or a bright additive accent." },
      { prop: "size", type: "number", defaultValue: "60", description: "Length of the glowing segment in pixels." },
      { prop: "duration", type: "number", defaultValue: "5", description: "Seconds per lap." },
      { prop: "radius", type: "number", description: "Path corner radius in pixels. Defaults to the parent border radius." },
      { prop: "borderWidth", type: "number", defaultValue: "1", description: "Track thickness in pixels." },
      { prop: "color", type: "string", description: "Any CSS color or token for the comet." }
    ],
    accessibility: {
      summary: ["Purely decorative: aria-hidden, pointer-events-none, never focusable.", "Hidden under forced-colors so the real border shows.", "Pauses offscreen and while the tab is hidden."],
      aria: ["`aria-hidden=\"true\"` on the layer", "`data-mode` reports `path` or `conic`, `data-animated` reports motion"]
    },
    reducedMotion: {
      description: "The comet only travels at motion level full. Under motion none, subtle or prefers-reduced-motion it rests as a static glow at the top start corner.",
      affected: ["offset-distance travel", "conic rotation"]
    },
    examples: [
      { title: "Default", description: "A comet circles the card edge.", code: "import { BorderTrail, Card } from \"@glinui/ui\"\n\n<Card className=\"relative overflow-hidden\">\n  <BorderTrail size={90} borderWidth={2} duration={6} />\n  ...\n</Card>", render: <TrailHero /> },
      { title: "Variants", description: "Color sources per style.", code: "<BorderTrail variant=\"glass\" borderWidth={2} />", render: <TrailVariants /> },
      { title: "States", description: "Custom color, length, radius and speed.", code: "<BorderTrail color=\"var(--color-signal-ok)\" size={120} />\n<BorderTrail radius={32} duration={3} borderWidth={3} size={50} />", render: <TrailStates /> },
      { title: "In a layout", description: "The highlighted plan wears the trail.", code: "<Card className=\"relative overflow-hidden\">\n  <BorderTrail borderWidth={2} size={100} />\n  <PlanContent />\n</Card>", render: <TrailLayout /> }
    ]
  },
  "progressive-blur": {
    badge: "Primitive / Atom",
    notes: [
      "Adapted from Progressive Blur by Motion Primitives (MIT). Modified: motion/react removed, `start` and `end` directions follow text direction, per-layer mask and blur come from CSS variables instead of inline styles, layers are capped at 8, and motion none swaps the stack for a single gradient fade.",
      "Place it inside a `relative` scroll container, or above a sticky header, and size it with `size`. Add `isolate` to a rounded `overflow-hidden` parent so the blur is clipped to its corners. It never receives pointer events.",
      "Each layer is a `backdrop-filter`, which is expensive over large areas. Keep overlays small (under about 160px thick) and use fewer layers on low-end devices."
    ],
    props: [
      { prop: "direction", type: '"top" | "bottom" | "start" | "end"', defaultValue: "bottom", description: "Edge the overlay hugs. Blur is strongest at that edge." },
      { prop: "blurLayers", type: "number", defaultValue: "8", description: "Stacked blur layers, clamped to 2 through 8." },
      { prop: "blurIntensity", type: "number", defaultValue: "1", description: "Extra blur in pixels per layer." },
      { prop: "size", type: "number | string", defaultValue: "6rem", description: "Thickness along the axis. Numbers are pixels." },
      { prop: "variant", type: '"default" | "plain" | "glass"', defaultValue: "default", description: "Fade color used at motion none." }
    ],
    accessibility: {
      summary: ["Decorative: aria-hidden and pointer-events-none, so links and scrolling underneath keep working.", "Do not rely on it to hide content from users; the text underneath stays readable by assistive tech.", "Hidden under forced-colors."],
      aria: ["`aria-hidden=\"true\"`", "`data-mode` is `blur` or `fade`"]
    },
    reducedMotion: {
      description: "The blur itself is static. At motion level none the overlay becomes a single gradient fade with no backdrop-filter, which also helps low-power devices.",
      affected: ["backdrop-filter layers"]
    },
    examples: [
      { title: "Default", description: "The bottom of a scrolling feed dissolves into blur.", code: "import { ProgressiveBlur } from \"@glinui/ui\"\n\n<div className=\"relative h-56 overflow-hidden\">\n  <List />\n  <ProgressiveBlur direction=\"bottom\" size={72} />\n</div>", render: <BlurHero /> },
      { title: "Variants", description: "All four edges.", code: "<ProgressiveBlur direction=\"start\" size={56} />", render: <BlurVariants /> },
      { title: "States", description: "Fewer, stronger layers or many soft ones.", code: "<ProgressiveBlur blurLayers={3} blurIntensity={2} />\n<ProgressiveBlur blurLayers={8} blurIntensity={0.6} size={96} />", render: <BlurStates /> },
      { title: "In a layout", description: "Content blurs as it slides under a sticky header.", code: "<div className=\"relative overflow-hidden\">\n  <ProgressiveBlur direction=\"top\" size={56} />\n  <header className=\"absolute inset-x-0 top-0 z-30\">...</header>\n  <List />\n</div>", render: <BlurLayout /> }
    ]
  }
}
