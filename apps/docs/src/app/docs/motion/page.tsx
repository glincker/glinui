import type { Metadata } from "next"
import Link from "next/link"
import {
  createStaggerSequence,
  createScrollLinkedEffect,
  resolveViewTransition,
  resolveSpringPhysics,
  springPresets
} from "@glinui/motion"
import { CodeBlock } from "@/components/docs/code-block"
import { LinkPill } from "@/components/docs-pages/link-pill"
import { PageHeader } from "@/components/docs-pages/page-header"
import { EasingSection } from "@/components/hub/easing-section"
import { BrandTag } from "@/components/brand/brand-tag"
import { MotionPlayground } from "@/components/docs/motion-playground"
import { createDocsMetadata } from "@/lib/docs-metadata"

const springOrder = ["gentle", "smooth", "snappy", "bouncy"] as const
const springCards = springOrder.map((name) => ({
  name,
  config: springPresets[name],
  resolved: resolveSpringPhysics(name)
}))

const scrollEffect = createScrollLinkedEffect({
  start: 0,
  end: 600,
  opacity: [0.6, 1],
  blur: [12, 0],
  translateY: [32, 0],
  scale: [0.96, 1]
})

const scrollSamples = [0, 150, 300, 450, 600].map((scrollY) => ({
  scrollY,
  values: scrollEffect.resolve(scrollY),
  style: scrollEffect.style(scrollY)
}))

const viewTransitionCards = ["pageFade", "pageSlide", "glassLift"] as const
const resolvedTransitions = viewTransitionCards.map((name) => ({
  name,
  transition: resolveViewTransition(name)
}))

const stagger = createStaggerSequence({
  count: 8,
  direction: "center-out",
  stepMs: 48,
  initialDelayMs: 40
})

export const metadata: Metadata = createDocsMetadata({
  title: "Motion",
  description:
    "Reference easing and duration tokens, spring presets, scroll-linked effects, view transitions, and reduced-motion fallbacks.",
  path: "/docs/motion",
  keywords: ["motion system", "spring physics", "view transitions", "reduced motion"]
})

