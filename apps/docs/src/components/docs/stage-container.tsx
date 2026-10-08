"use client"

import * as React from "react"

/** Attribute marking preview header controls that must stay usable while a contained overlay is open. */
export const STAGE_CONTROLS_ATTR = "data-stage-controls"

const StageContainerContext = React.createContext<HTMLElement | null>(null)

/** Exposes the preview stage element so overlay demos can portal into it. */
export function StageContainerProvider({
  container,
  children
}: {
  container: HTMLElement | null
  children: React.ReactNode
}) {
  return <StageContainerContext.Provider value={container}>{children}</StageContainerContext.Provider>
}

/** Returns the nearest preview stage element, or null outside a stage (or before mount). */
export function useStageContainer(): HTMLElement | null {
  return React.useContext(StageContainerContext)
}

/**
 * Pointer or focus interactions on the stage header controls (backdrop switcher, tabs)
 * must not dismiss a contained modal overlay.
 */
export function ignoreStageControls(event: Event): void {
  const target = event.target
  if (target instanceof Element && target.closest(`[${STAGE_CONTROLS_ATTR}]`)) {
    event.preventDefault()
  }
}
