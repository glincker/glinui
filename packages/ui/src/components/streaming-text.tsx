"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface StreamingTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  text: string
  /** Milliseconds per character. */
  speed?: number
  /** Skip the animation and render everything at once. */
  instant?: boolean
  /** Show a blinking caret while revealing. */
  caret?: boolean
  /** Called once each time the full text has been revealed. */
  onDone?: () => void
}

export const StreamingText = React.forwardRef<HTMLSpanElement, StreamingTextProps>(
  ({ text, speed = 24, instant = false, caret = true, onDone, className, ...props }, ref) => {
    const reduced = usePrefersReducedMotion()
    const skip = instant || reduced
    const chars = React.useMemo(() => Array.from(text), [text])
    const [count, setCount] = React.useState(skip ? chars.length : 0)
    const prevText = React.useRef(text)
    const onDoneRef = React.useRef(onDone)
    onDoneRef.current = onDone
    const doneFor = React.useRef<string | null>(null)

    // Restart only when the new text is not an extension of the old one.
    React.useEffect(() => {
      if (!text.startsWith(prevText.current)) {
        setCount(0)
        doneFor.current = null
      }
      prevText.current = text
    }, [text])

    React.useEffect(() => {
      if (skip) {
        setCount(chars.length)
        return
      }
      if (count >= chars.length) return
      const id = setInterval(() => setCount((c) => Math.min(c + 1, chars.length)), Math.max(0, speed))
      return () => clearInterval(id)
      // Re-arm only when finishing flips, not on every tick.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [skip, chars.length, speed, count >= chars.length])

    const finished = count >= chars.length
    React.useEffect(() => {
      if (finished && doneFor.current !== text) {
        doneFor.current = text
        onDoneRef.current?.()
      }
    }, [finished, text])

    const visible = chars.slice(0, count).join("")

    return (
      <span ref={ref} data-streaming={!finished || undefined} className={cn("whitespace-pre-wrap", className)} {...props}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {visible}
          {caret && !finished ? (
            <span className="ms-0.5 inline-block h-[1em] w-0.5 translate-y-[0.15em] bg-[var(--color-accent)] animate-blink motion-reduce:animate-none" />
          ) : null}
        </span>
      </span>
    )
  }
)
StreamingText.displayName = "StreamingText"