export default function MotionPage() {
  return (
    <main className="space-y-10">
      <PageHeader
        eyebrow="Motion system"
        title="Motion"
        lead="Duration and easing tokens set the baseline. Spring presets, scroll effects, view transitions, and stagger build on top. Always ship a reduced motion path."
      >
        <LinkPill href="/docs/animations" primary>
          Browse animations hub
        </LinkPill>
        <LinkPill href="/docs/tokens#motion">Motion tokens</LinkPill>
        <BrandTag name="motion">Motion springs</BrandTag>
        <BrandTag name="gsap">GSAP engines</BrandTag>
      </PageHeader>

      <div className="border-t border-line-soft pt-8">
        <EasingSection />
      </div>

      <section aria-labelledby="reduced-heading" className="space-y-4 border-t border-line-soft pt-8">
        <h2 id="reduced-heading" className="type-section">
          Reduced motion
        </h2>
        <p className="type-body max-w-[68ch] text-muted">
          Respect <code className="type-code">prefers-reduced-motion</code>. Remove travel and parallax, keep short
          opacity changes, and never gate meaning behind an animation. In Tailwind, use{" "}
          <code className="type-code">motion-safe:</code> to opt in and{" "}
          <code className="type-code">motion-reduce:</code> to opt out.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1">
            <h3 className="text-sm font-medium">Presets</h3>
            <p className="mt-2 text-xs text-muted">
              <code>resolveMotionPreset(name, {"{ reducedMotion: true }"})</code> forces 1ms linear transitions.
            </p>
          </article>
          <article className="rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1">
            <h3 className="text-sm font-medium">Utilities</h3>
            <p className="mt-2 text-xs text-muted">
              resolveViewTransition, createScrollLinkedEffect.style, and createStaggerSequence each accept
              reduced-motion behavior.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Spring Physics</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Configurable spring dynamics. Use preset names or pass custom
          <code className="type-code mx-1 rounded bg-surface-2 px-1 py-0.5">tension</code>,
          <code className="type-code mx-1 rounded bg-surface-2 px-1 py-0.5">friction</code>, and
          <code className="type-code mx-1 rounded bg-surface-2 px-1 py-0.5">mass</code> values.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {springCards.map((card) => (
            <article key={card.name} className="glass-2 rounded-2xl p-5">
              <p className="text-sm font-semibold capitalize">{card.name}</p>
              <p className="mt-2 text-xs text-muted">
                tension {card.config.tension} / friction {card.config.friction} / mass {card.config.mass}
              </p>
              <p className="mt-1 text-xs text-muted">
                damping {card.resolved.dampingRatio.toFixed(2)} / settle{" "}
                {Math.round(card.resolved.settlingDurationMs)}ms
              </p>
              <p className="mt-1 text-xs text-muted">{card.resolved.cssEasing}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Gesture Primitives</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Use pointer-based primitives for drag, swipe, and pinch without adding runtime dependencies.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1">
            <p className="text-sm font-medium">Drag</p>
            <p className="mt-2 text-xs text-muted">
              createDragGesture / useDragGesture
            </p>
          </article>
          <article className="rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1">
            <p className="text-sm font-medium">Swipe</p>
            <p className="mt-2 text-xs text-muted">
              createSwipeGesture / useSwipeGesture
            </p>
          </article>
          <article className="rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1">
            <p className="text-sm font-medium">Pinch</p>
            <p className="mt-2 text-xs text-muted">
              createPinchGesture / usePinchGesture
            </p>
          </article>
        </div>
        <CodeBlock language="ts" code={`import { createSwipeGesture } from "@glinui/motion"

const swipe = createSwipeGesture({
  axis: "x",
  onSwipe: ({ swipe }) => {
    if (!swipe) return
    handleSwipe(swipe.direction, swipe.velocity)
  }
})

element.onpointerdown = swipe.onPointerDown
element.onpointermove = swipe.onPointerMove
element.onpointerup = swipe.onPointerUp
element.onpointercancel = swipe.onPointerCancel`} />
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Scroll-linked Effects</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Tie blur, opacity, and transform values to scroll progress with one resolver.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {scrollSamples.map((sample) => (
            <article key={sample.scrollY} className="glass-2 rounded-2xl p-5">
              <p className="text-sm font-medium">scrollY {sample.scrollY}px</p>
              <p className="mt-2 text-xs text-muted">
                progress {sample.values.progress.toFixed(2)} / opacity {sample.values.opacity?.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted">filter {sample.style.filter ?? "none"}</p>
              <p className="mt-1 text-xs text-muted">transform {sample.style.transform ?? "none"}</p>
            </article>
          ))}
        </div>
        <CodeBlock language="ts" code={`import { createScrollLinkedEffect } from "@glinui/motion"

const heroEffect = createScrollLinkedEffect({
  start: 0,
  end: 600,
  opacity: [0.6, 1],
  blur: [12, 0],
  translateY: [32, 0]
})

const style = heroEffect.style(window.scrollY)`} />
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">View Transitions</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Presets provide page and component enter/exit choreography with consistent opacity and transform transitions.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {resolvedTransitions.map((item) => (
            <article key={item.name} className="glass-2 rounded-2xl p-5">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="mt-2 text-xs text-muted">
                enter {item.transition.enterDurationMs}ms / exit {item.transition.exitDurationMs}ms
              </p>
              <p className="mt-1 text-xs text-muted">
                {item.transition.enter.transition}
              </p>
            </article>
          ))}
        </div>
        <CodeBlock language="ts" code={`import { resolveViewTransition } from "@glinui/motion"

const transition = resolveViewTransition("pageSlide")

// Initial render style
const initialStyle = transition.initial
// Apply on mount
const enterStyle = transition.enter
// Apply before unmount
const exitStyle = transition.exit`} />
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Stagger System</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Orchestrate list and grid choreography with deterministic stagger delays.
        </p>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {stagger.delays.map((delay, index) => (
            <article key={index} className="rounded-input border border-line-soft bg-surface-1 p-3 text-center">
              <p className="text-xs font-medium">#{index + 1}</p>
              <p className="mt-1 text-[11px] text-muted">{delay}ms</p>
            </article>
          ))}
        </div>
        <CodeBlock language="ts" code={`import { createStaggerSequence } from "@glinui/motion"

const stagger = createStaggerSequence({
  count: items.length,
  direction: "center-out",
  stepMs: 48,
  initialDelayMs: 40
})

const style = stagger.getStyle(index) // { transitionDelay: "..." }`} />
      </section>


      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Motion Playground</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Tune spring parameters and inspect derived damping, frequency, settle duration, and easing output.
        </p>
        <MotionPlayground />
      </section>

      <section className="space-y-4 border-t border-line-soft pt-8">
        <h2 className="type-section">Framer Motion Adapter</h2>
        <p className="type-body max-w-[68ch] text-muted">
          Optional adapters let you reuse Glin motion tokens with Framer Motion variants and spring transitions.
        </p>
        <CodeBlock language="ts" code={`// Optional peer
pnpm add framer-motion

import { motion } from "framer-motion"
import { toFramerSpring, toFramerVariants } from "@glinui/motion"

const variants = toFramerVariants("glassLift")
const spring = toFramerSpring("snappy")

export function Card() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={spring}
    />
  )
}`} />
      </section>
    </main>
  )
}
