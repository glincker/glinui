"use client"

// Showcase demos for the motion family (pass S5). Each `// @demo` block is extracted verbatim into the code
// string shown on the docs page (see scripts/gen-s5-code.mjs), so keep blocks free of docs-only helpers.
// Exceptions: BrandIcon (docs logo helper, swap for your own logo component) and the engine registration import.

import { useRef } from "react"
import { ArrowRight, CheckCircle, Cube, Lightning, ShieldCheck, TrendUp } from "@phosphor-icons/react/dist/ssr"
import {
  AnimatedSpan,
  Badge,
  BentoCard,
  BentoGrid,
  BlurFade,
  BorderBeam,
  Button,
  Card,
  CountUp,
  HyperText,
  Input,
  Marquee,
  MorphingText,
  NumberTicker,
  AnimatedBeam,
  Reveal,
  RevealText,
  ShineBorder,
  SparklesText,
  SplitText,
  StaggerList,
  Terminal,
  TextReveal,
  TypingAnimation,
  Typewriter,
  WordRotate
} from "@glinui/ui"
import { BrandIcon } from "@/components/brand/brand-icon"
import "@/components/engines/register-engines"


// @demo
export function WordRotateHero() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-start gap-5 p-6">
      <Badge>Release 0.4</Badge>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Ship interfaces that feel{" "}
        <WordRotate words={["fast", "calm", "accessible", "yours"]} className="text-[var(--color-accent)]" />
      </h2>
      <p className="text-sm text-[var(--color-muted)]">
        A token-driven component library with pluggable motion, built for product teams.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button>
          Get started <ArrowRight className="size-4" aria-hidden />
        </Button>
        <Button variant="outline">Read the docs</Button>
      </div>
    </section>
  )
}

// @demo
export function NumberTickerStats() {
  const stats = [
    { label: "Active workspaces", value: 12480, suffix: "" },
    { label: "Uptime, last 90 days", value: 99.98, suffix: "%" },
    { label: "Median build time (s)", value: 42, suffix: "" }
  ]
  return (
    <dl className="grid w-full max-w-2xl gap-4 p-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="flex flex-col gap-1 p-4">
          <dt className="text-xs text-[var(--color-muted)]">{stat.label}</dt>
          <dd className="text-3xl font-semibold">
            <NumberTicker value={stat.value} decimals={stat.value % 1 ? 2 : 0} />
            {stat.suffix}
          </dd>
        </Card>
      ))}
    </dl>
  )
}

// @demo
export function MarqueeTestimonials() {
  const TESTIMONIALS = [
    { name: "Priya N.", role: "Design engineer", quote: "We replaced three motion helpers with one engine switch." },
    { name: "Marcus T.", role: "Frontend lead", quote: "Reduced motion works without a single extra branch." },
    { name: "Aiko S.", role: "Founder", quote: "Our dashboard feels faster and the bundle got smaller." },
    { name: "Leo B.", role: "Staff engineer", quote: "Tokens, motion and a11y all behave the same everywhere." }
  ]
  
  return (
    <div className="w-full max-w-3xl overflow-hidden p-4">
      <Marquee pauseOnHover speed={40} gap={16}>
        {TESTIMONIALS.map((t) => (
          <Card key={t.name} className="flex w-72 shrink-0 flex-col gap-3 p-4">
            <p className="text-sm">{t.quote}</p>
            <div className="flex items-center gap-3">
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-accent-foreground)]">
                {t.name.slice(0, 1)}
              </span>
              <span className="text-xs">
                <span className="block font-medium">{t.name}</span>
                <span className="text-[var(--color-muted)]">{t.role}</span>
              </span>
            </div>
          </Card>
        ))}
      </Marquee>
    </div>
  )
}

// @demo
export function BlurFadeFeatures() {
  const features = [
    { icon: Lightning, title: "Instant theming", text: "Swap tokens at runtime with no rebuild." },
    { icon: ShieldCheck, title: "Accessible by default", text: "Focus, contrast and motion preferences are handled." },
    { icon: Cube, title: "Copy what you need", text: "Install one component, not a framework." }
  ]
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <BlurFade>
        <h2 className="text-2xl font-semibold tracking-tight">Everything a product team needs</h2>
      </BlurFade>
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map((feature, i) => (
          <BlurFade key={feature.title} delay={120 + i * 120}>
            <Card className="flex h-full flex-col gap-2 p-4">
              <feature.icon className="size-6 text-[var(--color-accent)]" aria-hidden />
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-[var(--color-muted)]">{feature.text}</p>
            </Card>
          </BlurFade>
        ))}
      </div>
    </section>
  )
}

