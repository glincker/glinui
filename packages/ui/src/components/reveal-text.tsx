"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { driveProgress, mergeRefs, useEngineRun } from "./motion-engine"

export interface RevealTextProps extends React.HTMLAttributes<HTMLSpanElement>, EngineControlProps {
  /** Text to reveal */
  text: string
  /** Animation duration in seconds */
  duration?: number
  /** Delay before animation starts, in ms */
  delay?: number
  /** Reveal direction */
  direction?: "left" | "right" | "top" | "bottom"
  /** Trigger on intersection */
  triggerOnView?: boolean
  /** Intersection threshold */
  threshold?: number
}

type Direction = NonNullable<RevealTextProps["direction"]>

/** Clip-path inset for a reveal progress from 0 (hidden) to 1 (fully shown). */
function clipFor(direction: Direction, progress: number): string {
  const hidden = `${((1 - Math.min(Math.max(progress, 0), 1)) * 100).toFixed(2)}%`
  switch (direction) {
    case "left":
      return `inset(0 ${hidden} 0 0)`
    case "right":
      return `inset(0 0 0 ${hidden})`
    case "top":
      return `inset(0 0 ${hidden} 0)`
    default:
      return `inset(${hidden} 0 0 0)`
  }
}

/**
 * Clip-path wipe. The wipe progress runs through the active motion engine (css, motion, gsap),
 * which owns timing, easing and the in-view trigger. `none` shows the text, `subtle` fades it in.
 */
export const RevealText = React.forwardRef<HTMLSpanElement, RevealTextProps>(
  (
    { className, text, duration = 0.8, delay = 0, direction = "left", triggerOnView = true, threshold = 0.5, engine, motion, ...props },
    ref
  ) => {
    const rootRef = React.useRef<HTMLSpanElement | null>(null)
    const driverRef = React.useRef<HTMLSpanElement | null>(null)

    const levelRef = React.useRef<"full" | "subtle" | "none">("full")

    const state = useEngineRun(
      { engine, motion, hideRef: rootRef },
      (instance) => {
        const root = rootRef.current
        const driver = driverRef.current
        if (!root || !driver) return
        const clear = () => root.style.removeProperty("clip-path")
        // Level none and subtle reach here with a wrapped engine: fade only, no wipe.
        if (levelRef.current !== "full") {
          const stop = instance.reveal(root, { distance: 0, immediate: !triggerOnView, delay, threshold })
          return () => {
            stop()
            clear()
          }
        }
        const stop = driveProgress(
          instance,
          driver,
          (p) => {
            if (p >= 1) clear()
            else root.style.setProperty("clip-path", clipFor(direction, p))
          },
          {
            duration: duration * 1000,
            delay,
            easing: "out",
            threshold,
            immediate: !triggerOnView,
            once: true
          }
        )
        return () => {
          stop()
          clear()
        }
      },
      [direction, duration, delay, triggerOnView, threshold]
    )
    levelRef.current = state.effectiveLevel

    return (
      <span
        ref={mergeRefs<HTMLSpanElement>(rootRef, ref)}
        data-glin-reveal-text=""
        className={cn("relative inline-block", className)}
        {...props}
      >
        {text}
        <span ref={driverRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      </span>
    )
  }
)

RevealText.displayName = "RevealText"
