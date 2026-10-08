"use client"

import * as React from "react"

/**
 * True while the element is intersecting the viewport AND the tab is visible.
 * Used by decorative animated layers to pause WAAPI animations and rAF loops
 * when nobody can see them. Defaults to true so the first paint is not delayed.
 */
export function usePlaybackActive(ref: React.RefObject<Element | null>): boolean {
  const [inView, setInView] = React.useState(true)
  const [tabVisible, setTabVisible] = React.useState(true)

  React.useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[entries.length - 1]
        if (last) setInView(last.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  React.useEffect(() => {
    if (typeof document === "undefined") return
    const onChange = () => setTabVisible(document.visibilityState !== "hidden")
    onChange()
    document.addEventListener("visibilitychange", onChange)
    return () => document.removeEventListener("visibilitychange", onChange)
  }, [])

  return inView && tabVisible
}
