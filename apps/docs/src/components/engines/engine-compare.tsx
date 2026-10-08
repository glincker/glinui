"use client"

import * as React from "react"
import { ArrowClockwise } from "@phosphor-icons/react"
import { Button, CountUp, Reveal, StaggerList } from "@glinui/ui"
import { loadEngine } from "@glinui/motion"
import "./register-engines"

const ENGINES = [
  { id: "css", label: "CSS", note: "Web Animations API" },
  { id: "motion", label: "Motion", note: "motion package, springs" },
  { id: "gsap", label: "GSAP", note: "gsap + ScrollTrigger" }
] as const

/** Side by side comparison of the same Reveal, StaggerList and CountUp on every engine. */
export function EngineCompare() {
  const [runId, setRunId] = React.useState(0)
  const [animated, setAnimated] = React.useState(true)

  React.useEffect(() => {
    for (const engine of ENGINES) void loadEngine(engine.id).catch(() => undefined)
  }, [])

  return (
    <div className="space-y-4" data-testid="engine-compare">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" onClick={() => setRunId((n) => n + 1)} data-testid="engine-replay">
          <ArrowClockwise className="size-4" aria-hidden="true" />
          Replay
        </Button>
        <Button size="sm" variant="outline" aria-pressed={animated} onClick={() => setAnimated((v) => !v)} data-testid="engine-toggle">
          Animations: {animated ? "on" : "off"}
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {ENGINES.map((engine) => (
          <section
            key={`${engine.id}-${runId}-${animated ? "on" : "off"}`}
            data-engine-col={engine.id}
            aria-label={`${engine.label} engine`}
            className="space-y-4 rounded-card border border-line-soft bg-surface-1 p-4 shadow-elev-1"
          >
            <header>
              <h3 className="text-sm font-semibold">{engine.label}</h3>
              <p className="text-xs text-muted">{engine.note}</p>
            </header>
            <Reveal
              engine={engine.id}
              motion={animated ? undefined : "none"}
              variant="blur-slide"
              immediate
              data-demo="reveal"
              className="rounded-card border border-line-soft bg-surface-2 p-3 text-sm"
            >
              Reveal: blur and slide
            </Reveal>
            <StaggerList
              engine={engine.id}
              motion={animated ? undefined : "none"}
              as="ul"
              step={90}
              immediate
              data-demo="stagger"
              className="space-y-1.5"
            >
              <li className="rounded bg-surface-2 px-2 py-1 text-xs">First</li>
              <li className="rounded bg-surface-2 px-2 py-1 text-xs">Second</li>
              <li className="rounded bg-surface-2 px-2 py-1 text-xs">Third</li>
            </StaggerList>
            <p className="text-sm">
              Downloads:{" "}
              <CountUp
                engine={engine.id}
                motion={animated ? undefined : "none"}
                value={48250}
                duration={1400}
                immediate
                data-demo="count"
                className="font-semibold"
              />
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}
