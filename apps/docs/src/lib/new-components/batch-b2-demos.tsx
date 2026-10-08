"use client"

// Deep imports keep this file independent of the package index until the integrator wires exports.
import { GithubLogo, XLogo } from "@phosphor-icons/react/dist/ssr"
import {
  CtaBand,
  type FaqItem,
  FaqSection,
  FooterBlock,
  type FooterLinkGroup,
  type TestimonialItem,
  TestimonialsWall
} from "@glinui/ui"

/** Placeholder people and quotes only, none are real. */
export const PLACEHOLDER_TESTIMONIALS: TestimonialItem[] = [
  { quote: "Placeholder quote: the setup took an afternoon and the team stopped asking where the buttons came from.", name: "Alex Placeholder", role: "Engineer, Acme", rating: 5 },
  { quote: "Placeholder quote: accessible by default, which saved us a long audit.", name: "Sam Example", role: "Designer, Nimbus", rating: 5 },
  { quote: "Placeholder quote: the tokens made dark mode a one line change.", name: "Jo Sample", role: "Founder, Orbit", rating: 4 },
  { quote: "Placeholder quote: we shipped the marketing site in a week using only the blocks.", name: "Kai Demo", role: "Lead, Vertex" },
  { quote: "Placeholder quote: calm, fast and easy to theme.", name: "Mina Test", role: "PM, Lumen", rating: 5 },
  { quote: "Placeholder quote: documentation answers the questions before we ask them.", name: "Rin Fake", role: "CTO, Helio" }
]

export const PLACEHOLDER_FAQ: FaqItem[] = [
  { question: "Is there a free plan?", answer: "Yes. The core library is free to use in any project.", category: "Billing" },
  { question: "Can I cancel any time?", answer: "Yes. Plans renew monthly and stop the day you cancel.", category: "Billing" },
  { question: "Does it support dark mode?", answer: "Every block reads color tokens, so light and dark follow the theme.", category: "Product" },
  { question: "Is it accessible?", answer: "Landmarks, focus rings and keyboard support are built in.", category: "Product" }
]

export const PLACEHOLDER_GROUPS: FooterLinkGroup[] = [
  { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Changelog", href: "#" }] },
  { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Guides", href: "#" }, { label: "Support", href: "#" }] },
  { title: "Company", links: [{ label: "About", href: "#" }, { label: "Careers", href: "#" }, { label: "Contact", href: "#" }] },
  { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }] }
]

export function TestimonialsWallHero() {
  return <TestimonialsWall items={PLACEHOLDER_TESTIMONIALS} eyebrow="Loved by teams" title="What builders say" description="Placeholder names and quotes for layout only." />
}
export function TestimonialsWallVariants() {
  return (
    <div className="flex flex-col gap-6">
      <TestimonialsWall items={PLACEHOLDER_TESTIMONIALS.slice(0, 3)} layout="marquee-columns" title="Marquee columns" duration={30} />
      <TestimonialsWall items={PLACEHOLDER_TESTIMONIALS} layout="single-quote" title="Single quote" />
    </div>
  )
}
export function TestimonialsWallPlain() {
  return <TestimonialsWall items={PLACEHOLDER_TESTIMONIALS.slice(0, 3)} variant="plain" title="Plain variant" />
}

export function FaqSectionHero() {
  return <FaqSection items={PLACEHOLDER_FAQ} eyebrow="FAQ" title="Questions, answered" description="Everything you need before you start." jsonLd />
}
export function FaqSectionVariants() {
  return (
    <div className="flex flex-col gap-6">
      <FaqSection items={PLACEHOLDER_FAQ} layout="centered" title="Centered" />
      <FaqSection items={PLACEHOLDER_FAQ} categories title="With category tabs" />
    </div>
  )
}

export function CtaBandHero() {
  return (
    <CtaBand layout="boxed-gradient" eyebrow="Ready?" title="Ship a page you are proud of" description="Start with the blocks, change the tokens." primary={{ label: "Get started", href: "#" }} secondary={{ label: "Read the docs", href: "#" }} />
  )
}
export function CtaBandVariants() {
  return (
    <div className="flex flex-col gap-6">
      <CtaBand layout="centered" title="Centered" description="Heading, text and two actions." primary={{ label: "Start", href: "#" }} />
      <CtaBand layout="split" title="Split with a form" description="Copy on one side, email capture on the other." emailCapture={{ buttonLabel: "Join" }} />
      <CtaBand layout="boxed-gradient" variant="plain" title="Plain shell with glow" primary={{ label: "Start", href: "#" }} />
    </div>
  )
}

const SOCIAL = [
  { label: "Source code", href: "#", icon: <GithubLogo weight="regular" /> },
  { label: "Updates on X", href: "#", icon: <XLogo weight="regular" /> }
]
const BRAND = (
  <div className="flex flex-col gap-1">
    <span className="text-base font-semibold text-[var(--color-foreground)]">Acme</span>
    <span className="text-sm text-[var(--color-muted)]">Placeholder tagline for the brand slot.</span>
  </div>
)

export function FooterBlockHero() {
  return (
    <FooterBlock
      brand={BRAND}
      groups={PLACEHOLDER_GROUPS}
      newsletter={{ title: "Stay in the loop", description: "One email a month." }}
      social={SOCIAL}
      copyright="Copyright 2026 Acme Placeholder"
      legal={[{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }]}
      themeToggle={<span className="text-xs text-[var(--color-muted)]">Theme toggle slot</span>}
    />
  )
}
export function FooterBlockVariants() {
  return (
    <div className="flex flex-col gap-6">
      <FooterBlock layout="minimal" brand={BRAND} groups={PLACEHOLDER_GROUPS.slice(0, 1)} social={SOCIAL} copyright="Copyright 2026 Acme Placeholder" />
      <FooterBlock layout="big-wordmark" wordmark="Acme" brand={BRAND} groups={PLACEHOLDER_GROUPS.slice(0, 3)} copyright="Copyright 2026 Acme Placeholder" />
    </div>
  )
}
export function PageLayout() {
  return (
    <div className="flex flex-col">
      <TestimonialsWall items={PLACEHOLDER_TESTIMONIALS.slice(0, 3)} title="Trusted by builders" />
      <FaqSection items={PLACEHOLDER_FAQ} title="FAQ" layout="centered" />
      <CtaBand layout="boxed-gradient" title="Start today" primary={{ label: "Get started", href: "#" }} />
      <FooterBlock brand={BRAND} groups={PLACEHOLDER_GROUPS.slice(0, 3)} copyright="Copyright 2026 Acme Placeholder" />
    </div>
  )
}
