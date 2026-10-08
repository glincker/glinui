import type { RegistryItem } from "./index"
import { buildProvenance } from "./provenance"

/**
 * Batch B: marketing blocks, media components and text or edge effects.
 * Five items are ports (one from Vengeance UI, four from Motion Primitives); the rest are
 * own designs or clean-room builds and carry no provenance. Files, npm packages and registry
 * dependencies are re-derived from the real imports at generate time (see scripts/item-graph.mjs).
 */

const SRC = "packages/ui/src"
const MOTION_FILE = `${SRC}/components/motion-engine.tsx`
const PLAYBACK_FILE = `${SRC}/lib/use-playback-active.ts`

type BatchBSpec = {
  name: string
  title: string
  description: string
  kind: "block" | "primitive"
  category: string
  packages?: string[]
  /** Support files shipped next to the component (helper modules the CLI must copy). */
  support?: string[]
  registryDependencies?: string[]
  provenance?: ReturnType<typeof buildProvenance>
}

function item(spec: BatchBSpec): RegistryItem {
  const usesMotion = (spec.support ?? []).includes(MOTION_FILE)
  return {
    name: spec.name,
    namespace: "@glinui",
    type: spec.kind,
    title: spec.title,
    description: spec.description,
    category: spec.category,
    docsPath: `/docs/components/radix/${spec.name}`,
    importPath: "@glinui/ui",
    dependencies: ["@glinui/ui", ...(usesMotion ? ["@glinui/motion"] : []), ...(spec.packages ?? [])],
    ...(spec.registryDependencies ? { registryDependencies: spec.registryDependencies } : {}),
    files: [`${SRC}/components/${spec.name}.tsx`, ...(spec.support ?? []), `${SRC}/tests/${spec.name}.test.tsx`],
    install: {
      package: `npm install @glinui/ui ${usesMotion ? "@glinui/motion " : ""}@glinui/tokens`,
      registry: `pnpm dlx @glinui/cli@latest add ${spec.name}`
    },
    ...(spec.provenance ? { provenance: spec.provenance } : {})
  }
}

const SHELL = `${SRC}/components/block-shell.ts`
const LIB_SHELL = `${SRC}/lib/block-shell.ts`
const MOTION = [MOTION_FILE]
const MOTION_PLAYBACK = [MOTION_FILE, PLAYBACK_FILE]
const CVA = "class-variance-authority"
const PHOSPHOR = "@phosphor-icons/react"
const MOTION_PRIMITIVES_CHANGES =
  "motion/react removed (CSS and Web Animations API), tokens, accessibility, reduced motion levels, RTL"

