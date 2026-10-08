"use client"

import * as React from "react"
import { ArrowClockwise } from "@phosphor-icons/react"
import { loadEngine } from "@glinui/motion"
import {
  AnimatedSpan,
  BentoCard,
  BentoGrid,
  BlurFade,
  Button,
  Card,
  HyperText,
  NumberTicker,
  RevealText,
  Terminal,
  TextReveal,
  TypingAnimation,
  Typewriter,
  WordRotate
} from "@glinui/ui"
import "@/components/engines/register-engines"

type Engine = "css" | "motion" | "gsap"
const ENGINES: ReadonlyArray<{ id: Engine; label: string }> = [
  { id: "css", label: "CSS" },
  { id: "motion", label: "Motion" },
  { id: "gsap", label: "GSAP" }
]

type Compare = { render: (engine: Engine) => React.ReactNode }

const COMPARE: Record<string, Compare> = {
  typewriter: {
    render: (e) => <Typewriter engine={e} text="Deploying to production" speed={40} loop />
  },
  "number-ticker": {
    render: (e) => <NumberTicker engine={e} value={12480} className="text-2xl font-semibold" />
  },
  "blur-fade": {
    render: (e) => (
      <BlurFade engine={e}>
        <Card className="p-3 text-sm">Fades in from a blur</Card>
      </BlurFade>
    )
  },
  "text-reveal": {
    render: (e) => <TextReveal engine={e} mode="reveal" immediate text="Words arrive one after another." className="[&_p]:text-lg [&_p]:font-semibold [&>div]:py-2" />
  },
  "reveal-text": {
    render: (e) => <RevealText engine={e} text="Wipe reveal" triggerOnView={false} className="text-xl font-bold" />
  },
  "word-rotate": {
    render: (e) => <WordRotate engine={e} words={["fast", "calm", "yours"]} duration={1800} className="text-xl font-bold" />
  },
  "hyper-text": {
    render: (e) => <HyperText engine={e} trigger="mount">Scramble</HyperText>
  },
  terminal: {
    render: (e) => (
      <Terminal engine={e} startOnView={false} showCopy={false}>
        <TypingAnimation duration={35}>pnpm add @glinui/ui</TypingAnimation>
        <AnimatedSpan>Done in 2s</AnimatedSpan>
      </Terminal>
    )
  },
  "bento-grid": {
    render: (e) => (
      <BentoGrid engine={e} entrance immediate className="grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 auto-rows-[minmax(5rem,auto)] gap-2">
        <BentoCard name="Sync" description="Realtime edits." />
        <BentoCard name="Audit" description="Every change." />
      </BentoGrid>
    )
  }
}

/** Side by side columns running the same demo on css, motion and gsap. */
export function EngineColumns({ id }: { id: string }) {
  const [runId, setRunId] = React.useState(0)
  const entry = COMPARE[id]
  React.useEffect(() => {
    for (const e of ENGINES) void loadEngine(e.id).catch(() => undefined)
  }, [])
  if (!entry) return null
  return (
    <div className="flex w-full flex-col gap-3" data-testid={`engine-columns-${id}`}>
      <div>
        <Button size="sm" variant="outline" onClick={() => setRunId((n) => n + 1)}>
          <ArrowClockwise className="size-4" aria-hidden="true" />
          Replay
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {ENGINES.map((e) => (
          <section
            key={`${e.id}-${runId}`}
            aria-label={`${e.label} engine`}
            data-engine-col={e.id}
            className="min-w-0 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--surface-1)] p-3"
          >
            <h4 className="mb-2 text-xs font-semibold text-[var(--color-muted)]">{e.label}</h4>
            {entry.render(e.id)}
          </section>
        ))}
      </div>
    </div>
  )
}
