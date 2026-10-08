"use client"

// Deep imports keep this file independent of the package index until the integrator wires exports.
import { MagicCardHero, MagicCardVariants, MagicCardTones, MagicCardLayout, ShineBorderHero, ShineBorderVariants, ShineBorderTones, ShineBorderLayout } from "@/components/demos/family-demos"
import type { ComponentDocMeta } from "../component-docs"

export type BatchA2Doc = ComponentDocMeta & { notes: string[] }


export const batchA2aDocs: Record<string, BatchA2Doc> = {
  "shine-border": {
    badge: "Primitive / Atom",
    notes: [
      "Adapted from Shine Border by Magic UI (MIT). Modified: colors default to the accent token, the sweep runs through the Web Animations API only at motion level full, the gradient is mirrored in RTL and a glass variant was added.",
      "ShineBorder differs from BorderBeam: the beam is a single travelling dot, the shine is a soft gradient that drifts around the whole edge. The parent must be `relative` and have a border radius, which the layer inherits.",
      "Improvement over the original: no inline style object, no hardcoded black default, and the animation is removed from the DOM when motion is none or reduced."
    ],
    props: [
      { prop: "variant", type: '"default" | "plain" | "glass"', defaultValue: "default", description: "`plain` shines in the foreground color for flat cards, `glass` uses a bright additive shine suited to translucent surfaces." },
      { prop: "borderWidth", type: "number", defaultValue: "1", description: "Border thickness in pixels." },
      { prop: "duration", type: "number", defaultValue: "14", description: "Seconds for one sweep cycle." },
      { prop: "shineColor", type: "string | string[]", defaultValue: "var(--color-accent)", description: "One color or a list of colors for the gradient stops." }
    ],
    accessibility: {
      summary: [
        "Purely decorative: aria-hidden and pointer-events-none, never receives focus or intercepts clicks.",
        "Hidden under forced-colors so the parent keeps its real border.",
        "No information is conveyed by the animation."
      ],
      aria: ["`aria-hidden=\"true\"` on the layer", "`data-animated` reflects whether the sweep is running"]
    },
    reducedMotion: {
      description: "The sweep only runs when the Glin motion level is full and prefers-reduced-motion is off. Otherwise the border renders as a static gradient frame.",
      affected: ["background-position sweep"]
    },
    examples: [
      {
        title: "Default",
        description: "A soft gradient drifts around the edge of a login card.",
        code: "import { Card, ShineBorder } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <Card className=\"relative w-72\">\n      <ShineBorder borderWidth={2} duration={6} />\n      <LoginForm />\n    </Card>\n  )\n}",
        render: <ShineBorderHero />
      },
      {
        title: "Variants",
        description: "glinr is the default, plain is flat shadcn, solid is a neutral tonal face, glass is opt-in and needs a backdrop.",
        code: "import { ShineBorder, Card } from \"@glinui/ui\"\n\n// Omit `variant` to follow the ambient style (glinr by default).\nexport function ShineBorderVariants() {\n  return (\n    <>\n      <Card variant=\"glinr\" className=\"relative\">\n        <ShineBorder borderWidth={2} />\n        ...\n      </Card>\n      <Card variant=\"plain\" className=\"relative\">\n        <ShineBorder borderWidth={2} />\n        ...\n      </Card>\n      <Card variant=\"solid\" className=\"relative\">\n        <ShineBorder borderWidth={2} />\n        ...\n      </Card>\n      <Card variant=\"glass\" className=\"relative\">\n        <ShineBorder borderWidth={2} />\n        ...\n      </Card>\n    </>\n  )\n}",
        render: <ShineBorderVariants />
      },
      {
        title: "Colors",
        description: "`shineColor` takes one color or a list of tokens.",
        code: "import { ShineBorder, Card } from \"@glinui/ui\"\n\nexport function ShineBorderTones() {\n  return (\n    <Card className=\"relative\">\n      <ShineBorder shineColor={[\"var(--tone-success)\", \"var(--color-accent)\"]} />\n      ...\n    </Card>\n  )\n}",
        render: <ShineBorderTones />
      },
      {
        title: "In a layout",
        description: "A pricing row where the highlighted plan wears the shine.",
        code: "// A pricing row where the highlighted plan wears the shine.\nimport { ShineBorder, Card } from \"@glinui/ui\"\n\nexport function ShineBorderLayout() {\n  return (\n    <section className=\"grid gap-4 sm:grid-cols-3\">\n      ...\n    </section>\n  )\n}",
        render: <ShineBorderLayout />
      }
    ]
  },
  "magic-card": {
    badge: "Primitive / Molecule",
    notes: [
      "Adapted from Magic Card by Magic UI (MIT). Modified: motion and next-themes removed, pointer tracking writes CSS variables from a rAF (zero React renders per move), colors come from tokens so dark mode follows the theme, keyboard focus lights the card, and a glass variant was added.",
      "Overlap verdict versus SpotlightCard: about 40 percent. SpotlightCard is a glass-only soft spotlight. MagicCard also lights the border, works on the solid token surface and activates on keyboard focus, so both stay. Use SpotlightCard for a pure glass glow and MagicCard for border-follow grids.",
      "The pointer effect only runs on fine pointers `(hover: hover) and (pointer: fine)`. Touch and coarse pointers get a static card."
    ],
    props: [
      { prop: "variant", type: 'SurfaceVariant | "default"', defaultValue: "ambient (glinr)", description: "Base surface from the Card vocabulary. Glass is opt-in." },
      { prop: "autoPlay", type: "boolean", defaultValue: "false", description: "Loops a slow synthetic pointer (demos, screenshots, touch). Needs motion level full." },
      { prop: "gradientSize", type: "number", defaultValue: "280", description: "Radius in pixels of the spotlight and the border highlight." },
      { prop: "gradientColor", type: "string", defaultValue: "accent tint", description: "Spotlight fill color." },
      { prop: "gradientFrom", type: "string", defaultValue: "var(--color-accent)", description: "Border highlight start color." },
      { prop: "gradientTo", type: "string", defaultValue: "var(--color-signal-ok)", description: "Border highlight end color." },
      { prop: "...CardProps", type: "CardProps", description: "size, elevation and every div attribute are forwarded to Card." }
    ],
    accessibility: {
      summary: [
        "Decorative layers are aria-hidden and pointer-events-none, so nested links and buttons stay clickable.",
        "Content sits above the layers in DOM and paint order. Reading order is untouched.",
        "Keyboard focus inside the card lights it from the center, so the effect is not pointer only."
      ],
      aria: ["`data-active` mirrors the lit state for styling", "Decorative spans use `aria-hidden=\"true\"`"]
    },
    reducedMotion: {
      description: "With motion level none, subtle or prefers-reduced-motion the card is fully static: no tracking, no highlight layers shown.",
      affected: ["pointer-follow spotlight", "border highlight", "opacity transitions"]
    },
    examples: [
      {
        title: "Default",
        description: "The border and surface light up under the pointer. `autoPlay` loops a synthetic pointer so you can see it without hovering.",
        code: "import { MagicCard } from \"@glinui/ui\"\n\nexport function Demo() {\n  return (\n    <MagicCard autoPlay className=\"w-72\">\n      <PricingCard />\n    </MagicCard>\n  )\n}",
        render: <MagicCardHero />
      },
      {
        title: "Variants",
        description: "glinr is the default, plain is flat shadcn, solid is a neutral tonal face, glass is opt-in and needs a backdrop.",
        code: "import { MagicCard } from \"@glinui/ui\"\n\n// Omit `variant` to follow the ambient style (glinr by default).\nexport function MagicCardVariants() {\n  return (\n    <>\n      <MagicCard variant=\"glinr\">\n        ...\n      </MagicCard>\n      <MagicCard variant=\"plain\">\n        ...\n      </MagicCard>\n      <MagicCard variant=\"solid\">\n        ...\n      </MagicCard>\n      <MagicCard variant=\"glass\">\n        ...\n      </MagicCard>\n    </>\n  )\n}",
        render: <MagicCardVariants />
      },
      {
        title: "Colors",
        description: "`gradientFrom`, `gradientTo` and `gradientColor` take any token.",
        code: "import { MagicCard } from \"@glinui/ui\"\n\nexport function MagicCardTones() {\n  return (\n    <MagicCard gradientFrom=\"var(--tone-success)\" gradientColor=\"color-mix(in oklab, var(--tone-success) 24%, transparent)\">\n      ...\n    </MagicCard>\n  )\n}",
        render: <MagicCardTones />
      },
      {
        title: "In a layout",
        description: "A pricing row where the highlighted plan is a MagicCard.",
        code: "// A pricing row where the highlighted plan is a MagicCard.\nimport { MagicCard } from \"@glinui/ui\"\n\nexport function MagicCardLayout() {\n  return (\n    <section className=\"grid gap-4 sm:grid-cols-3\">\n      ...\n    </section>\n  )\n}",
        render: <MagicCardLayout />
      }
    ]
  }
}
