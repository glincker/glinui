"use client"

import type { ComponentDocMeta } from "../component-docs"
import * as D from "./batch-b2-demos"

export type BatchB2Doc = ComponentDocMeta & { notes: string[] }

export type BatchB2Meta = {
  id: string
  title: string
  description: string
  badge: "Block / Organism"
  maturity: "beta"
  category: "blocks"
  files: string[]
  dependencies: string[]
}

const entry = (id: string, title: string, description: string, dependencies: string[]): BatchB2Meta => ({
  id,
  title,
  description,
  badge: "Block / Organism",
  maturity: "beta",
  category: "blocks",
  files: [`packages/ui/src/components/${id}.tsx`, `packages/ui/src/tests/${id}.test.tsx`],
  dependencies
})

export const batchB2Meta: BatchB2Meta[] = [
  entry("testimonials-wall", "Testimonials Wall", "Social proof as masonry columns, vertical marquee columns or a single featured quote.", ["@glinui/ui", "@phosphor-icons/react"]),
  entry("faq-section", "FAQ Section", "Accordion based FAQ with two column or centered layout, category tabs and a FAQPage JSON-LD helper.", ["@glinui/ui"]),
  entry("cta-band", "CTA Band", "Closing call to action: centered, split with email capture, or boxed with a token glow.", ["@glinui/ui"]),
  entry("footer-block", "Footer Block", "Site footer with link groups, brand and newsletter slots, social icons, legal row and theme toggle slot.", ["@glinui/ui"])
]

const VARIANT_ROW = { prop: "variant", type: '"glinr" | "plain" | "glass"', defaultValue: "ambient (glinr)", description: "Shell look. `plain` under the minimal style, `glass` is opt-in and needs a backdrop." }

