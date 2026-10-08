import type { Metadata } from "next"

import { CodeBlock } from "@/components/docs/code-block"
import { Callout } from "@/components/docs-pages-b/callout"
import { PageHeader } from "@/components/docs-pages-b/page-header"
import { PageSection } from "@/components/docs-pages-b/page-section"
import { AddEngineGuide } from "@/components/engines/add-engine-guide"
import { EngineCompare } from "@/components/engines/engine-compare"
import { EngineSizes } from "@/components/engines/engine-sizes"
import { LevelsTable } from "@/components/engines/levels-table"
import "@/components/engines/register-engines"
import { createDocsMetadata } from "@/lib/docs-metadata"

export const metadata: Metadata = createDocsMetadata({
  title: "Animation engines",
  description:
    "Choose how GLINUI animates: a zero dependency CSS engine, the motion package, or GSAP. Turn animation off, or add your own engine.",
  path: "/docs/engines",
  keywords: ["animation engine", "motion", "gsap", "reduced motion", "react animation"]
})

const SETUP_CODE = `import { MotionEngineProvider } from "@glinui/ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionEngineProvider engine="motion" motion="system">
      {children}
    </MotionEngineProvider>
  )
}

// Or without React state:
// <html data-glin-engine="gsap" data-glin-motion="none">`

const REGISTER_CODE = `# css is built in, nothing to install. Opt in to the others:
pnpm add motion   # for the motion engine
pnpm add gsap     # for the gsap engine

// app entry (layout, providers or main.tsx), once:
import "@glinui/motion/register/motion"
import "@glinui/motion/register/gsap"

// Manual registration is also available:
import { registerEngine } from "@glinui/motion"
import { gsapEngine } from "@glinui/motion/engines/gsap"
registerEngine("gsap", gsapEngine)`

export default function EnginesPage() {
  return (
    <main className="space-y-10">
      <PageHeader
        eyebrow="Motion system"
        title="Animation engines"
        lead="Animation is a choice, not a constraint. Components that reveal, stagger or count render through the engine you pick, and every one of them can be switched off."
      />

      <PageSection
        id="choose"
        title="Choosing an engine"
        description="All three produce the same visual result. They differ in physics, tooling and weight."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-card border border-line-soft bg-surface-1 p-4">
            <h3 className="text-sm font-semibold">css (default)</h3>
            <p className="mt-2 text-sm text-muted">
              Web Animations API plus IntersectionObserver. No dependency, smallest cost. Spring easing is approximated
              with a bezier curve. Pick it unless you need something below.
            </p>
          </article>
          <article className="rounded-card border border-line-soft bg-surface-1 p-4">
            <h3 className="text-sm font-semibold">motion</h3>
            <p className="mt-2 text-sm text-muted">
              The <code className="type-code">motion</code> package (formerly framer-motion). Real spring physics and
              interruptible animations. Pick it when feel matters or you already use motion.
            </p>
          </article>
          <article className="rounded-card border border-line-soft bg-surface-1 p-4">
            <h3 className="text-sm font-semibold">gsap</h3>
            <p className="mt-2 text-sm text-muted">
              GSAP core with ScrollTrigger for in-view and a hand-rolled text splitter. Pick it for timelines or when
              the rest of your site already runs GSAP.
            </p>
          </article>
        </div>
        <Callout variant="note" title="Optional peer dependencies">
          The css engine is built in and has zero dependencies. <code>motion</code> and <code>gsap</code> are opt-in:
          install the package and import its register entry once. Selecting an engine that was not registered falls
          back to css and logs a one-time warning in development. GSAP is a separate dependency under GreenSock&apos;s
          own license and is not bundled by GLINUI.
        </Callout>
        <CodeBlock code={REGISTER_CODE} language="tsx" />
      </PageSection>

      <PageSection id="cost" title="Bundle cost" description="Gzipped size of each adapter, measured on the built output.">
        <EngineSizes />
      </PageSection>

      <PageSection
        id="compare"
        title="Live comparison"
        description="The same Reveal, StaggerList and CountUp on each engine. Replay to watch them again, or switch animations off."
      >
        <EngineCompare />
      </PageSection>

      <PageSection
        id="levels"
        title="Turning animation on and off"
        description="Animation is on by default. Visitors and developers choose a level; the engine choice is independent."
      >
        <LevelsTable />
        <p className="type-body max-w-[68ch] text-muted">
          Precedence is the component props (<code className="type-code">engine</code>,{" "}
          <code className="type-code">motion</code>), then <code className="type-code">MotionEngineProvider</code> (and
          later GlinProvider), then <code className="type-code">data-glin-engine</code> and{" "}
          <code className="type-code">data-glin-motion</code> on <code className="type-code">&lt;html&gt;</code>, then
          css with full motion.
        </p>
        <CodeBlock code={SETUP_CODE} language="tsx" />
      </PageSection>

      <PageSection
        id="custom"
        title="Add your own engine"
        description="Engines are plugins. Register one by name and every Reveal, SplitText, CountUp and StaggerList can use it."
      >
        <AddEngineGuide />
      </PageSection>
    </main>
  )
}
