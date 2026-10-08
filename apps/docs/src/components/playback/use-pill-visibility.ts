"use client"

import * as React from "react"

const HIDE_AFTER_MS = 2500

/**
 * Whether the floating pill is shown: on pointer or keyboard activity in the stage, for a short
 * while after the last interaction, always while paused or `pinned`, and always on touch devices.
 */
export function usePillVisibility(stageEl: HTMLElement | null, pinned: boolean): boolean {
  const [awake, setAwake] = React.useState(false)
  const [coarse, setCoarse] = React.useState(false)
  const timer = React.useRef<number | null>(null)

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const media = window.matchMedia("(hover: none)")
    const update = () => setCoarse(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  React.useEffect(() => {
    if (!stageEl) return
    const wake = () => {
      setAwake(true)
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setAwake(false), HIDE_AFTER_MS)
    }
    const sleep = (event: Event) => {
      if (event.type === "pointerleave") {
        if (timer.current !== null) window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setAwake(false), 600)
      }
    }
    stageEl.addEventListener("pointermove", wake)
    stageEl.addEventListener("pointerdown", wake)
    stageEl.addEventListener("focusin", wake)
    stageEl.addEventListener("keydown", wake)
    stageEl.addEventListener("pointerleave", sleep)
    return () => {
      stageEl.removeEventListener("pointermove", wake)
      stageEl.removeEventListener("pointerdown", wake)
      stageEl.removeEventListener("focusin", wake)
      stageEl.removeEventListener("keydown", wake)
      stageEl.removeEventListener("pointerleave", sleep)
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [stageEl])

  return awake || pinned || coarse
}
