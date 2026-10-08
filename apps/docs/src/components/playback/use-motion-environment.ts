"use client"

import * as React from "react"

export interface MotionEnvironment {
  /** `prefers-reduced-motion: reduce` is set. */
  reduced: boolean
  /** Glin motion level is `none` (topbar animations toggle, Customize panel). */
  motionOff: boolean
  /** Site-wide engine from the Customize panel (`data-glin-engine`). */
  engine: string
}

const MOTION_ATTR = "data-glin-motion"
const ENGINE_ATTR = "data-glin-engine"
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

function readMotionOff(): boolean {
  if (typeof document === "undefined") return false
  return document.documentElement.getAttribute(MOTION_ATTR) === "none"
}

function readReduced(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia(REDUCED_QUERY).matches
}

/** Tracks reduced motion and the Glin motion level, reacting to live changes. */
export function useMotionEnvironment(): MotionEnvironment {
  const [env, setEnv] = React.useState<MotionEnvironment>({ reduced: false, motionOff: false, engine: "css" })

  React.useEffect(() => {
    const update = () => {
      const next = {
        reduced: readReduced(),
        motionOff: readMotionOff(),
        engine: document.documentElement.getAttribute(ENGINE_ATTR) || "css"
      }
      setEnv((prev) => (prev.reduced === next.reduced && prev.motionOff === next.motionOff && prev.engine === next.engine ? prev : next))
    }
    update()
    const media = window.matchMedia(REDUCED_QUERY)
    media.addEventListener("change", update)
    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: [MOTION_ATTR, ENGINE_ATTR] })
    return () => {
      media.removeEventListener("change", update)
      observer.disconnect()
    }
  }, [])

  return env
}
