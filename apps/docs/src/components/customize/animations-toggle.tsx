"use client"

import * as React from "react"
import { Lightning, LightningSlash } from "@phosphor-icons/react"

import { cn, useGlinConfig } from "@glinui/ui"

/**
 * Quick animations switch for the docs topbar. Flips motion between "full" and "none"
 * through the same provider (and storage) the Customize panel uses. "system" counts as on.
 */
export function AnimationsToggle({ className }: { className?: string }) {
  const { config, setConfig } = useGlinConfig()
  const on = config.motion !== "none"
  const label = on ? "Animations on" : "Animations off"
  const Icon = on ? Lightning : LightningSlash

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={on}
      title={`${label}. Click to turn ${on ? "off" : "on"}.`}
      onClick={() => setConfig({ motion: on ? "none" : "full" })}
      className={cn(className, on ? "" : "bg-[var(--surface-2)] text-foreground")}
    >
      <Icon className="size-4" aria-hidden weight={on ? "fill" : "regular"} />
    </button>
  )
}
