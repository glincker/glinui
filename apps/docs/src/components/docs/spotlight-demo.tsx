"use client"

import { Spotlight } from "@glinui/ui"
import { useState } from "react"

export function SpotlightDemo() {
  const [active, setActive] = useState(false)
  return (
    <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-xl">
      <button
        type="button"
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-foreground)]"
        onClick={() => setActive(true)}
      >
        Show Spotlight
      </button>
      <Spotlight
        active={active}
        className="absolute z-10"
        x="50%"
        y="50%"
        size={120}
        onDismiss={() => setActive(false)}
      />
    </div>
  )
}
