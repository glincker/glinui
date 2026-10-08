"use client"

import * as React from "react"
import { Check, Copy, Play } from "@phosphor-icons/react"

import { useCopy } from "@/components/docs/preview-frame"
import { motionTokens, type MotionToken } from "@/lib/hub-animations"

function parseBezier(value: string): [number, number, number, number] | null {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value)
  if (!match?.[1]) return null
  const nums = match[1].split(",").map((n) => Number.parseFloat(n))
  if (nums.length !== 4 || nums.some((n) => Number.isNaN(n))) return null
  return [nums[0] ?? 0, nums[1] ?? 0, nums[2] ?? 1, nums[3] ?? 1]
}

function CurveGraph({ value }: { value: string }) {
  const points = parseBezier(value)
  if (!points) return null
  const [x1, y1, x2, y2] = points
  const size = 64
  const pad = 8
  const span = size - pad * 2
  const px = (x: number) => pad + x * span
  const py = (y: number) => size - pad - y * span
  const d = `M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)}, ${px(x2)} ${py(y2)}, ${px(1)} ${py(1)}`
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="size-16 shrink-0 text-[var(--color-accent)]" aria-hidden="true">
      <rect x={pad} y={pad} width={span} height={span} rx="4" fill="none" stroke="currentColor" strokeOpacity="0.15" />
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function MotionRow({ token }: { token: MotionToken }) {
  const [on, setOn] = React.useState(false)
  const { copied, copy } = useCopy(`var(${token.name})`)
  const Icon = copied ? Check : Copy
  return (
    <li className="grid grid-cols-1 items-center gap-4 rounded-2xl bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-1)] ring-1 ring-[var(--line-soft)] md:grid-cols-[auto_1fr_1fr]">
      {token.kind === "curve" ? <CurveGraph value={token.value} /> : <div className="hidden size-16 md:block" aria-hidden="true" />}
      <div className="min-w-0 space-y-1">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy var(${token.name})`}
          className="inline-flex items-center gap-1.5 rounded-md font-mono text-[13px] font-medium text-foreground hover:text-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          {token.name}
          <Icon className="size-3.5" aria-hidden="true" />
        </button>
        <p className="font-mono text-[12px] text-neutral-600 dark:text-neutral-400">{token.value}</p>
        <p className="text-[13px] text-neutral-600 dark:text-neutral-400">{token.note}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          aria-label={`Play ${token.name} demo`}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-2)] text-neutral-600 ring-1 ring-[var(--line-soft)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <Play className="size-3.5" weight="fill" aria-hidden="true" />
        </button>
        <div className="relative h-8 w-44 max-w-full shrink-0 rounded-full bg-[var(--surface-well)] [box-shadow:var(--elev-inset)]">
          <span
            aria-hidden="true"
            className={`absolute left-1 top-1 size-6 rounded-full bg-[var(--color-accent)] transition-transform ${token.easeClass} ${token.durationClass} motion-reduce:transition-none ${
              on ? "translate-x-36" : "translate-x-0"
            }`}
          />
        </div>
      </div>
    </li>
  )
}

export function EasingSection() {
  return (
    <section aria-labelledby="easing-heading" className="space-y-6">
      <div className="space-y-2">
        <h2 id="easing-heading" className="type-section">
          Easing and timing
        </h2>
        <p className="type-body max-w-[60ch] text-[var(--color-muted)]">
          Every Glin UI animation reads from the same curve and duration tokens. Click a name to copy the variable, press play to feel the curve.
        </p>
      </div>
      <ul className="grid list-none gap-3 p-0">
        {motionTokens.map((token) => (
          <MotionRow key={token.name} token={token} />
        ))}
      </ul>
      <p className="rounded-xl bg-[var(--surface-2)] p-4 text-[13px] leading-6 text-neutral-600 ring-1 ring-[var(--line-soft)] dark:text-neutral-300">
        Reduced motion: when the visitor sets prefers-reduced-motion, every demo above and in the grid pauses or drops its transition. Animate only transform and opacity, and keep a still frame that carries the same meaning.
      </p>
    </section>
  )
}
