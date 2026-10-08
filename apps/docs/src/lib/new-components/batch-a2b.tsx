"use client"

import { NeonGradientCardHero, NeonGradientCardVariants, NeonGradientCardTones, NeonGradientCardLayout, BentoGridHero, BentoGridVariants, BentoGridTones, BentoGridLayout } from "@/components/demos/family-demos"
import type { BatchA2Doc } from "./batch-a2a"

export const batchA2bDocs: Record<string, BatchA2Doc> = {
  "neon-gradient-card": {
    badge: "Primitive / Molecule",
    notes: [
      "Adapted from Neon Gradient Card by Magic UI (MIT). Modified: the ResizeObserver and width variables are gone (the ring is plain padding so it follows content), colors default to the accent and signal tokens, the gradient is animated through the Web Animations API only at motion level full, and a glass variant was added.",
      "Improvements: one blur layer (smaller on phones), a static ring instead of the glow when motion is none, forced-colors fallback border, and an inner surface on the background token so text keeps contrast."
    ],
    props: [
      { prop: "variant", type: 'SurfaceVariant | "default"', defaultValue: "ambient (glinr)", description: "Face under the ring. Glass is opt-in (translucent blurred face with a masked ring)." },
      { prop: "borderSize", type: "number", defaultValue: "2", description: "Ring thickness in pixels." },
      { prop: "borderRadius", type: "number", defaultValue: "20", description: "Outer radius in pixels. The face radius is derived." },
      { prop: "neonColors", type: "{ firstColor?: string; secondColor?: string }", defaultValue: "accent, signal-ok", description: "Gradient colors." },
      { prop: "duration", type: "number", defaultValue: "6", description: "Seconds per gradient cycle." },
      { prop: "contentClassName", type: "string", description: "Class for the inner face (padding, min-height)." }
    ],
    accessibility: {
      summary: [
        "Ring and glow are aria-hidden decorations. Text lives on the background token face for reliable contrast.",
        "Under forced-colors the layers are hidden and a CanvasText border is used.",
        "Nothing depends on the animation."
      ],
      aria: ["Decorative layers use `aria-hidden=\"true\"`", "`data-animated` reflects the running state"]
    },
    reducedMotion: {
      description: "At motion level none, subtle or with prefers-reduced-motion the gradient stops, and the blurred glow is removed leaving a static ring.",
      affected: ["gradient spin", "glow layer"]
    },
    examples: [
      {
        title: "Default",
        description: "An animated neon ring and soft glow around a pricing card.",
        code: "import { NeonGradientCard } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <NeonGradientCard className=\"w-72\">\n      <PricingCard />\n    </NeonGradientCard>\n  )\n}",
        render: <NeonGradientCardHero />
      },
      {
        title: "Variants",
        description: "glinr is the default, plain is flat shadcn, solid is a neutral tonal face, glass is opt-in and needs a backdrop.",
        code: "import { NeonGradientCard } from \"@glinui/ui\"\n\n// Omit `variant` to follow the ambient style (glinr by default).\nexport function NeonGradientCardVariants() {\n  return (\n    <>\n      <NeonGradientCard variant=\"glinr\">\n        ...\n      </NeonGradientCard>\n      <NeonGradientCard variant=\"plain\">\n        ...\n      </NeonGradientCard>\n      <NeonGradientCard variant=\"solid\">\n        ...\n      </NeonGradientCard>\n      <NeonGradientCard variant=\"glass\">\n        ...\n      </NeonGradientCard>\n    </>\n  )\n}",
        render: <NeonGradientCardVariants />
      },
      {
        title: "Colors",
        description: "`neonColors` takes any two tokens or colors.",
        code: "import { NeonGradientCard } from \"@glinui/ui\"\n\nexport function NeonGradientCardTones() {\n  return (\n    <NeonGradientCard neonColors={{ firstColor: \"var(--tone-success)\", secondColor: \"var(--color-accent)\" }}>\n      ...\n    </NeonGradientCard>\n  )\n}",
        render: <NeonGradientCardTones />
      },
      {
        title: "In a layout",
        description: "A pricing row where the highlighted plan wears the neon ring.",
        code: "// A pricing row where the highlighted plan wears the neon ring.\nimport { NeonGradientCard } from \"@glinui/ui\"\n\nexport function NeonGradientCardLayout() {\n  return (\n    <section className=\"grid gap-4 sm:grid-cols-3\">\n      ...\n    </section>\n  )\n}",
        render: <NeonGradientCardLayout />
      }
    ]
  },
  "bento-grid": {
    badge: "Primitive / Organism",
    notes: [
      "Adapted from Bento Grid by Magic UI (MIT). Modified: a responsive 1, 2 and 3 column grid, the whole card is one real anchor when href is set, the CTA is keyboard reachable and always visible on touch, Phosphor arrow with RTL flip, lift and glass surfaces from the Card tokens.",
      "The original nested a link button inside a div and revealed it on hover only, which keyboard users could not reach. Here the CTA is a styled span inside the single anchor, shown on hover, focus-visible and always on coarse pointers."
    ],
    props: [
      {
        title: "BentoGrid",
        rows: [{ prop: "className", type: "string", description: "Use col-span and row-span classes on cards. Default columns: 1, sm 2, lg 3." }]
      },
      {
        title: "BentoCard",
        rows: [
          { prop: "name", type: "string", description: "Title, rendered as a heading." },
          { prop: "description", type: "string", description: "Supporting copy." },
          { prop: "Icon", type: "React.ElementType", description: "Decorative icon component (Phosphor)." },
          { prop: "href", type: "string", description: "Makes the whole card an anchor." },
          { prop: "cta", type: "string", description: "CTA label shown with an arrow when href is set." },
          { prop: "background", type: "ReactNode", description: "Decorative layer behind the content, aria-hidden." },
          { prop: "variant", type: 'SurfaceVariant | "default"', defaultValue: "ambient (glinr)", description: "Tile surface. Glass is opt-in." },
          { prop: "headingLevel", type: "2 | 3 | 4", defaultValue: "3", description: "Heading level for the name." }
        ]
      }
    ],
    accessibility: {
      summary: [
        "Cards with href are single anchors, so one tab stop per card, with a visible focus ring.",
        "Decorative backgrounds and icons are aria-hidden.",
        "CTA is available without hover: focus reveals it on fine pointers, touch always shows it."
      ],
      keyboard: [
        { key: "Tab", description: "Moves between linked cards." },
        { key: "Enter", description: "Follows the focused card link." }
      ],
      aria: ["Card name is a real heading", "Icon and background are `aria-hidden`"]
    },
    reducedMotion: {
      description: "The hover lift, icon scale and CTA slide are removed with prefers-reduced-motion or motion level none. At level none the CTA is always visible.",
      affected: ["translate lift", "icon scale", "CTA slide and fade"]
    },
    examples: [
      {
        title: "Default",
        description: "Five tiles of mixed size with real content.",
        code: "import { BentoCard, BentoGrid } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <BentoGrid>\n      <BentoCard name=\"Analytics\" description=\"Live charts.\" Icon={ChartLineUp} href=\"#\" cta=\"Open\" className=\"sm:col-span-2\" background={<Bars />} />\n      <BentoCard name=\"Security\" description=\"Signed builds.\" Icon={ShieldCheck} />\n      {/* ...two more tiles */}\n    </BentoGrid>\n  )\n}",
        render: <BentoGridHero />
      },
      {
        title: "Variants",
        description: "glinr is the default, plain is flat shadcn, solid is a neutral tonal face, glass is opt-in and needs a backdrop.",
        code: "import { BentoCard, BentoGrid } from \"@glinui/ui\"\n\n// Omit `variant` to follow the ambient style (glinr by default).\nexport function BentoGridVariants() {\n  return (\n    <>\n      <BentoCard variant=\"glinr\" name=\"...\" description=\"...\" />\n        ...\n      \n      <BentoCard variant=\"plain\" name=\"...\" description=\"...\" />\n        ...\n      \n      <BentoCard variant=\"solid\" name=\"...\" description=\"...\" />\n        ...\n      \n      <BentoCard variant=\"glass\" name=\"...\" description=\"...\" />\n        ...\n      \n    </>\n  )\n}",
        render: <BentoGridVariants />
      },
      {
        title: "Colors",
        description: "Tile washes follow the tone tokens.",
        code: "import { BentoCard, BentoGrid } from \"@glinui/ui\"\n\nexport function BentoGridTones() {\n  return (\n    <BentoCard name=\"Success\" description=\"...\" background={<Wash tone=\"success\" />} />\n      ...\n    \n  )\n}",
        render: <BentoGridTones />
      },
      {
        title: "In a layout",
        description: "A landing section built from bento tiles.",
        code: "// A landing section built from bento tiles.\nimport { BentoCard, BentoGrid } from \"@glinui/ui\"\n\nexport function BentoGridLayout() {\n  return (\n    <section className=\"grid gap-4 sm:grid-cols-3\">\n      ...\n    </section>\n  )\n}",
        render: <BentoGridLayout />
      }
    ]
  }
}
