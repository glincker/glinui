"use client"

import * as React from "react"
import { CircleNotch } from "@phosphor-icons/react"
import { hasEngine, loadEngine } from "@glinui/motion"

import "@/components/engines/register-engines"
import { cn } from "@glinui/ui"
import { BrandIcon } from "@/components/brand/brand-icon"
import type { BrandName } from "@/components/brand/brands"
import { STAGE_CONTROLS_ATTR } from "@/components/docs/stage-container"
import { useStagePlayback } from "./playback-context"

interface EngineOption {
  id: string
  label: string
  brand: BrandName
  note: string
}

const ENGINES: readonly EngineOption[] = [
  { id: "css", label: "CSS", brand: "css3", note: "built in, no extra JS" },
  { id: "motion", label: "Motion", brand: "motion", note: "WAAPI, loads on demand" },
  { id: "gsap", label: "GSAP", brand: "gsap", note: "script-driven, loads gsap on demand" }
]

/** Quiet icon pill that switches the motion engine for one stage. Hidden for non engine-aware demos. */
export function EngineSwitcher({ className }: { className?: string }) {
  const { engineAware, engine, selectEngine } = useStagePlayback()
  const [loading, setLoading] = React.useState<string | null>(null)
  const [failed, setFailed] = React.useState<string | null>(null)
  const alive = React.useRef(true)

  React.useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  const choose = React.useCallback(
    (id: string) => {
      setFailed(null)
      if (id === "css") {
        selectEngine("css")
        return
      }
      setLoading(id)
      loadEngine(id).then(
        () => {
          if (!alive.current) return
          setLoading(null)
          selectEngine(id)
        },
        () => {
          if (!alive.current) return
          setLoading(null)
          setFailed(id)
          selectEngine("css")
        }
      )
    },
    [selectEngine]
  )

  if (!engineAware) return null

  return (
    <section
      {...{ [STAGE_CONTROLS_ATTR]: "" }}
      aria-label="Animation engine"
      className={cn("pointer-events-auto absolute left-2.5 top-2.5 z-10 flex items-center gap-2", className)}
    >
      <div
        role="group"
        aria-label="Animation engine"
        className="inline-flex items-center gap-0.5 rounded-full bg-[color-mix(in_oklab,var(--surface-1)_82%,transparent)] p-0.5 [box-shadow:var(--elev-1)] ring-1 ring-[var(--line-soft)] backdrop-blur-md"
      >
        {ENGINES.map((option) => {
          const available = option.id === "css" || hasEngine(option.id)
          const selected = engine === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              aria-label={`${option.label} engine`}
              disabled={!available}
              onClick={() => choose(option.id)}
              className={cn(
                "group/tip relative inline-flex size-7 items-center justify-center rounded-full transition-[background-color,opacity] duration-150 disabled:opacity-40 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]",
                selected ? "bg-black/[0.08] dark:bg-white/[0.16]" : "opacity-70 hover:opacity-100 hover:bg-black/[0.05] dark:hover:bg-white/[0.08]"
              )}
            >
              {loading === option.id ? (
                <CircleNotch className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <BrandIcon name={option.brand} size={14} variant="auto" />
              )}
              <span
                role="presentation"
                className="pointer-events-none absolute left-0 top-full z-20 mt-2 whitespace-nowrap rounded-md bg-[var(--color-foreground)] px-2 py-1 text-xs text-[color:var(--color-background)] opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100 motion-reduce:transition-none"
              >
                {available ? `${option.label}: ${option.note}` : `${option.label}: not registered`}
              </span>
            </button>
          )
        })}
      </div>
      {failed ? (
        <span role="status" className="rounded-full bg-[var(--surface-1)] px-2.5 py-1 text-xs text-[color:var(--color-muted)] ring-1 ring-[var(--line-soft)]">
          {failed} failed to load, using css
        </span>
      ) : null}
    </section>
  )
}