export const batchB2Docs: Record<string, BatchB2Doc> = {
  "testimonials-wall": {
    badge: "Block / Organism",
    notes: [
      "Own design, no photos: avatars are initials. Demo names and quotes are placeholders, never real people.",
      "marquee-columns scrolls two columns in opposite directions with the Web Animations API. Hovering or focusing a column pauses it. With reduced motion or motion level none the columns render static and complete."
    ],
    props: [
      { prop: "items", type: "TestimonialItem[]", description: "quote, name, optional role, rating (0 to 5) and id." },
      { prop: "layout", type: '"masonry-columns" | "marquee-columns" | "single-quote"', defaultValue: "masonry-columns", description: "Column flow, auto-scroll columns, or one featured quote." },
      VARIANT_ROW,
      { prop: "eyebrow / title / description", type: "ReactNode", description: "Section header. The title labels the section." },
      { prop: "duration", type: "number", defaultValue: "40", description: "Seconds per marquee loop." }
    ],
    accessibility: {
      summary: ["A `section` labelled by its heading.", "Each quote is a figure with blockquote and cite.", "Ratings are `role=\"img\"` with a text label.", "The marquee copy is aria-hidden and inert, so screen readers read each quote once."],
      aria: ["`aria-labelledby` on the section", "`aria-label=\"Rated N out of 5\"` on stars"]
    },
    reducedMotion: { description: "No scrolling and no WAAPI animation. Columns show every quote in normal flow.", affected: ["marquee scroll"] },
    examples: [
      { title: "Default", description: "Masonry columns, 1 to 3 wide.", code: "import { TestimonialsWall } from \"@glinui/ui\"\n\n<TestimonialsWall items={items} title=\"What builders say\" />", render: <D.TestimonialsWallHero /> },
      { title: "Variants", description: "Marquee columns and a featured quote.", code: "<TestimonialsWall items={items} layout=\"marquee-columns\" />\n<TestimonialsWall items={items} layout=\"single-quote\" />", render: <D.TestimonialsWallVariants /> },
      { title: "States", description: "Plain shell.", code: "<TestimonialsWall items={items} variant=\"plain\" />", render: <D.TestimonialsWallPlain /> },
      { title: "In a layout", description: "Social proof, FAQ, CTA and footer stacked as a page ending.", code: "<TestimonialsWall items={items} />\n<FaqSection items={faq} />\n<CtaBand title=\"Start today\" />\n<FooterBlock groups={groups} />", render: <D.PageLayout /> }
    ]
  },
  "faq-section": {
    badge: "Block / Organism",
    notes: ["Composes our Accordion, so keyboard and ARIA come from it.", "`faqJsonLd(items)` returns an escaped JSON string for a script tag, or pass `jsonLd` to render it. Rich answers need `answerText` to appear in the JSON-LD."],
    props: [
      { prop: "items", type: "FaqItem[]", description: "question, answer, optional answerText and category." },
      { prop: "layout", type: '"two-column" | "centered"', defaultValue: "two-column", description: "Title left and accordion right, or stacked." },
      { prop: "variant", type: "AccordionVariant", defaultValue: "ambient", description: "Accordion look." },
      { prop: "categories", type: "boolean", defaultValue: "false", description: "Show category tabs when items carry two or more categories." },
      { prop: "multiple", type: "boolean", defaultValue: "false", description: "Allow several items open." },
      { prop: "jsonLd", type: "boolean", defaultValue: "false", description: "Render a FAQPage script." },
      { prop: "aside", type: "ReactNode", description: "Slot such as a contact card." }
    ],
    accessibility: {
      summary: ["Section labelled by its heading.", "Accordion triggers are buttons with aria-expanded.", "Category tabs use the tablist pattern with arrow key navigation."],
      keyboard: [{ key: "Enter / Space", description: "Toggle the focused question" }, { key: "Arrow keys", description: "Move between category tabs" }]
    },
    reducedMotion: { description: "The accordion height animation is removed under reduced motion by the Accordion itself.", affected: ["accordion open and close"] },
    examples: [
      { title: "Default", description: "Two column with FAQPage JSON-LD.", code: "import { FaqSection, faqJsonLd } from \"@glinui/ui\"\n\n<FaqSection items={items} title=\"Questions, answered\" jsonLd />", render: <D.FaqSectionHero /> },
      { title: "Variants", description: "Centered, and with category tabs.", code: "<FaqSection items={items} layout=\"centered\" />\n<FaqSection items={items} categories />", render: <D.FaqSectionVariants /> },
      { title: "States", description: "Single open item by default, `multiple` opens several.", code: "<FaqSection items={items} multiple />", render: <D.FaqSectionVariants /> },
      { title: "In a layout", description: "Between social proof and the closing CTA.", code: "<FaqSection items={items} layout=\"centered\" />", render: <D.PageLayout /> }
    ]
  },
  "cta-band": {
    badge: "Block / Organism",
    notes: ["The glow uses the `--glow-a` and `--glow-b` tokens (no rainbow). Pass `background` to place a gradient mesh or aurora behind the content."],
    props: [
      { prop: "layout", type: '"centered" | "split" | "boxed-gradient"', defaultValue: "centered", description: "Layout of the band." },
      VARIANT_ROW,
      { prop: "title / description / eyebrow", type: "ReactNode", description: "Copy. The title labels the section." },
      { prop: "primary / secondary", type: "CtaAction", description: "Link buttons: label plus anchor attributes (href, rel, target)." },
      { prop: "emailCapture", type: "CtaEmailCapture", description: "Built-in email form with onSubmit(email)." },
      { prop: "glow", type: "boolean", defaultValue: "true for boxed-gradient", description: "Token glow layer." },
      { prop: "background / footnote", type: "ReactNode", description: "Decorative slot and fine print." }
    ],
    accessibility: { summary: ["Section labelled by its heading.", "Email input has a screen reader label and autocomplete.", "Glow and background are aria-hidden and hidden in forced colors."] },
    reducedMotion: { description: "The band is static, there is no animation.", affected: [] },
    examples: [
      { title: "Default", description: "Boxed with a token glow.", code: "<CtaBand layout=\"boxed-gradient\" title=\"Ship it\" primary={{ label: \"Get started\", href: \"/start\" }} />", render: <D.CtaBandHero /> },
      { title: "Variants", description: "Centered, split with email capture, plain shell.", code: "<CtaBand layout=\"split\" title=\"Join\" emailCapture={{ onSubmit }} />", render: <D.CtaBandVariants /> },
      { title: "States", description: "Glow can be forced on any layout with `glow`.", code: "<CtaBand glow title=\"Glow\" />", render: <D.CtaBandVariants /> },
      { title: "In a layout", description: "Closing section before the footer.", code: "<CtaBand title=\"Start today\" />", render: <D.PageLayout /> }
    ]
  },
  "footer-block": {
    badge: "Block / Organism",
    notes: ["Links render plain anchors; target blank links get `noopener noreferrer` automatically. Columns use logical layout, so RTL flips the order."],
    props: [
      { prop: "layout", type: '"columns" | "minimal" | "big-wordmark"', defaultValue: "columns", description: "Footer layout." },
      VARIANT_ROW,
      { prop: "brand / newsletter / social / themeToggle", type: "slots", description: "Brand node, newsletter config, icon links (label required) and a toggle slot." },
      { prop: "groups", type: "FooterLinkGroup[]", description: "Titled link lists, each its own labelled nav." },
      { prop: "copyright / legal", type: "ReactNode / FooterLink[]", description: "Legal row." },
      { prop: "wordmark", type: "string", description: "Oversized text for big-wordmark." }
    ],
    accessibility: { summary: ["`footer` landmark.", "Each group is a `nav` labelled by its title.", "Icon only social links require an accessible label.", "Newsletter input has a screen reader label."] },
    reducedMotion: { description: "No animation, only color transitions that are disabled under reduced motion.", affected: ["link color transition"] },
    examples: [
      { title: "Default", description: "Columns with newsletter, social, legal and theme slot.", code: "<FooterBlock brand={<Logo />} groups={groups} newsletter={{ onSubmit }} social={social} />", render: <D.FooterBlockHero /> },
      { title: "Variants", description: "Minimal row and big wordmark.", code: "<FooterBlock layout=\"minimal\" groups={groups} />\n<FooterBlock layout=\"big-wordmark\" wordmark=\"Acme\" />", render: <D.FooterBlockVariants /> },
      { title: "States", description: "Newsletter and social slots are optional.", code: "<FooterBlock groups={groups} />", render: <D.FooterBlockVariants /> },
      { title: "In a layout", description: "End of a marketing page.", code: "<FooterBlock groups={groups} />", render: <D.PageLayout /> }
    ]
  }
}
