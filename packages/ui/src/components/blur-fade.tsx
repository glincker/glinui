"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { mergeRefs, useEngineRun } from "./motion-engine"

export interface BlurFadeProps extends React.HTMLAttributes<HTMLDivElement>, EngineControlProps {
  /** Delay before transition starts (ms) */
  delay?: number
  /** Transition duration (ms) */
  duration?: number
  /** Initial blur amount (px) */
  blur?: number
  /** Initial Y offset (px) */
  yOffset?: number
  /** Only animate once */
  once?: boolean
  /** IntersectionObserver threshold (0-1) */
  threshold?: number
}

/**
 * Fades content in from a blur and a small upward offset when it enters the viewport.
 * Runs through the active motion engine (`engine` prop, provider, or `data-glin-engine`).
 */
export const BlurFade = React.forwardRef<HTMLDivElement, BlurFadeProps>(
  (
    { className, children, delay = 0, duration = 500, blur = 8, yOffset = 12, once = true, threshold = 0.1, engine, motion, ...props },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement | null>(null)

    useEngineRun(
      { engine, motion, hideRef: localRef },
      (instance) => {
        const el = localRef.current
        if (!el) return
        return instance.reveal(el, {
          direction: "up",
          distance: yOffset,
          blur,
          duration,
          delay,
          easing: "standard",
          once,
          threshold
        })
      },
      [delay, duration, blur, yOffset, once, threshold]
    )

    return (
      <div ref={mergeRefs<HTMLDivElement>(localRef, ref)} data-glin-blur-fade="" className={cn(className)} {...props}>
        {children}
      </div>
    )
  }
)

BlurFade.displayName = "BlurFade"
