"use client"

import * as React from "react"

/**
 * Drives a slow, looping synthetic pointer over an element, for demos, screenshots and touch devices
 * where there is no hover. The callback receives normalized coordinates (0 to 1) and runs in a rAF loop
 * throttled to about 30fps. It stops while the element is off screen, the tab is hidden, or `enabled` is false.
 * Callers gate `enabled` on the motion level, so reduced motion never starts it.
 */
export function useAutoPointer(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
  onPoint: (nx: number, ny: number) => void,
  periodMs = 7000
): void {
  const cb = React.useRef(onPoint)
  cb.current = onPoint

  React.useEffect(() => {
    const el = ref.current
    if (!enabled || !el || typeof requestAnimationFrame !== "function") return
    let frame = 0
    let last = 0
    let visible = true
    const start = performance.now()

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (!visible || document.hidden || now - last < 33) return
      last = now
      const t = ((now - start) / periodMs) * Math.PI * 2
      cb.current(0.5 + 0.36 * Math.sin(t), 0.5 + 0.3 * Math.sin(t * 2 + 0.6))
    }

    let observer: IntersectionObserver | undefined
    if (typeof IntersectionObserver === "function") {
      observer = new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
      })
      observer.observe(el)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      observer?.disconnect()
    }
  }, [enabled, periodMs, ref])
}
