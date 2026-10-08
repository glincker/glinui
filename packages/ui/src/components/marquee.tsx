"use client"

import * as React from "react"
import { cn } from "../lib/cn"

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "left" | "right" | "up" | "down"
  /** Seconds for one full loop. */
  speed?: number
  pauseOnHover?: boolean
  /** Space between items and between loop copies, in px. */
  gap?: number
  reverse?: boolean
  /** Fixed number of content copies. By default the marquee measures itself and renders just enough copies to fill the container. */
  repeat?: number
}

const SSR_COPIES = 4
const MAX_COPIES = 24

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      children,
      direction = "left",
      speed = 30,
      pauseOnHover = false,
      gap = 16,
      reverse = false,
      repeat,
      style,
      ...props
    },
    ref
  ) => {
    const isVertical = direction === "up" || direction === "down"
    const shouldReverse = reverse || direction === "right" || direction === "down"
    const animationClass = isVertical
      ? "motion-safe:animate-marquee-y"
      : "motion-safe:animate-marquee-x"

    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const trackRef = React.useRef<HTMLDivElement | null>(null)
    const [copies, setCopies] = React.useState(repeat ?? SSR_COPIES)
    const copiesRef = React.useRef(copies)
    copiesRef.current = copies

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    React.useEffect(() => {
      if (repeat !== undefined) {
        setCopies(Math.max(2, repeat))
        return
      }
      const root = rootRef.current
      const track = trackRef.current
      if (!root || !track || typeof ResizeObserver === "undefined") return

      const measure = () => {
        const container = isVertical ? root.clientHeight : root.clientWidth
        const content = isVertical ? track.offsetHeight : track.offsetWidth
        if (!container || !content) return
        // A container sized by its own content (for example a vertical marquee with no explicit height)
        // would grow with every copy we add: leave it alone instead of feeding back.
        const used = copiesRef.current * content + (copiesRef.current - 1) * gap
        if (Math.abs(container - used) <= 2) return
        // Enough copies to cover the container plus one extra so the loop never shows a blank edge.
        const needed = Math.min(MAX_COPIES, Math.max(2, Math.ceil(container / (content + gap)) + 1))
        setCopies((current) => (current === needed ? current : needed))
      }

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(root)
      observer.observe(track)
      return () => observer.disconnect()
    }, [repeat, isVertical, gap, children])

    return (
      <div
        ref={setRefs}
        className={cn(
          "group overflow-hidden gap-[var(--marquee-gap)]",
          isVertical ? "flex flex-col" : "flex flex-row",
          className
        )}
        style={
          {
            "--marquee-gap": `${gap}px`,
            "--marquee-duration": `${speed}s`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        {Array.from({ length: copies }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? trackRef : undefined}
            aria-hidden={i > 0 ? true : undefined}
            className={cn(
              "flex shrink-0 gap-[var(--marquee-gap)]",
              isVertical ? "flex-col" : "flex-row",
              animationClass,
              shouldReverse && "[animation-direction:reverse]",
              pauseOnHover && "group-hover:[animation-play-state:paused]"
            )}
          >
            {children}
          </div>
        ))}
      </div>
    )
  }
)

Marquee.displayName = "Marquee"
