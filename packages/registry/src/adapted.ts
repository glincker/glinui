import type { RegistryItem } from "./index"
import { buildProvenance } from "./provenance"

/**
 * Components adapted from MIT licensed projects (Magic UI, Vengeance UI).
 * Dependencies are read from the real imports of each component file. The install graph
 * (files, npm packages, registry dependencies) is re-derived from the sources at generate time.
 */

const MAGIC_PATH = "apps/www/registry/magicui"
const SRC = "packages/ui/src"

type AdaptedSpec = {
  name: string
  title: string
  description: string
  category: "text" | "cards" | "backgrounds" | "buttons" | "layout"
  /** Extra npm packages beyond @glinui/ui and @glinui/motion. */
  packages?: string[]
  registryDependencies?: string[]
  /** Support files shipped next to the component. */
  support?: string[]
  source: "magic-ui" | "vengeance-ui"
  /** Upstream component name used for the upstream docs and install links. */
  upstream: string
  adaptedFrom: string | string[]
  changes: string
}

const MOTION_FILE = `${SRC}/components/motion-engine.tsx`
const PLAYBACK_FILE = `${SRC}/lib/use-playback-active.ts`

function magic(names: string[]): string[] {
  return names.map((name) => `${MAGIC_PATH}/${name}.tsx`)
}

function adapted(spec: AdaptedSpec): RegistryItem {
  const support = spec.support ?? [MOTION_FILE]
  const usesMotion = support.includes(MOTION_FILE)
  const packages = ["@glinui/ui", ...(usesMotion ? ["@glinui/motion"] : []), ...(spec.packages ?? [])]
  return {
    name: spec.name,
    namespace: "@glinui",
    type: "primitive",
    title: spec.title,
    description: spec.description,
    category: spec.category,
    docsPath: `/docs/components/radix/${spec.name}`,
    importPath: "@glinui/ui",
    dependencies: packages,
    ...(spec.registryDependencies ? { registryDependencies: spec.registryDependencies } : {}),
    files: [`${SRC}/components/${spec.name}.tsx`, ...support, `${SRC}/tests/${spec.name}.test.tsx`],
    install: {
      package: `npm install @glinui/ui ${usesMotion ? "@glinui/motion " : ""}@glinui/tokens`,
      registry: `pnpm dlx @glinui/cli@latest add ${spec.name}`
    },
    provenance: buildProvenance(spec.source, {
      component: spec.upstream,
      adaptedFrom: spec.adaptedFrom,
      changes: spec.changes
    })
  }
}

const CVA = "class-variance-authority"
const PHOSPHOR = "@phosphor-icons/react"

