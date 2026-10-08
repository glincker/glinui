"use client"

import * as React from "react"
import { Check } from "@phosphor-icons/react"

import { Surface } from "./surface"

const SWATCHES = [
  { name: "background", variable: "--surface-0", cls: "bg-[var(--surface-0)]" },
  { name: "surface-1", variable: "--surface-1", cls: "bg-[var(--surface-1)]" },
  { name: "surface-2", variable: "--surface-2", cls: "bg-[var(--surface-2)]" },
  { name: "surface-3", variable: "--surface-3", cls: "bg-[var(--surface-3)]" },
  { name: "well", variable: "--surface-well", cls: "bg-[var(--surface-well)]" },
  { name: "accent", variable: "--color-accent", cls: "bg-[var(--color-accent)]" },
  { name: "live", variable: "--color-signal-live", cls: "bg-[var(--color-signal-live)]" },
  { name: "ok", variable: "--color-signal-ok", cls: "bg-[var(--color-signal-ok)]" }
]

function Swatch({ name, variable, cls }: (typeof SWATCHES)[number]) {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`var(${variable})`)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }, [variable])

  return (
    <li>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy var(${variable})`}
        className="group block w-full space-y-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-1)]"
      >
        <span className={`flex h-16 items-center justify-center rounded-lg [box-shadow:var(--elev-1)] ring-1 ring-inset ring-[var(--line-soft)] transition-transform duration-150 group-active:scale-95 motion-reduce:transition-none ${cls}`}>
          <Check
            weight="bold"
            aria-hidden="true"
            className={`size-5 text-[var(--color-foreground)] mix-blend-difference transition-opacity duration-150 ${copied ? "opacity-100" : "opacity-0"}`}
          />
        </span>
        <span className="block font-mono text-[11px] text-[var(--color-muted)]">
          {copied ? "Copied" : name}
        </span>
      </button>
    </li>
  )
}

export function TokenSwatches() {
  return (
    <Surface className="p-5 lg:col-span-12">
      <ul className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {SWATCHES.map((swatch) => (
          <Swatch key={swatch.name} {...swatch} />
        ))}
      </ul>
      <p className="mt-4 text-xs text-[var(--color-muted)]" aria-live="polite">
        Click a swatch to copy its CSS variable.
      </p>
    </Surface>
  )
}
