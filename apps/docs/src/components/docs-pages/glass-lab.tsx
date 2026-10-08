"use client"

import * as React from "react"
import { Check, Copy } from "@phosphor-icons/react"

import { useCopy } from "@/components/docs/preview-frame"

type SliderSpec = {
  id: "blur" | "opacity" | "saturate"
  label: string
  min: number
  max: number
  step: number
  unit: string
}

const sliders: SliderSpec[] = [
  { id: "blur", label: "Blur", min: 0, max: 60, step: 1, unit: "px" },
  { id: "opacity", label: "Opacity", min: 0, max: 60, step: 1, unit: "%" },
  { id: "saturate", label: "Saturate", min: 100, max: 250, step: 5, unit: "%" }
]

type LabState = Record<SliderSpec["id"], number>

const initial: LabState = { blur: 16, opacity: 18, saturate: 180 }

function buildCss(state: LabState): string {
  const alpha = (state.opacity / 100).toFixed(2)
  return `.glass-surface {
  background: rgb(255 255 255 / ${alpha});
  backdrop-filter: saturate(${state.saturate}%) blur(${state.blur}px);
  -webkit-backdrop-filter: saturate(${state.saturate}%) blur(${state.blur}px);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-top-color: rgb(255 255 255 / 0.4); /* refraction edge */
}`
}

/** Interactive glass lab: tune blur, opacity and saturate over a vivid backdrop, then copy the CSS. */
export function GlassLab() {
  const [state, setState] = React.useState<LabState>(initial)
  const panelRef = React.useRef<HTMLDivElement>(null)
  const css = buildCss(state)
  const { copied, copy } = useCopy(css)
  const CopyIcon = copied ? Check : Copy

  React.useEffect(() => {
    const el = panelRef.current
    if (!el) return
    el.style.setProperty("--lab-blur", `${state.blur}px`)
    el.style.setProperty("--lab-alpha", String(state.opacity / 100))
    el.style.setProperty("--lab-sat", `${state.saturate}%`)
  }, [state])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="relative isolate flex min-h-72 items-center justify-center overflow-hidden rounded-card bg-gradient-to-br from-violet-600 via-fuchsia-500 to-amber-300 p-6">
        <div aria-hidden="true" className="absolute -left-6 top-6 size-32 rounded-full bg-cyan-300" />
        <div aria-hidden="true" className="absolute bottom-4 right-10 size-24 rounded-full bg-emerald-300" />
        <div aria-hidden="true" className="absolute right-1/3 top-3 h-8 w-40 rotate-12 rounded-full bg-rose-500" />
        <div aria-hidden="true" className="absolute bottom-10 left-1/4 text-5xl font-semibold tracking-tight text-white">
          Refraction
        </div>
        <div
          ref={panelRef}
          className="relative w-full max-w-xs rounded-card border border-white/20 [border-top-color:rgb(255_255_255_/_0.4)] bg-[rgb(255_255_255_/_var(--lab-alpha,0.18))] p-5 text-white [box-shadow:var(--shadow-glass-md)] [-webkit-backdrop-filter:saturate(var(--lab-sat,180%))_blur(var(--lab-blur,16px))] [backdrop-filter:saturate(var(--lab-sat,180%))_blur(var(--lab-blur,16px))]"
        >
          <p className="text-sm font-medium">Glass panel</p>
          <p className="mt-1 text-xs text-white/90">
            blur {state.blur}px, opacity {state.opacity}%, saturate {state.saturate}%
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {sliders.map((spec) => (
          <div key={spec.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor={`lab-${spec.id}`} className="font-medium">
                {spec.label}
              </label>
              <output htmlFor={`lab-${spec.id}`} className="font-mono text-xs text-muted">
                {state[spec.id]}
                {spec.unit}
              </output>
            </div>
            <input
              id={`lab-${spec.id}`}
              type="range"
              min={spec.min}
              max={spec.max}
              step={spec.step}
              value={state[spec.id]}
              onChange={(event) => setState((prev) => ({ ...prev, [spec.id]: Number(event.target.value) }))}
              className="h-2 w-full cursor-pointer accent-[var(--color-accent)]"
            />
          </div>
        ))}
        <div className="overflow-hidden rounded-input border border-line-soft bg-surface-well">
          <div className="flex items-center justify-between border-b border-line-soft bg-surface-1 py-1 pl-3 pr-1">
            <span className="font-mono text-[11px] text-muted">CSS</span>
            <button
              type="button"
              onClick={copy}
              aria-label="Copy glass CSS"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <CopyIcon className="size-4" aria-hidden="true" />
            </button>
          </div>
          <pre className="overflow-x-auto p-3 font-mono text-[11px] leading-relaxed">
            <code>{css}</code>
          </pre>
        </div>
        <button
          type="button"
          onClick={() => setState(initial)}
          className="text-xs text-muted underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          Reset to glass-3
        </button>
      </div>
    </div>
  )
}
