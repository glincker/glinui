"use client"

import { Database, Lightning, Robot, Users } from "@phosphor-icons/react/dist/ssr"
import { forwardRef, useRef, type ReactNode } from "react"
import { AnimatedBeam, FlickeringGrid } from "@glinui/ui"
import type { BatchA3Doc } from "./batch-a3-types"

const FRAME = "relative h-72 w-full overflow-hidden rounded-xl border border-[var(--line-soft)] bg-[var(--surface-0)]"
const LABEL = "relative flex h-full items-center justify-center text-sm font-medium text-[var(--color-foreground)]"

const Node = forwardRef<HTMLDivElement, { children: ReactNode; label: string }>(({ children, label }, ref) => (
  <div
    ref={ref}
    role="img"
    aria-label={label}
    className="z-10 flex size-12 items-center justify-center rounded-full border border-[var(--line-soft)] bg-[var(--surface-0)] text-[var(--color-foreground)] shadow-sm"
  >
    {children}
  </div>
))
Node.displayName = "Node"

function BeamDemo({ reverse = false }: { reverse?: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  const a = useRef<HTMLDivElement>(null)
  const b = useRef<HTMLDivElement>(null)
  return (
    <div ref={container} className={`${FRAME} grid grid-flow-col auto-cols-max items-center justify-between px-10`}>
      <Node ref={a} label="Source">
        <Database size={22} />
      </Node>
      <Node ref={b} label="Destination">
        <Lightning size={22} />
      </Node>
      <AnimatedBeam containerRef={container} fromRef={a} toRef={b} reverse={reverse} curvature={-30} />
    </div>
  )
}

function HubDemo() {
  const container = useRef<HTMLDivElement>(null)
  const hub = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const mid = useRef<HTMLDivElement>(null)
  const bottom = useRef<HTMLDivElement>(null)
  return (
    <div ref={container} className={`${FRAME} grid grid-flow-col auto-cols-max items-center justify-between px-10`}>
      <div className="grid h-full content-between py-8">
        <Node ref={top} label="Users">
          <Users size={22} />
        </Node>
        <Node ref={bottom} label="Database">
          <Database size={22} />
        </Node>
      </div>
      <Node ref={hub} label="Assistant">
        <Robot size={24} />
      </Node>
      <Node ref={mid} label="Events">
        <Lightning size={22} />
      </Node>
      <AnimatedBeam containerRef={container} fromRef={top} toRef={hub} curvature={-40} />
      <AnimatedBeam containerRef={container} fromRef={bottom} toRef={hub} curvature={40} delay={0.6} />
      <AnimatedBeam containerRef={container} fromRef={hub} toRef={mid} delay={1.2} />
    </div>
  )
}

export const batchA3bDocs: Record<string, BatchA3Doc> = {
  "animated-beam": {
    badge: "Decorative / Connector",
    notes: [
      "Adapted from Animated Beam by Magic UI (MIT). Glin UI measures the SVG path and travels a gradient dash along it with the Web Animations API instead of the motion library, observes the container and both anchors with ResizeObserver (the original only watched the container), coalesces updates with requestAnimationFrame, mirrors x offsets in RTL, uses collision-free gradient ids, and falls back to a static line.",
      "The container must be positioned (relative) and contain both anchors. Render the beam after the anchors, with the same refs. The beam draws in the container coordinate space, so avoid transforms on the container.",
      "The three demos use only Phosphor icons, never brand logos."
    ],
    props: [
      { prop: "containerRef", type: "RefObject<HTMLElement>", description: "Positioned ancestor that holds both anchors." },
      { prop: "fromRef / toRef", type: "RefObject<HTMLElement>", description: "Anchor elements. The beam links their centers." },
      { prop: "curvature", type: "number", defaultValue: "0", description: "Bend in px. Positive bends up." },
      { prop: "reverse", type: "boolean", defaultValue: "false", description: "Travel from toRef to fromRef." },
      { prop: "pathColor / pathWidth / pathOpacity", type: "string / number / number", defaultValue: "line token / 2 / 1", description: "Static track styling." },
      { prop: "gradientStartColor / gradientStopColor", type: "string", defaultValue: "accent tokens", description: "Beam colors." },
      { prop: "duration / delay / repeatDelay", type: "number", defaultValue: "4 / 0 / 0", description: "Seconds per pass, before the first pass, and between passes." },
      { prop: "beamLength", type: "number", defaultValue: "0.35", description: "Travelling segment as a share of the path." },
      { prop: "startXOffset / startYOffset / endXOffset / endYOffset", type: "number", defaultValue: "0", description: "Anchor offsets in px. X offsets flip in RTL." }
    ],
    accessibility: {
      summary: [
        "Decorative connector: aria-hidden, not focusable, pointer-events none.",
        "If the connection carries meaning, state it in text next to the anchors.",
        "The track keeps its contrast with the line token and never overlaps text."
      ],
      aria: ["`aria-hidden=\"true\"` on the svg"]
    },
    reducedMotion: {
      description: "At motion level full a gradient segment travels the path. With prefers-reduced-motion or level none or subtle, the beam is a static gradient line. It also pauses offscreen and in background tabs.",
      affected: ["stroke-dashoffset", "opacity"]
    },
    examples: [
      {
        title: "Two nodes",
        description: "Link two anchors with a curved beam.",
        code: `import { useRef } from "react"\nimport { AnimatedBeam } from "@glinui/ui"\n\nexport function Demo() {\n  const container = useRef<HTMLDivElement>(null)\n  const a = useRef<HTMLDivElement>(null)\n  const b = useRef<HTMLDivElement>(null)\n  return (\n    <div ref={container} className="relative flex h-72 items-center justify-between px-10">\n      <div ref={a} className="size-12 rounded-full border" />\n      <div ref={b} className="size-12 rounded-full border" />\n      <AnimatedBeam containerRef={container} fromRef={a} toRef={b} curvature={-30} />\n    </div>\n  )\n}`,
        render: <BeamDemo />
      },
      {
        title: "Reverse",
        description: "Travel from the right anchor to the left.",
        code: `<AnimatedBeam containerRef={container} fromRef={a} toRef={b} reverse />`,
        render: <BeamDemo reverse />
      },
      {
        title: "Integration hub",
        description: "Several beams share one container, staggered with delay.",
        code: `<AnimatedBeam containerRef={container} fromRef={top} toRef={hub} curvature={-40} />\n<AnimatedBeam containerRef={container} fromRef={bottom} toRef={hub} curvature={40} delay={0.6} />\n<AnimatedBeam containerRef={container} fromRef={hub} toRef={out} delay={1.2} />`,
        render: <HubDemo />
      }
    ]
  },
  "flickering-grid": {
    badge: "Background / Canvas",
    notes: [
      "Adapted from Flickering Grid by Magic UI (MIT). Glin UI resolves token and modern CSS colors (var(), oklch(), color-mix()) at runtime and re-resolves them when the theme changes, draws with a devicePixelRatio transform, caps the frame rate (30 fps by default), pauses the loop offscreen and in background tabs, uses a seeded starting pattern, and draws one static frame under reduced motion.",
      "The grid fills its parent (size-full), so give the parent a size. Keep maxOpacity at 0.3 or lower behind text. The loop costs battery, so avoid stacking several grids on one page."
    ],
    props: [
      { prop: "squareSize", type: "number", defaultValue: "4", description: "Square edge in px." },
      { prop: "gridGap", type: "number", defaultValue: "6", description: "Gap between squares in px." },
      { prop: "flickerChance", type: "number", defaultValue: "0.3", description: "Chance per second that a square re-rolls." },
      { prop: "color", type: "string", defaultValue: "var(--color-foreground)", description: "Any CSS color or token." },
      { prop: "maxOpacity", type: "number", defaultValue: "0.3", description: "Highest square opacity." },
      { prop: "maxFps", type: "number", defaultValue: "30", description: "Frame cap." },
      { prop: "variant", type: '"square" | "round"', defaultValue: "square", description: "Cell shape." },
      { prop: "seed", type: "number", defaultValue: "7", description: "Seed for the starting pattern." }
    ],
    accessibility: {
      summary: [
        "Decorative canvas: aria-hidden, pointer-events none.",
        "Flicker is low contrast and slow. Keep maxOpacity at 0.3 or lower; it never flashes more than three times per second per cell on average at default settings.",
        "Content on top should still meet AA contrast."
      ],
      aria: ["`aria-hidden=\"true\"` on the wrapper"]
    },
    reducedMotion: {
      description: "At motion level full squares flicker through requestAnimationFrame. With prefers-reduced-motion or level none or subtle the grid draws a single static frame. The loop pauses offscreen and when the tab is hidden.",
      affected: ["canvas redraw"]
    },
    examples: [
      {
        title: "Default",
        description: "Foreground colored squares.",
        code: `import { FlickeringGrid } from "@glinui/ui"\n\nexport function Demo() {\n  return (\n    <div className="relative h-72 w-full overflow-hidden rounded-xl border bg-[var(--surface-0)]">\n      <FlickeringGrid />\n    </div>\n  )\n}`,
        render: (
          <div className={FRAME}>
            <FlickeringGrid />
            <div className={`absolute inset-0 ${LABEL}`}>Flickering grid</div>
          </div>
        )
      },
      {
        title: "Accent, round",
        description: "Token color and round cells.",
        code: `<FlickeringGrid color="var(--color-accent)" variant="round" squareSize={6} gridGap={10} maxOpacity={0.5} />`,
        render: (
          <div className={FRAME}>
            <FlickeringGrid color="var(--color-accent)" variant="round" squareSize={6} gridGap={10} maxOpacity={0.5} />
          </div>
        )
      },
      {
        title: "Fine and calm",
        description: "Smaller squares, lower frame cap, lower flicker chance.",
        code: `<FlickeringGrid squareSize={3} gridGap={4} flickerChance={0.1} maxFps={15} maxOpacity={0.2} />`,
        render: (
          <div className={FRAME}>
            <FlickeringGrid squareSize={3} gridGap={4} flickerChance={0.1} maxFps={15} maxOpacity={0.2} />
          </div>
        )
      }
    ]
  }
}