export const batchBRegistry: RegistryItem[] = [
  item({
    name: "hero-section",
    title: "Hero Section",
    description: "Landing hero with announcement pill, actions, media slot and logo strip in centered, split and stacked layouts.",
    kind: "block",
    category: "blocks",
    packages: [CVA],
    support: [LIB_SHELL]
  }),
  item({
    name: "pricing-section",
    title: "Pricing Section",
    description: "Tier cards with monthly or yearly switch, highlighted plan, check lists and a comparison table layout.",
    kind: "block",
    category: "blocks",
    packages: [PHOSPHOR],
    support: [LIB_SHELL]
  }),
  item({
    name: "logo-cloud",
    title: "Logo Cloud",
    description: "Grayscale-to-color logo strip with a marquee option that respects reduced motion.",
    kind: "block",
    category: "blocks",
    support: MOTION
  }),
  item({
    name: "feature-grid",
    title: "Feature Grid",
    description: "Icon-framed feature cards in three-up, bento, icon-list and alternating-row layouts.",
    kind: "block",
    category: "blocks",
    packages: [PHOSPHOR],
    support: [LIB_SHELL]
  }),
  item({
    name: "testimonials-wall",
    title: "Testimonials Wall",
    description: "Social proof as masonry columns, vertical marquee columns or a single featured quote.",
    kind: "block",
    category: "blocks",
    packages: [PHOSPHOR],
    support: [SHELL, ...MOTION]
  }),
  item({
    name: "faq-section",
    title: "FAQ Section",
    description: "Accordion based FAQ with two column or centered layout, category tabs and a FAQPage JSON-LD helper.",
    kind: "block",
    category: "blocks"
  }),
  item({
    name: "cta-band",
    title: "CTA Band",
    description: "Closing call to action: centered, split with email capture, or boxed with a token glow.",
    kind: "block",
    category: "blocks",
    support: [SHELL]
  }),
  item({
    name: "footer-block",
    title: "Footer Block",
    description: "Site footer with link groups, brand and newsletter slots, social icons, legal row and theme toggle slot.",
    kind: "block",
    category: "blocks",
    support: [SHELL]
  }),
  item({
    name: "cylinder-carousel",
    title: "Cylinder Carousel",
    description: "Slides on a rotating 3D ring with buttons, arrow keys, swipe and a pausable autoplay.",
    kind: "primitive",
    category: "layout",
    packages: [PHOSPHOR],
    support: MOTION,
    provenance: buildProvenance("vengeance-ui", {
      component: "cylinder-carousel",
      adaptedFrom: "src/components/ui/cylinder-carousel.tsx",
      changes:
        "ReactNode items instead of image urls, tokens, keyboard and aria carousel semantics, inert rear slides, autoplay pause, reduced motion, RTL"
    })
  }),
  item({
    name: "image-comparison",
    title: "Image Comparison",
    description: "Before and after layers split by a draggable, keyboard operable slider handle.",
    kind: "primitive",
    category: "data",
    packages: [PHOSPHOR],
    support: MOTION,
    provenance: buildProvenance("motion-primitives", {
      component: "image-comparison",
      adaptedFrom: "components/core/image-comparison.tsx",
      changes: "motion/react and springs removed (pointer capture and CSS clip-path), slider role with keys, ReactNode slots, tokens, reduced motion, RTL"
    })
  }),
  item({
    name: "circular-gallery",
    title: "Circular Gallery",
    description: "Tiles on a ring that rotates to the front with drag inertia, keys, click and optional autorotate.",
    kind: "primitive",
    category: "layout",
    support: MOTION
  }),
  item({
    name: "highlight-grid",
    title: "Highlight Grid",
    description: "Hairline cell grid with one shared highlight that glides to the hovered, tapped or focused cell.",
    kind: "primitive",
    category: "cards",
    support: MOTION
  }),
  item({
    name: "gooey-text-reveal",
    title: "Gooey Text Reveal",
    description: "Heading whose words melt in through a shared SVG goo filter, or morph between phrases.",
    kind: "primitive",
    category: "text",
    packages: [CVA],
    support: MOTION_PLAYBACK
  }),
  item({
    name: "spinning-text",
    title: "Spinning Text",
    description: "Text laid out on a rotating circle with an accessible name and pause on hover.",
    kind: "primitive",
    category: "text",
    packages: [CVA],
    support: MOTION_PLAYBACK,
    provenance: buildProvenance("motion-primitives", {
      component: "spinning-text",
      adaptedFrom: "components/core/spinning-text.tsx",
      changes: MOTION_PRIMITIVES_CHANGES
    })
  }),
  item({
    name: "border-trail",
    title: "Border Trail",
    description: "Glowing comet that travels along the border of a rounded container.",
    kind: "primitive",
    category: "cards",
    packages: [CVA],
    support: MOTION_PLAYBACK,
    provenance: buildProvenance("motion-primitives", {
      component: "border-trail",
      adaptedFrom: "components/core/border-trail.tsx",
      changes: MOTION_PRIMITIVES_CHANGES
    })
  }),
  item({
    name: "progressive-blur",
    title: "Progressive Blur",
    description: "Edge overlay that blurs content progressively using stacked masked backdrop filters.",
    kind: "primitive",
    category: "layout",
    packages: [CVA],
    support: MOTION,
    provenance: buildProvenance("motion-primitives", {
      component: "progressive-blur",
      adaptedFrom: "components/core/progressive-blur.tsx",
      changes: MOTION_PRIMITIVES_CHANGES
    })
  })
]
