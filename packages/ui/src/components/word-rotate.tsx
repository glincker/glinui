"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { useEngineRun } from "./motion-engine"

export interface WordRotateProps extends React.HTMLAttributes<HTMLSpanElement>, EngineControlProps {
  /** Array of words to cycle through */
  words: string[]
  /** Duration each word is shown (ms) */
  duration?: number
  /** Animation speed for enter/exit (ms) */
  animationDuration?: number
}

/**
 * Cycles through words. The outgoing word leaves with a css keyframe, the incoming word
 * enters through the active motion engine (`engine` prop, provider, or `data-glin-engine`).
 * Motion `none` swaps words with no animation, `subtle` cross-fades only.
 */
export const WordRotate = React.forwardRef<HTMLSpanElement, WordRotateProps>(
  ({ className, words, duration = 2500, animationDuration = 300, style, engine, motion, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [leaving, setLeaving] = React.useState(false)
    const wordRef = React.useRef<HTMLSpanElement | null>(null)
    const cycled = React.useRef(false)

    const { effectiveLevel, reducedMotion } = useEngineRun(
      { engine, motion },
      (instance) => {
        const el = wordRef.current
        if (!el || !cycled.current) return
        return instance.reveal(el, {
          direction: "up",
          distance: 12,
          duration: animationDuration,
          easing: "out",
          immediate: true
        })
      },
      [currentIndex, animationDuration]
    )
    const showExit = effectiveLevel === "full"
    const rotating = effectiveLevel !== "none" && !reducedMotion

    React.useEffect(() => {
      if (words.length <= 1 || !rotating) return
      let swap: ReturnType<typeof setTimeout> | undefined
      const timer = setInterval(() => {
        cycled.current = true
        const exitMs = showExit ? animationDuration : 0
        if (exitMs > 0) setLeaving(true)
        swap = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % words.length)
          setLeaving(false)
        }, exitMs)
      }, duration)
      return () => {
        clearInterval(timer)
        if (swap) clearTimeout(swap)
      }
    }, [words, duration, animationDuration, showExit, rotating])

    return (
      <span
        ref={ref}
        className={cn("inline-block overflow-hidden", className)}
        style={{
          "--word-rotate-duration": `${animationDuration}ms`,
          ...style,
        } as React.CSSProperties}
        {...props}
      >
        <span
          key={currentIndex}
          ref={wordRef}
          data-glin-word=""
          className={cn("inline-block", leaving && "animate-word-rotate-out", "motion-reduce:[animation:none]")}
          aria-live="polite"
        >
          {words[currentIndex]}
        </span>
      </span>
    )
  }
)

WordRotate.displayName = "WordRotate"