// @demo
export function TypewriterLoading() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-4 p-8 text-center">
      <span aria-hidden className="size-10 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-accent)] motion-reduce:animate-none" />
      <p role="status" className="min-h-6 font-mono text-sm">
        <Typewriter
          words={["Connecting to workspace", "Syncing 128 files", "Preparing your dashboard"]}
          speed={45}
          deleteSpeed={20}
          pauseDuration={1200}
          loop
        />
      </p>
    </div>
  )
}

// @demo
export function TerminalInstall() {
  return (
    <Terminal title="~/my-app" className="max-w-xl" startOnView={false}>
      <TypingAnimation duration={40}>pnpm dlx glinui init</TypingAnimation>
      <AnimatedSpan className="text-[var(--color-muted)]">Detected Next.js and Tailwind CSS</AnimatedSpan>
      <AnimatedSpan className="text-[var(--color-muted)]">Wrote glinui.json and theme tokens</AnimatedSpan>
      <TypingAnimation duration={40}>pnpm dlx glinui add button card</TypingAnimation>
      <AnimatedSpan className="text-[var(--color-signal-ok)]">Added 2 components in 1.2s</AnimatedSpan>
    </Terminal>
  )
}

// @demo
export function LoginShine() {
  return (
    <Card className="relative w-full max-w-sm overflow-hidden p-6">
      <ShineBorder borderWidth={2} duration={8} />
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-lg font-semibold">Sign in</h2>
        <label className="flex flex-col gap-1.5 text-sm">
          Email
          <Input type="email" placeholder="you@company.com" autoComplete="email" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          Password
          <Input type="password" placeholder="At least 12 characters" autoComplete="current-password" />
        </label>
        <Button type="submit">Continue</Button>
      </form>
    </Card>
  )
}

// @demo
export function MetricsBeam() {
  return (
    <Card className="relative w-full max-w-sm overflow-hidden p-5">
      <BorderBeam size={140} duration={7} />
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--color-muted)]">Monthly recurring revenue</span>
        <Badge>
          <TrendUp className="size-3" aria-hidden /> 12.4%
        </Badge>
      </div>
      <p className="mt-2 text-3xl font-semibold">$48,920</p>
      <p className="text-xs text-[var(--color-muted)]">Up from $43,520 last month</p>
    </Card>
  )
}

// @demo
export function IntegrationsBeam() {
  const containerRef = useRef<HTMLDivElement>(null)
  const githubRef = useRef<HTMLDivElement>(null)
  const vercelRef = useRef<HTMLDivElement>(null)
  const cloudflareRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<HTMLDivElement>(null)
  const node = "grid size-12 place-items-center rounded-full border border-[var(--color-border)] bg-[var(--surface-1)]"
  return (
    <div ref={containerRef} className="relative mx-auto flex h-64 w-full max-w-md items-center justify-between overflow-hidden p-6">
      <div className="flex flex-col gap-6">
        <div ref={githubRef} className={node}><BrandIcon name="github" size="md" /></div>
        <div ref={vercelRef} className={node}><BrandIcon name="vercel" size="md" /></div>
        <div ref={cloudflareRef} className={node}><BrandIcon name="cloudflare" size="md" /></div>
      </div>
      <div ref={hubRef} className={`${node} size-16`}>
        <Lightning className="size-7 text-[var(--color-accent)]" aria-hidden />
      </div>
      <AnimatedBeam containerRef={containerRef} fromRef={githubRef} toRef={hubRef} curvature={-30} />
      <AnimatedBeam containerRef={containerRef} fromRef={vercelRef} toRef={hubRef} delay={0.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={cloudflareRef} toRef={hubRef} curvature={30} delay={1.2} />
    </div>
  )
}

// @demo
export function BentoEntrance() {
  return (
    <BentoGrid entrance className="max-w-3xl auto-rows-[minmax(10rem,auto)]">
      <BentoCard name="Realtime sync" description="Edits appear for everyone in under 100ms." Icon={Lightning} className="lg:col-span-2" />
      <BentoCard name="Audit log" description="Every change, with who and when." Icon={ShieldCheck} />
      <BentoCard name="Plugins" description="Extend the workspace with your own blocks." Icon={Cube} />
      <BentoCard name="SSO" description="SAML and SCIM on every paid plan." Icon={CheckCircle} className="lg:col-span-2" />
    </BentoGrid>
  )
}

// @demo
export function HyperTextHero() {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <Badge>Changelog</Badge>
      <HyperText trigger="mount" duration={1000}>Version 0.4 is live</HyperText>
      <p className="text-sm text-[var(--color-muted)]">Hover the headline to scramble it again.</p>
    </div>
  )
}

