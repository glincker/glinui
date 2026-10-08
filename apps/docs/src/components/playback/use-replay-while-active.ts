"use client"

import * as React from "react"

import { useMotionEnvironment } from "./use-motion-environment"

/**
 * Returns a key that changes every time `active` turns on and then every `periodMs` while it
 * stays on. Use it as a React `key` on a preview subtree to replay one-shot animations from
 * the start on every hover and loop them while hovered. No timers run while inactive, while
 * the tab is hidden, or when motion is reduced or off (hover still restarts once).
 */
export function useReplayWhileActive(active: boolean, periodMs: number = 4000): number {
  const [key, setKey] = React.useState(0)
  const { reduced, motionOff } = useMotionEnvironment()
  const loops = !reduced && !motionOff

  React.useEffect(() => {
    if (!active) return
    setKey((value) => value + 1)
    if (!loops) return
    const id = window.setInterval(() => {
      if (!document.hidden) setKey((value) => value + 1)
    }, periodMs)
    return () => window.clearInterval(id)
  }, [active, periodMs, loops])

  return key
}
