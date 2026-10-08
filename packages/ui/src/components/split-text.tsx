"use client"

import * as React from "react"
import type { SpringInput, StaggerDirection } from "@glinui/motion"

import { mergeRefs, useEngineRun } from "./motion-engine"
import { variantToRevealOptions, type EngineControlProps, type RevealVariant } from "./reveal"

export type SplitTextTag = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4"

export type SplitTextProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> &
  EngineControlProps & {
    /** The text to split. Plain string only. */
    text: string
    as?: SplitTextTag
    /** Reveal granularity. Default `words`. */
    by?: "words" | "chars"
    variant?: RevealVariant
    /** Delay between parts in ms. Default 40 for words and 18 for chars. */
    step?: number
    order?: StaggerDirection
    duration?: number
    delay?: number
    spring?: SpringInput
    once?: boolean
    threshold?: number
    immediate?: boolean
  }

function renderParts(text: string, by: "words" | "chars"): React.ReactNode[] {
  const words = text.split(/\s+/).filter(Boolean)
  return words.map((word, wi) => {
    const content =
      by === "words"
        ? word
        : Array.from(word).map((ch, ci) => (
            <span key={ci} data-glin-part="chars" className="inline-block">
              {ch}
            </span>
          ))
    return (
      <React.Fragment key={wi}>
        {wi > 0 ? " " : null}
        <span
          data-glin-part={by === "words" ? "words" : undefined}
          className={by === "words" ? "inline-block" : "inline-block whitespace-nowrap"}
        >
          {content}
        </span>
      </React.Fragment>
    )
  })
}

/**
 * Word or character reveal. The full text stays available to assistive tech through
 * aria-label and a visually hidden copy, while the animated pieces are aria-hidden.
 */
export const SplitText = React.forwardRef<HTMLElement, SplitTextProps>(function SplitText(
  {
    text,
    as = "p",
    by = "words",
    variant = "blur-slide",
    step,
    order = "forward",
    duration,
    delay,
    spring,
    once = true,
    threshold,
    immediate = false,
    engine,
    motion,
    ...props
  },
  forwardedRef
) {
  const innerRef = React.useRef<HTMLElement | null>(null)
  const partsRef = React.useRef<HTMLSpanElement | null>(null)
  const parts = React.useMemo(() => renderParts(text, by), [text, by])

  useEngineRun(
    { engine, motion, hideRef: partsRef },
    (instance) => {
      const el = partsRef.current
      if (!el || !instance.splitText) return
      return instance.splitText(el, {
        ...variantToRevealOptions(variant, {}),
        by,
        step: step ?? (by === "chars" ? 18 : 40),
        order,
        duration,
        delay,
        spring,
        once,
        threshold,
        immediate
      })
    },
    [text, by, variant, step, order, duration, delay, spring, once, threshold, immediate]
  )

  return React.createElement(
    as,
    { ...props, ref: mergeRefs<HTMLElement>(innerRef, forwardedRef), "aria-label": text, "data-glin-split": by },
    <span className="sr-only">{text}</span>,
    <span ref={partsRef} aria-hidden="true">
      {parts}
    </span>
  )
})

SplitText.displayName = "SplitText"
