"use client"

import * as React from "react"
import { ArrowDown } from "@phosphor-icons/react"

import { cn } from "../lib/cn"
import { usePrefersReducedMotion } from "../lib/use-prefers-reduced-motion"

export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Distance in px from the bottom that still counts as "at the bottom". */
  threshold?: number
  /** Label of the jump pill. */
  jumpLabel?: string
  /** Fires when the stuck-to-bottom state flips. */
  onAtBottomChange?: (atBottom: boolean) => void
  /** Accessible name of the log region. */
  label?: string
}

function distanceFromBottom(el: HTMLElement) {
  return el.scrollHeight - el.scrollTop - el.clientHeight
}

export const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  (
    {
      className,
      children,
      threshold = 80,
      jumpLabel = "Jump to latest",
      onAtBottomChange,
      label = "Conversation",
      onScroll,
      ...props
    },
    forwardedRef
  ) => {
    const scrollRef = React.useRef<HTMLDivElement | null>(null)
    const contentRef = React.useRef<HTMLDivElement | null>(null)
    const stickRef = React.useRef(true)
    const [atBottom, setAtBottom] = React.useState(true)
    const reduced = usePrefersReducedMotion()
    const onChangeRef = React.useRef(onAtBottomChange)
    onChangeRef.current = onAtBottomChange

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        scrollRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    const updateStick = React.useCallback((next: boolean) => {
      if (stickRef.current === next) return
      stickRef.current = next
      setAtBottom(next)
      onChangeRef.current?.(next)
    }, [])

    const scrollToBottom = React.useCallback(
      (smooth: boolean) => {
        const el = scrollRef.current
        if (!el) return
        const top = el.scrollHeight
        if (typeof el.scrollTo === "function") {
          el.scrollTo({ top, behavior: smooth && !reduced ? "smooth" : "auto" })
        } else {
          el.scrollTop = top
        }
      },
      [reduced]
    )

    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      onScroll?.(event)
      updateStick(distanceFromBottom(event.currentTarget) <= threshold)
    }

    // Follow new children while the reader is pinned to the bottom.
    React.useEffect(() => {
      if (stickRef.current) scrollToBottom(false)
    }, [children, scrollToBottom])

    // Follow content growth that does not re-render this component (streaming).
    React.useEffect(() => {
      const content = contentRef.current
      if (!content || typeof ResizeObserver === "undefined") return
      const observer = new ResizeObserver(() => {
        if (stickRef.current) scrollToBottom(false)
      })
      observer.observe(content)
      return () => observer.disconnect()
    }, [scrollToBottom])

    const jump = () => {
      stickRef.current = false
      updateStick(true)
      scrollToBottom(true)
      scrollRef.current?.focus({ preventScroll: true })
    }

    return (
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={setRefs}
          role="log"
          aria-live="polite"
          aria-relevant="additions"
          aria-label={label}
          tabIndex={0}
          onScroll={handleScroll}
          className={cn(
            "min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl px-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
            className
          )}
          {...props}
        >
          <div ref={contentRef} className="flex flex-col">
            {children}
          </div>
        </div>
        <button
          type="button"
          onClick={jump}
          disabled={atBottom}
          tabIndex={atBottom ? -1 : 0}
          aria-hidden={atBottom || undefined}
          className={cn(
            "absolute bottom-3 start-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-[var(--line-soft)] bg-[var(--surface-1)] px-3 py-1.5 text-xs font-medium text-[var(--color-foreground)] [box-shadow:var(--elev-1)] transition-[opacity,transform] duration-normal hover:bg-[var(--surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none rtl:translate-x-1/2",
            atBottom ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          )}
        >
          <ArrowDown weight="bold" className="size-3.5" aria-hidden="true" />
          {jumpLabel}
        </button>
      </div>
    )
  }
)
MessageScroller.displayName = "MessageScroller"
