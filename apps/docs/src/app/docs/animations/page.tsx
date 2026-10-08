import type { Metadata } from "next"

import { AnimationHub } from "@/components/hub/animation-hub"
import { EasingSection } from "@/components/hub/easing-section"
import { createDocsMetadata } from "@/lib/docs-metadata"
import { hubAnimations } from "@/lib/hub-animations"

export const metadata: Metadata = createDocsMetadata({
  title: "Free Animation Components for React",
  description:
    "Browse free React animation components: text effects, animated backgrounds, glowing borders, buttons, cards, and loaders. Copy an AI prompt or install in one command.",
  path: "/docs/animations",
  keywords: ["react animation components", "free animated components", "tailwind animations", "motion easing tokens"]
})

export default function AnimationsPage() {
  return (
    <main className="space-y-12">
      <section className="space-y-3">
        <p className="type-eyebrow text-[var(--color-accent)]">{hubAnimations.length} free components</p>
        <h1 className="type-h1">Animations</h1>
        <p className="type-lead">
          Copy-paste animated components for React and Tailwind. Hover a card to play it, then grab an AI prompt or the install command.
        </p>
      </section>
      <AnimationHub />
      <EasingSection />
    </main>
  )
}
