"use client"

import * as React from "react"

import { AnimationCard } from "@/components/hub/animation-card"
import { ANIMATION_CATEGORIES, hubAnimations, type AnimationCategory } from "@/lib/hub-animations"

type Filter = "All" | AnimationCategory

const chipBase =
  "inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium ring-1 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none"

export function AnimationHub() {
  const [filter, setFilter] = React.useState<Filter>("All")
  const visible = filter === "All" ? hubAnimations : hubAnimations.filter((item) => item.category === filter)
  const filters: Filter[] = ["All", ...ANIMATION_CATEGORIES]

  return (
    <section aria-labelledby="animation-grid-heading" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="animation-grid-heading" className="type-section">
          Animation components
        </h2>
        <p className="text-[13px] tabular-nums text-[var(--color-muted)]" aria-live="polite">
          Showing {visible.length} of {hubAnimations.length}
        </p>
      </div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {filters.map((name) => {
          const selected = filter === name
          return (
            <button
              key={name}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(name)}
              className={`${chipBase} ${
                selected
                  ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] ring-transparent"
                  : "bg-[var(--surface-1)] text-neutral-600 ring-[var(--line-soft)] hover:text-foreground dark:text-neutral-300"
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>
      <ul className="grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <AnimationCard key={item.id} item={item} />
        ))}
      </ul>
    </section>
  )
}
