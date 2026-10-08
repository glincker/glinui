"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { useEngineRun } from "./motion-engine"

export interface NumberTickerProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children">,
    EngineControlProps {
  value: number
  from?: number
  /** Duration in seconds. */
  duration?: number
  /** Delay in seconds. */
  delay?: number
  decimals?: number
  formatOptions?: Intl.NumberFormatOptions
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Number that counts up when it enters the viewport. The count runs through the active
 * motion engine (`engine` prop, MotionEngineProvider, or `data-glin-engine`; css by default).
 * The accessible text is always the final value, the animated digits are aria-hidden.
 */
export const NumberTicker = React.forwardRef<HTMLSpanElement, NumberTickerProps>(
  (
    { className, value, from = 0, duration = 1.5, delay = 0, decimals = 0, formatOptions, engine, motion, ...props },
    ref
  ) => {
    const digitsRef = React.useRef<HTMLSpanElement | null>(null)

    const format = React.useCallback(
      (v: number) =>
        formatOptions ? new Intl.NumberFormat(undefined, formatOptions).format(v) : v.toFixed(decimals),
      [formatOptions, decimals]
    )
    const finalText = format(value)

    useEngineRun(
      { engine, motion, hideRef: digitsRef },
      (instance) => {
        const el = digitsRef.current
        if (!el) return
        return instance.countTo(el, from, value, {
          duration: duration * 1000,
          delay: delay * 1000,
          threshold: 0.1,
          easing: "out",
          format
        })
      },
      [value, from, duration, delay, format]
    )

    return (
      <span ref={ref} className={cn("inline-grid tabular-nums", className)} data-glin-ticker="" {...props}>
        <span className="col-start-1 row-start-1 opacity-0">{finalText}</span>
        <span
          ref={digitsRef}
          aria-hidden="true"
          className="col-start-1 row-start-1"
          dangerouslySetInnerHTML={{ __html: escapeHtml(finalText) }}
        />
      </span>
    )
  }
)

NumberTicker.displayName = "NumberTicker"
