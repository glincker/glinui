"use client"

import { GridPattern, LightRays } from "@glinui/ui"
import type { BatchA3Doc } from "./batch-a3-types"

const FRAME = "relative h-72 w-full overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-0)]"
const LABEL = "relative flex h-full items-center justify-center text-sm font-medium text-[var(--color-foreground)]"

export const batchA3aDocs: Record<string, BatchA3Doc> = {
  "light-rays": {
    badge: "Background / Decorative",
    notes: [
      "Adapted from Light Rays by Magic UI (MIT). Glin UI replaces the motion library with the Web Animations API, builds a deterministic seeded ray layout (no Math.random during render, so no hydration mismatch), reads the accent token, mirrors in RTL, and pauses when offscreen or when the tab is hidden.",
      "Place the component as the first child of a relative parent and keep it behind content (use -z-10 or DOM order). Recommended intensity is 0.5 or lower behind body text so contrast stays at WCAG AA.",
      "Large blur radii are expensive to paint. Count is capped at 24 and only the rays carry will-change."
    ],
    props: [
      { prop: "count", type: "number", defaultValue: "7", description: "Number of rays, capped at 24." },
      { prop: "color", type: "string", defaultValue: "var(--color-accent)", description: "Any CSS color or token." },
      { prop: "variant", type: '"soft" | "crisp"', defaultValue: "soft", description: "Soft uses a 24px blur, crisp uses 6px. An explicit blur wins." },
      { prop: "blur", type: "number", description: "Blur radius in px." },
      { prop: "speed", type: "number", defaultValue: "14", description: "Seconds per sway cycle." },
      { prop: "length", type: "string", defaultValue: "120%", description: "CSS length of each ray." },
      { prop: "intensity", type: "number", defaultValue: "0.35", description: "Overall strength from 0 to 1." },
      { prop: "seed", type: "number", defaultValue: "1", description: "Seed for the deterministic layout." }
    ],
    accessibility: {
      summary: [
        "Purely decorative: aria-hidden and pointer-events none, never focusable.",
        "Keep intensity at 0.5 or lower behind text; verify AA contrast on your own background.",
        "No information is carried by the rays."
      ],
      aria: ["`aria-hidden=\"true\"` on the root"]
    },
    reducedMotion: {
      description: "At motion level full the rays sway with WAAPI. With prefers-reduced-motion or data-glin-motion none or subtle, the rays render as a static frame with no animation. Animations also pause offscreen and in background tabs.",
      affected: ["opacity", "transform"]
    },
    examples: [
      {
        title: "Default",
        description: "Accent colored rays behind a label.",
        code: `import { LightRays } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="relative h-72 w-full overflow-hidden rounded-xl border bg-[var(--surface-0)]">\n      <LightRays />\n      <div className="relative flex h-full items-center justify-center text-sm font-medium">Light rays</div>\n    </div>\n  )\n}`,
        render: (
          <div className={FRAME}>
            <LightRays />
            <div className={LABEL}>Light rays</div>
          </div>
        )
      },
      {
        title: "Crisp rays",
        description: "Fewer, sharper rays with a custom color and slower sway.",
        code: `<LightRays variant="crisp" count={5} speed={20} color="var(--color-accent)" intensity={0.45} />`,
        render: (
          <div className={FRAME}>
            <LightRays variant="crisp" count={5} speed={20} intensity={0.45} />
            <div className={LABEL}>Crisp</div>
          </div>
        )
      },
      {
        title: "Static",
        description: "Pass a different seed for another layout. Under reduced motion this is what everyone sees.",
        code: `<LightRays seed={4} count={9} blur={40} length="100%" />`,
        render: (
          <div className={FRAME}>
            <LightRays seed={4} count={9} blur={40} length="100%" />
            <div className={LABEL}>Seed 4</div>
          </div>
        )
      }
    ]
  },
  "grid-pattern": {
    badge: "Background / Pattern",
    notes: [
      "Adapted from Grid Pattern, Interactive Grid Pattern and Striped Pattern by Magic UI (MIT). Glin UI merges the three into one component with a variant prop, creates collision-free SVG pattern ids with useId, draws strokes with currentColor tied to the line token, and runs the interactive hover with CSS only.",
      "Use the fade prop (or your own mask) so the pattern dissolves toward the edges. Interactive cells need pointer events: content layered above the pattern will intercept them, and the cell count is capped at 1600.",
      "Highlighted squares pulse only at motion level full."
    ],
    props: [
      { prop: "variant", type: '"grid" | "stripes"', defaultValue: "grid", description: "Square grid lines or diagonal stripes." },
      { prop: "fade", type: '"none" | "radial" | "top" | "bottom"', defaultValue: "none", description: "Edge fade built with CSS masks." },
      { prop: "width / height", type: "number", defaultValue: "40", description: "Cell size in px." },
      { prop: "x / y", type: "number", defaultValue: "-1", description: "Pattern offset." },
      { prop: "strokeDasharray", type: "string", defaultValue: "0", description: "Dashed lines, for example \"4 2\"." },
      { prop: "squares", type: "Array<[number, number]>", description: "Highlighted cells as [column, row]." },
      { prop: "squareColor", type: "string", defaultValue: "var(--color-accent)", description: "Highlight and hover color." },
      { prop: "interactive", type: "boolean", defaultValue: "false", description: "Cells light up on hover." }
    ],
    accessibility: {
      summary: [
        "Decorative: aria-hidden, not focusable, pointer-events none (interactive cells opt back in).",
        "Hover highlighting is a visual flourish only and has no keyboard equivalent by design.",
        "Keep line contrast low behind text."
      ],
      aria: ["`aria-hidden=\"true\"` and `focusable=\"false\"` on the svg"]
    },
    reducedMotion: {
      description: "Highlighted squares pulse at motion level full. With reduced motion or level none or subtle the squares are static, and hover cell transitions are removed.",
      affected: ["opacity", "fill"]
    },
    examples: [
      {
        title: "Grid with fade",
        description: "Classic grid that fades toward the edges.",
        code: `import { GridPattern } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="relative h-72 w-full overflow-hidden rounded-xl border bg-[var(--surface-0)]">\n      <GridPattern fade="radial" />\n    </div>\n  )\n}`,
        render: (
          <div className={FRAME}>
            <GridPattern fade="radial" />
            <div className={LABEL}>Grid</div>
          </div>
        )
      },
      {
        title: "Highlighted squares",
        description: "Pick cells by column and row.",
        code: `<GridPattern fade="radial" squares={[[4, 4], [5, 1], [8, 2], [5, 3], [10, 5]]} />`,
        render: (
          <div className={FRAME}>
            <GridPattern fade="radial" squares={[[4, 4], [5, 1], [8, 2], [5, 3], [10, 5], [2, 2]]} />
          </div>
        )
      },
      {
        title: "Stripes",
        description: "Diagonal stripe variant with a dashed stroke.",
        code: `<GridPattern variant="stripes" width={12} height={12} fade="bottom" />`,
        render: (
          <div className={FRAME}>
            <GridPattern variant="stripes" width={12} height={12} fade="bottom" />
          </div>
        )
      },
      {
        title: "Interactive",
        description: "Hover cells to light them up. CSS only.",
        code: `<GridPattern interactive width={32} height={32} />`,
        render: (
          <div className={FRAME}>
            <GridPattern interactive width={32} height={32} />
          </div>
        )
      }
    ]
  }
}
