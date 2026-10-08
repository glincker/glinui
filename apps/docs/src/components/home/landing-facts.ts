import { allComponentIds } from "@/lib/primitives"

/** Verified numeric claims for the landing page. tests/landing-facts.test.mjs checks them against the source data. */
export const COMPONENT_COUNT = allComponentIds.length
export const VARIANT_COUNT = 8
export const BASE_COUNT = 6

export const HERO_SUBHEAD = `${COMPONENT_COUNT} accessible React components, ${VARIANT_COUNT} surface variants, ${BASE_COUNT} base colors, OKLCH tokens and Copy for AI on every page. Tailwind 3 preset and Tailwind 4 entries included.`
export const TRUST_LINE = "MIT licensed. Free forever. No sign-up."

export const PRIMARY_CTA = { href: "/docs/getting-started", label: "Get started" }
export const BROWSE_CTA = { href: "/docs/components", label: "Browse components" }
export const REPO_HREF = "https://github.com/GLINCKER/glinui"
export const DOCS_HREFS = ["/docs/getting-started", "/docs/components", "/docs/shadcn-alternative", "/docs/tokens"] as const

export const FAQ: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Is Glin UI really free?",
    a: "Yes. The code in this repository is MIT licensed and there are no paid tiers. Copies you already have cannot be revoked."
  },
  {
    q: "What license does it use?",
    a: "MIT. You can use it in personal and commercial projects. Third-party adapted code keeps its own attribution, listed in the repository notices."
  },
  {
    q: "Which Tailwind versions work?",
    a: "Tailwind CSS 3 through the @glinui/tokens preset, and Tailwind CSS 4 through the tailwind4.css entries in the same package."
  },
  {
    q: "Which React versions are supported?",
    a: "React 18 and React 19 (peer dependency range ^18.0.0 || ^19.0.0)."
  },
  {
    q: "How is it different from shadcn/ui?",
    a: `Both build on Radix and let you own the source. Glin UI adds a shared token system, ${VARIANT_COUNT} surface variants (glinr, solid, plain, soft, outline, ghost, gradient, glass) and a Copy for AI prompt on every page. Pick shadcn/ui if you want its larger ecosystem.`
  },
  {
    q: "Can I install one component at a time?",
    a: "Yes. Run npx glinui init once, then npx glinui add button, or install the @glinui/ui package."
  }
]
