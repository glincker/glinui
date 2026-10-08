"use client"

import * as React from "react"
import type { SpringInput } from "@glinui/motion"

import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { useEngineRun } from "./motion-engine"

export type CountUpProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> &
  EngineControlProps & {
    /** Final value. */
    value: number
    /** Start value. Default 0. */
    from?: number
    /** Duration in ms. */
    duration?: number
    delay?: number
    spring?: SpringInput
    decimals?: number
    locale?: string
    prefix?: string
    suffix?: string
    once?: boolean
    threshold?: number
    immediate?: boolean
    /** Custom formatter. Receives the raw value. Overrides decimals and locale. */
    format?: (value: number) => string
  }

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function fractionDigits(value: number): number {
  return Number.isInteger(value) ? 0 : Math.min(4, String(value).split(".")[1]?.length ?? 0)
}

function formatValue(value: number, digits: number, locale: string | undefined): string {
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value)
}

/**
 * Number that counts up when it enters the viewport. The accessible text is always the
 * final value (an invisible span that also reserves the final width, so nothing shifts),
 * while the animated digits are aria-hidden and use tabular numerals.
 */
export const CountUp = React.forwardRef<HTMLSpanElement, CountUpProps>(function CountUp(
  {
    value,
    from = 0,
    duration,
    delay,
    spring,
    decimals,
    locale,
    prefix = "",
    suffix = "",
    once = true,
    threshold,
    immediate = false,
    format,
    engine,
    motion,
    className,
    ...props
  },
  forwardedRef
) {
  const digitsRef = React.useRef<HTMLSpanElement | null>(null)
  const formatRef = React.useRef(format)
  formatRef.current = format

  const digits = decimals ?? fractionDigits(value)
  const render = React.useCallback(
    (v: number) => {
      const body = formatRef.current ? formatRef.current(v) : formatValue(v, digits, locale)
      return `${prefix}${body}${suffix}`
    },
    [digits, locale, prefix, suffix]
  )
  const finalText = render(value)

  useEngineRun(
    { engine, motion, hideRef: digitsRef },
    (instance) => {
      const el = digitsRef.current
      if (!el) return
      return instance.countTo(el, from, value, {
        duration,
        delay,
        spring,
        once,
        threshold,
        immediate,
        format: render
      })
    },
    [value, from, duration, delay, spring, once, threshold, immediate, render]
  )

  return (
    <span ref={forwardedRef} className={cn("inline-grid tabular-nums", className)} data-glin-countup="" {...props}>
      <span className="col-start-1 row-start-1 opacity-0">{finalText}</span>
      <span
        ref={digitsRef}
        aria-hidden="true"
        className="col-start-1 row-start-1"
        dangerouslySetInnerHTML={{ __html: escapeHtml(finalText) }}
      />
    </span>
  )
})

CountUp.displayName = "CountUp"