// @demo
export function TextRevealStory() {
  return (
    <div className="mx-auto max-w-xl p-6">
      <TextReveal
        mode="reveal"
        immediate
        text="Design systems should disappear into the product and leave only the experience."
        className="[&_p]:text-xl [&_p]:font-semibold sm:[&_p]:text-2xl"
      />
    </div>
  )
}

// @demo
export function RevealTextHero() {
  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-3xl font-bold tracking-tight">
        <RevealText text="Build faster." triggerOnView={false} />
      </h2>
      <h2 className="text-3xl font-bold tracking-tight text-[var(--color-accent)]">
        <RevealText text="Ship calmer." triggerOnView={false} delay={500} direction="bottom" />
      </h2>
    </div>
  )
}

// @demo
export function SparklesHero() {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
      <SparklesText as="h2" className="text-4xl font-bold tracking-tight">Glin UI Pro</SparklesText>
      <p className="text-sm text-[var(--color-muted)]">Lifetime access to every template.</p>
      <Button>Unlock access</Button>
    </div>
  )
}

// @demo
export function MorphingHero() {
  return (
    <div className="flex flex-col items-center gap-2 p-6">
      <p className="text-sm text-[var(--color-muted)]">Your workspace is</p>
      <MorphingText texts={["Faster", "Calmer", "Yours"]} className="h-16 w-full max-w-md text-5xl font-bold" />
    </div>
  )
}

// @demo
export function RevealCards() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 p-6">
      <Reveal variant="blur-slide" immediate>
        <h2 className="text-2xl font-semibold tracking-tight">Welcome back, Priya</h2>
      </Reveal>
      <Reveal variant="slide" immediate delay={120}>
        <Card className="p-4 text-sm">You have 3 reviews waiting and one deploy in progress.</Card>
      </Reveal>
      <Reveal variant="scale" immediate delay={240}>
        <Button>Open inbox</Button>
      </Reveal>
    </div>
  )
}

// @demo
export function SplitTextHeadline() {
  return (
    <div className="mx-auto flex max-w-xl flex-col gap-3 p-6">
      <SplitText as="h2" text="Motion that respects the people using it" immediate className="text-3xl font-bold tracking-tight" />
      <SplitText text="Every effect has a static twin and honors reduced motion." immediate step={25} className="text-sm text-[var(--color-muted)]" />
    </div>
  )
}

// @demo
export function CountUpStats() {
  return (
    <div className="grid w-full max-w-2xl gap-4 p-4 sm:grid-cols-3">
      <Card className="p-4">
        <p className="text-xs text-[var(--color-muted)]">Downloads this week</p>
        <p className="text-3xl font-semibold"><CountUp value={84200} immediate /></p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-[var(--color-muted)]">Satisfaction</p>
        <p className="text-3xl font-semibold"><CountUp value={98.6} suffix="%" immediate /></p>
      </Card>
      <Card className="p-4">
        <p className="text-xs text-[var(--color-muted)]">Revenue</p>
        <p className="text-3xl font-semibold"><CountUp value={48920} prefix="$" immediate /></p>
      </Card>
    </div>
  )
}

// @demo
export function StaggerListSteps() {
  const steps = ["Create your workspace", "Invite your team", "Connect a repository", "Ship your first release"]
  return (
    <StaggerList as="ol" immediate className="mx-auto flex max-w-sm flex-col gap-2 p-6">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--surface-1)] p-3 text-sm">
          <span className="grid size-6 place-items-center rounded-full bg-[var(--color-accent)] text-xs font-semibold text-[var(--color-accent-foreground)]">{i + 1}</span>
          {step}
        </li>
      ))}
    </StaggerList>
  )
}