export const adaptedRegistry: RegistryItem[] = [
  adapted({
    name: "hyper-text",
    title: "Hyper Text",
    description: "Text that scrambles through random characters and settles on the real string, on hover, in view or on mount.",
    category: "text",
    source: "magic-ui",
    upstream: "hyper-text",
    adaptedFrom: magic(["hyper-text"]),
    changes: "Design tokens, no motion dependency (rAF scramble), real text kept for screen readers, reduced motion levels, trigger modes and SSR safe first paint."
  }),
  adapted({
    name: "morphing-text",
    title: "Morphing Text",
    description: "Cycles through words with a gooey blur and threshold morph, paused off screen and static under reduced motion.",
    category: "text",
    source: "magic-ui",
    upstream: "morphing-text",
    adaptedFrom: magic(["morphing-text"]),
    changes: "Per instance SVG filter id, off screen pause, reduced motion levels, an accessible word list and token colors."
  }),
  adapted({
    name: "sparkles-text",
    title: "Sparkles Text",
    description: "Text with twinkling star sparkles that scale and rotate, with a static accent under reduced motion.",
    category: "text",
    source: "magic-ui",
    upstream: "sparkles-text",
    adaptedFrom: magic(["sparkles-text"]),
    changes: "No motion dependency (Web Animations), sparkles generated after mount for SSR safety, token colors and reduced motion levels."
  }),
  adapted({
    name: "gradient-text",
    title: "Gradient Text",
    description: "Flowing gradient or shine sweep text, optionally inside a solid or glass pill badge.",
    category: "text",
    packages: [CVA],
    source: "magic-ui",
    upstream: "animated-gradient-text",
    adaptedFrom: magic(["animated-gradient-text", "animated-shiny-text"]),
    changes: "Merged gradient and shine variants, token colors, glass badge surface, forced colors fallback and reduced motion levels."
  }),
  adapted({
    name: "shine-border",
    title: "Shine Border",
    description: "Animated gradient edge that wraps any rounded container.",
    category: "cards",
    packages: [CVA],
    source: "magic-ui",
    upstream: "shine-border",
    adaptedFrom: magic(["shine-border"]),
    changes: "Token colors, Web Animations gated by motion level, logical RTL direction, a glass variant and no inline styles."
  }),
  adapted({
    name: "magic-card",
    title: "Magic Card",
    description: "Card whose border and surface light up under the pointer or keyboard focus.",
    category: "cards",
    registryDependencies: ["card"],
    source: "magic-ui",
    upstream: "magic-card",
    adaptedFrom: magic(["magic-card"]),
    changes: "Removed motion and next-themes, CSS variables written on animation frames, token colors, fine pointer gating and a glass variant."
  }),
  adapted({
    name: "neon-gradient-card",
    title: "Neon Gradient Card",
    description: "Card with an animated neon gradient ring and soft glow.",
    category: "cards",
    packages: [CVA],
    source: "magic-ui",
    upstream: "neon-gradient-card",
    adaptedFrom: magic(["neon-gradient-card"]),
    changes: "Token colors, padding based ring without a ResizeObserver, Web Animations gated by motion level and a glass variant."
  }),
  adapted({
    name: "bento-grid",
    title: "Bento Grid",
    description: "Responsive bento layout of linked feature tiles.",
    category: "cards",
    packages: [CVA, PHOSPHOR],
    registryDependencies: ["card"],
    source: "magic-ui",
    upstream: "bento-grid",
    adaptedFrom: magic(["bento-grid"]),
    changes: "Responsive columns, whole tile anchor with a keyboard reachable action, lift and glass surfaces, Phosphor arrow mirrored for RTL."
  }),
  adapted({
    name: "light-rays",
    title: "Light Rays",
    description: "Soft swaying rays of light for hero and section backgrounds.",
    category: "backgrounds",
    packages: [CVA],
    support: [MOTION_FILE, PLAYBACK_FILE],
    source: "magic-ui",
    upstream: "light-rays",
    adaptedFrom: magic(["light-rays"]),
    changes: "Web Animations instead of motion, seeded rays, token colors, reduced motion levels, offscreen pause and RTL mirroring."
  }),
  adapted({
    name: "grid-pattern",
    title: "Grid Pattern",
    description: "SVG grid, stripes and interactive cell patterns with edge fades.",
    category: "backgrounds",
    packages: [CVA],
    source: "magic-ui",
    upstream: "grid-pattern",
    adaptedFrom: magic(["grid-pattern", "interactive-grid-pattern", "striped-pattern"]),
    changes: "Merged grid, interactive and stripes variants, token colors, collision free SVG ids, CSS only hover cells and edge fade masks."
  }),
  adapted({
    name: "animated-beam",
    title: "Animated Beam",
    description: "A gradient beam that travels between two elements.",
    category: "backgrounds",
    support: [MOTION_FILE, PLAYBACK_FILE],
    source: "magic-ui",
    upstream: "animated-beam",
    adaptedFrom: magic(["animated-beam"]),
    changes: "SVG path measurement with Web Animations instead of motion, resize aware anchors, RTL offsets, token colors and reduced motion levels."
  }),
  adapted({
    name: "flickering-grid",
    title: "Flickering Grid",
    description: "Canvas grid of squares that flicker, with token colors and a static fallback.",
    category: "backgrounds",
    support: [MOTION_FILE, PLAYBACK_FILE],
    source: "magic-ui",
    upstream: "flickering-grid",
    adaptedFrom: magic(["flickering-grid"]),
    changes: "Token colors resolved at runtime, device pixel ratio transform, frame rate cap, pause offscreen and hidden, static frame for reduced motion."
  }),
  adapted({
    name: "interactive-hover-button",
    title: "Interactive Hover Button",
    description: "Pill button whose accent dot floods the surface on hover, focus or press.",
    category: "buttons",
    packages: [CVA, PHOSPHOR],
    registryDependencies: ["button", "spinner"],
    source: "magic-ui",
    upstream: "interactive-hover-button",
    adaptedFrom: magic(["interactive-hover-button"]),
    changes: "Clip path fill, a single accessible label, focus and press parity, token colors, RTL, sizes, glass and loading states."
  }),
  adapted({
    name: "generate-button",
    title: "Generate Button",
    description: "AI style call to action with idle, generating and loading states.",
    category: "buttons",
    packages: [CVA, PHOSPHOR],
    registryDependencies: ["button", "spinner"],
    source: "vengeance-ui",
    upstream: "generate-button",
    adaptedFrom: "src/components/ui/generate-button.tsx",
    changes: "Scoped Tailwind instead of an injected style tag, token colors, explicit generating and loading states, live status text, glass and sizes."
  }),
  adapted({
    name: "browser-frame",
    title: "Browser Frame",
    description: "Generic browser window chrome drawn in CSS with a slot for any content.",
    category: "layout",
    packages: [CVA, PHOSPHOR],
    support: [],
    source: "magic-ui",
    upstream: "safari",
    adaptedFrom: magic(["safari"]),
    changes: "Generic CSS chrome instead of a monolithic SVG, children slot, token colors, glass, RTL, real address text and no bundled media."
  }),
  adapted({
    name: "terminal",
    title: "Terminal",
    description: "Terminal window with sequenced typing and output, a full transcript and copy.",
    category: "text",
    packages: [CVA, PHOSPHOR],
    registryDependencies: ["copy-button"],
    source: "magic-ui",
    upstream: "terminal",
    adaptedFrom: magic(["terminal"]),
    changes: "Timers and CSS instead of motion, static first render, full transcript for assistive tech, copy button, token colors and glass."
  })
]
