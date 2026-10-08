"use client"

import type { ComponentDocMeta } from "../component-docs"
import {
  FeatureGridDemo, FeatureGridLayoutsDemo, HeroDemo, HeroLayoutDemo, HeroVariantsDemo,
  LogoCloudDemo, LogoCloudVariantsDemo, PricingDemo, PricingStatesDemo
} from "./batch-b1-demos"

export type BatchB1Doc = ComponentDocMeta & { notes: string[] }

export type BatchB1Meta = {
  id: string
  title: string
  description: string
  badge: "Block"
  maturity: "beta"
  category: "blocks"
  files: string[]
  dependencies: string[]
}

const LOOKS = "Omit `variant` to follow the ambient style: glinr (open canvas), plain under minimal, glass panel when opted in."
const BLOCK_REDUCED = (what: string) => ({ description: `Entrance reveals and ${what} follow the Glin motion level. At level none or prefers-reduced-motion everything renders in its final static state.` })

export const batchB1Docs: Record<string, BatchB1Doc> = {
  "hero-section": {
    badge: "Block",
    notes: [
      "Own design, composed from Badge, Heading, Text, Button and Reveal. Layout inspiration only from public MIT hero blocks; no upstream markup is copied.",
      "The `background` slot takes any decorative node (GridPattern, AuroraBackground, a gradient). It is aria-hidden and never intercepts pointer events.",
      "Links render real anchors through `href`; pass `onClick` for client routers."
    ],
    props: [
      { prop: "layout", type: '"centered" | "split" | "stacked-media"', defaultValue: "centered", description: "`split` puts copy at the start and media at the end (mirrored in RTL)." },
      { prop: "variant", type: '"glinr" | "plain" | "glass"', defaultValue: "ambient", description: LOOKS },
      { prop: "title", type: "ReactNode", description: "Headline, rendered as an h1 (see `headingLevel`)." },
      { prop: "description", type: "ReactNode", description: "Lede under the headline." },
      { prop: "announcement / announcementHref", type: "ReactNode / string", description: "Pill above the headline. A string gets an accent dot; a href makes it a link." },
      { prop: "primaryAction / secondaryAction", type: "{ label, href?, onClick?, icon?, variant? }", description: "Two actions. With `href` they are anchors." },
      { prop: "media", type: "ReactNode", description: "Screenshot, video or illustration slot." },
      { prop: "logos", type: "ReactNode", description: "Strip under the hero, usually a LogoCloud." },
      { prop: "background", type: "ReactNode", description: "Decorative layer behind the content." },
      { prop: "entrance", type: "boolean", defaultValue: "true", description: "Reveal the copy on mount through the motion engine." }
    ],
    accessibility: {
      summary: ["A `section` labelled by the headline, which is the page h1 by default.", "Decorative background is aria-hidden.", "Announcement link and actions keep visible focus rings."],
      aria: ["`aria-labelledby` points at the headline", "`aria-hidden` on the background layer"]
    },
    reducedMotion: { ...BLOCK_REDUCED("the copy blur-slide") },
    examples: [
      { title: "Default", description: "Split hero with an announcement pill, two actions, a media slot, a grid background and a logo strip.", code: "import { HeroSection, LogoCloud } from \"@glinui/ui\"\n\n<HeroSection\n  layout=\"split\"\n  announcement=\"Release 0.2 is out\"\n  title=\"Interfaces that feel finished on day one\"\n  description=\"Tokens, primitives and blocks that share one lighting model.\"\n  primaryAction={{ label: \"Get started\", href: \"/start\" }}\n  secondaryAction={{ label: \"Read the docs\", href: \"/docs\" }}\n  media={<Screenshot />}\n  background={<GridPattern />}\n  logos={<LogoCloud items={logos} />}\n/>", render: <HeroDemo /> },
      { title: "Variants", description: "Centered with a pill, and stacked media on a glass shell.", code: "<HeroSection title=\"Centered with a pill\" announcement=\"New\" primaryAction={{ label: \"Start\", href: \"#\" }} />\n<HeroSection variant=\"glass\" layout=\"stacked-media\" title=\"Stacked media\" media={<Screenshot />} />", render: <HeroVariantsDemo /> },
      { title: "In a layout", description: "A hero followed by a feature section.", code: "<>\n  <HeroSection ... />\n  <FeatureGrid ... />\n</>", render: <HeroLayoutDemo /> }
    ]
  },
  "pricing-section": {
    badge: "Block",
    notes: [
      "Own design from Card, Switch, Badge, Button, Table and ShineBorder. Prices are numbers formatted with `Intl.NumberFormat`, so currency and locale are props, never hardcoded.",
      "Billing is controlled (`billing`) or uncontrolled (`defaultBilling`), with `onBillingChange` in both cases.",
      "Tier prices are per month for each period. Pass a string such as \"Custom\" for contact-sales tiers."
    ],
    props: [
      { prop: "tiers", type: "PricingTier[]", description: "id, name, description, price ({ monthly, yearly } or string), period, features, cta, highlighted, badge." },
      { prop: "layout", type: '"cards" | "table"', defaultValue: "cards", description: "`table` renders `comparison` rows in a Table." },
      { prop: "billing / defaultBilling / onBillingChange", type: "BillingPeriod", defaultValue: "monthly", description: "Controlled and uncontrolled period." },
      { prop: "currency / locale", type: "string", defaultValue: "USD / runtime", description: "Passed to Intl.NumberFormat." },
      { prop: "highlightEffect", type: '"shine" | "none"', defaultValue: "shine", description: "ShineBorder on the highlighted tier." },
      { prop: "yearlyNote", type: "string", description: "Badge beside the toggle, for example Save 20%." },
      { prop: "hideToggle", type: "boolean", defaultValue: "false", description: "Hide the switch for single-period pricing." },
      { prop: "variant", type: '"glinr" | "plain" | "glass"', defaultValue: "ambient", description: LOOKS }
    ],
    accessibility: {
      summary: ["The price is an aria-live polite region, so a toggle is announced.", "The switch has the name Bill yearly; the visible Monthly and Yearly labels show the state.", "Features are lists with decorative check icons; the table uses column and row headers and text for included or not included."],
      keyboard: [{ key: "Space / Enter", description: "Toggle billing period on the switch" }],
      aria: ["`aria-live=\"polite\"` on prices", "`role=\"switch\"` from Switch"]
    },
    reducedMotion: { ...BLOCK_REDUCED("the highlighted shine") },
    examples: [
      { title: "Default", description: "Three tiers, a highlighted middle tier and a monthly or yearly switch.", code: "import { PricingSection } from \"@glinui/ui\"\n\n<PricingSection\n  title=\"Simple pricing\"\n  yearlyNote=\"Save 20%\"\n  tiers={[\n    { id: \"solo\", name: \"Solo\", price: { monthly: 12, yearly: 9 }, features: [\"1 workspace\"], cta: { label: \"Start\", href: \"/start\" } },\n    { id: \"team\", name: \"Team\", price: { monthly: 32, yearly: 26 }, features: [\"Unlimited\"], cta: { label: \"Trial\" }, highlighted: true, badge: \"Most popular\" }\n  ]}\n/>", render: <PricingDemo /> },
      { title: "States", description: "Yearly default with euro formatting, and the comparison table layout.", code: "<PricingSection tiers={tiers} defaultBilling=\"yearly\" currency=\"EUR\" locale=\"de-DE\" highlightEffect=\"none\" />\n<PricingSection tiers={tiers} layout=\"table\" comparison={[{ label: \"Audit log\", values: [false, true, true] }]} />", render: <PricingStatesDemo /> }
    ]
  },
  "logo-cloud": {
    badge: "Block",
    notes: [
      "Own design. Items are ReactNode (or `{ name, logo, href }`), so the block works with any SVG set. The demos use generated text wordmarks; never ship real brand marks without permission.",
      "The marquee reuses Marquee. Looped copies are aria-hidden, so linked items render unlinked there. Use the grid layout when logos must link.",
      "Under reduced motion or motion none the marquee becomes the static grid."
    ],
    props: [
      { prop: "items", type: "Array<ReactNode | { name, logo, href? }>", description: "Logos." },
      { prop: "layout", type: '"grid" | "marquee"', defaultValue: "grid", description: "Static responsive list or scrolling row." },
      { prop: "fadeEdges", type: "boolean", defaultValue: "true", description: "Masks the marquee ends." },
      { prop: "grayscale", type: "boolean", defaultValue: "true", description: "Grayscale until hover or focus." },
      { prop: "speed", type: "number", defaultValue: "40", description: "Seconds per loop." },
      { prop: "title / listLabel", type: "ReactNode / string", description: "Caption above and the accessible list label (default Trusted by)." }
    ],
    accessibility: {
      summary: ["The grid is a labelled list.", "Named logos expose `role=img` with the name, or a link with an aria-label.", "The marquee pauses on hover and on keyboard focus."],
      aria: ["`aria-label` on the list or group", "`aria-hidden` on the looped copy"]
    },
    reducedMotion: { ...BLOCK_REDUCED("the marquee scroll") },
    examples: [
      { title: "Default", description: "Grayscale wordmarks that turn to full color on hover.", code: "import { LogoCloud, LogoWordmark } from \"@glinui/ui\"\n\nconst items = [\"Acme\", \"Nimbus\"].map((name) => ({ name, logo: <LogoWordmark>{name}</LogoWordmark> }))\n\n<LogoCloud items={items} title=\"Trusted by teams at\" />", render: <LogoCloudDemo /> },
      { title: "Variants", description: "Marquee with and without faded edges, and a short grid.", code: "<LogoCloud layout=\"marquee\" items={items} />\n<LogoCloud layout=\"marquee\" fadeEdges={false} grayscale={false} items={items} />", render: <LogoCloudVariantsDemo /> }
    ]
  },
  "feature-grid": {
    badge: "Block",
    notes: [
      "Own design from Card, IconFrame, Heading and Text. The `bento` layout composes BentoGrid for the grid and uses Card tiles with repeating spans; it does not duplicate BentoCard.",
      "Icons are nodes (Phosphor elements work). They are decorative and wrapped in an IconFrame."
    ],
    props: [
      { prop: "features", type: "FeatureItem[]", description: "icon, title, description, href, linkLabel, media (alternating-rows), span (bento)." },
      { prop: "layout", type: '"three-up" | "alternating-rows" | "bento" | "icon-list"', defaultValue: "three-up", description: "Arrangement." },
      { prop: "eyebrow / title / description", type: "ReactNode", description: "Section header." },
      { prop: "headingLevel", type: "2 | 3", defaultValue: "2", description: "Section heading level; cards use the next level." },
      { prop: "variant", type: '"glinr" | "plain" | "glass"', defaultValue: "ambient", description: LOOKS }
    ],
    accessibility: {
      summary: ["A `section` labelled by its heading with headings in order.", "Rows and icon lists are semantic lists.", "Card links are real anchors with focus rings."],
      aria: ["`aria-labelledby` on the section", "`aria-hidden` on icon frames"]
    },
    reducedMotion: { ...BLOCK_REDUCED("the card hover lift") },
    examples: [
      { title: "Default", description: "Six cards in a responsive 1, 2, 3 column grid.", code: "import { FeatureGrid } from \"@glinui/ui\"\nimport { Gauge } from \"@phosphor-icons/react/dist/ssr\"\n\n<FeatureGrid\n  eyebrow=\"Why Glin\"\n  title=\"Everything a landing page needs\"\n  features={[{ icon: <Gauge weight=\"duotone\" />, title: \"Fast\", description: \"Server first.\", href: \"/fast\" }]}\n/>", render: <FeatureGridDemo /> },
      { title: "Variants", description: "Bento, icon list and alternating rows.", code: "<FeatureGrid layout=\"bento\" features={features} />\n<FeatureGrid layout=\"icon-list\" features={features} />\n<FeatureGrid layout=\"alternating-rows\" features={features} />", render: <FeatureGridLayoutsDemo /> }
    ]
  }
}

const entry = (id: string, title: string, description: string, dependencies: string[]): BatchB1Meta => ({
  id, title, description, badge: "Block", maturity: "beta", category: "blocks",
  files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`, "packages/ui/src/lib/block-shell.ts"],
  dependencies
})

export const batchB1Meta: BatchB1Meta[] = [
  entry("hero-section", "Hero Section", "Landing hero with announcement pill, actions, media slot and logo strip in centered, split and stacked layouts.", ["@glinui/ui"]),
  entry("pricing-section", "Pricing Section", "Tier cards with monthly or yearly switch, highlighted plan, check lists and a comparison table layout.", ["@glinui/ui", "@radix-ui/react-switch"]),
  entry("logo-cloud", "Logo Cloud", "Grayscale-to-color logo strip with a marquee option that respects reduced motion.", ["@glinui/ui"]),
  entry("feature-grid", "Feature Grid", "Icon-framed feature cards in three-up, bento, icon-list and alternating-row layouts.", ["@glinui/ui"])
]
