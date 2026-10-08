"use client"

import * as React from "react"

import { cn } from "@glinui/ui"

export type SegmentedOption<T extends string> = {
  value: T
  label: string
  /** Visible content; falls back to label. */
  content?: React.ReactNode
  /** Not selectable. `hint` explains why (shown as a tooltip). */
  disabled?: boolean
  hint?: string
}

type SegmentedProps<T extends string> = {
  label: string
  value: T
  options: ReadonlyArray<SegmentedOption<T>>
  onChange: (value: T) => void
  columns?: number
}

const COLS: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6"
}

/** Accessible single-select group: labelled radiogroup with roving tabindex and arrow keys. */
export function Segmented<T extends string>({ label, value, options, onChange, columns }: SegmentedProps<T>) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([])
  const labelId = React.useId()

  const move = (from: number, delta: number) => {
    let next = (from + delta + options.length) % options.length
    const step = delta === 0 ? 1 : Math.sign(delta)
    for (let i = 0; i < options.length && options[next].disabled; i += 1) {
      next = (next + step + options.length) % options.length
    }
    if (options[next].disabled) return
    onChange(options[next].value)
    refs.current[next]?.focus()
  }

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault()
      move(index, 1)
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault()
      move(index, -1)
    } else if (event.key === "Home") {
      event.preventDefault()
      move(index, -index)
    } else if (event.key === "End") {
      event.preventDefault()
      move(index, options.length - 1 - index)
    }
  }

  return (
    <div className="space-y-1.5">
      <div id={labelId} className="text-xs font-medium text-[var(--color-foreground)]">
        {label}
      </div>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        className={cn("grid gap-0.5 rounded-lg bg-[var(--surface-2)] p-0.5", COLS[columns ?? options.length] ?? "grid-cols-4")}
      >
        {options.map((option, index) => {
          const selected = option.value === value
          return (
            <button
              key={option.value}
              ref={(node) => {
                refs.current[index] = node
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={option.label}
              title={option.disabled && option.hint ? option.hint : option.label}
              aria-disabled={option.disabled || undefined}
              tabIndex={selected ? 0 : -1}
              onClick={() => {
                if (!option.disabled) onChange(option.value)
              }}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "inline-flex min-h-8 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                option.disabled && "cursor-not-allowed opacity-45",
                selected
                  ? "bg-[var(--surface-0)] text-[var(--color-foreground)] shadow-sm ring-1 ring-[var(--line-soft)]"
                  : "text-neutral-600 hover:text-[var(--color-foreground)] dark:text-neutral-300"
              )}
            >
              {option.content ?? option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
