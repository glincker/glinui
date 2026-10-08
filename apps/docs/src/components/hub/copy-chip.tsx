"use client"

import { Check } from "@phosphor-icons/react"

import { useCopy } from "@/components/docs/preview-frame"

/** Small monospace button that copies its `value` and flashes a check. */
export function CopyChip({ value, label, display }: { value: string; label: string; display?: string }) {
  const { copied, copy } = useCopy(value)
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}: ${value}`}
      className="group/chip relative inline-flex max-w-full items-center rounded-md px-1.5 py-0.5 text-left font-mono text-[11px] leading-4 text-neutral-600 transition-colors hover:bg-[var(--surface-3)] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] dark:text-neutral-300"
    >
      <span className="truncate">{copied ? "Copied" : (display ?? value)}</span>
      {copied ? <Check className="ml-1 size-3 shrink-0 text-[var(--color-accent)]" aria-hidden="true" /> : null}
    </button>
  )
}
