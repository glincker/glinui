"use client"
/**
 * Glin UI Morphing Text (morphing-text). Adapted from MorphingText in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/morphing-text.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714. Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: per instance filter id, off-screen pause, motion levels, a11y list, container sizing.
 * See THIRD_PARTY_NOTICES.md#morphing-text.
 */
import * as React from "react"
import { flushSync } from "react-dom"
import { cn } from "../lib/cn"
import { useMotionEngine } from "./motion-engine"

export interface MorphingTextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Words or phrases to cycle through. */
  texts: string[]
  /** Seconds a morph takes. */
  morphTime?: number
  /** Seconds each text rests before the next morph. */
  cooldownTime?: number
}

const MAX_DT = 0.1

export const MorphingText = React.forwardRef<HTMLDivElement, MorphingTextProps>(
  ({ texts, morphTime = 1.5, cooldownTime = 0.5, className, ...props }, forwardedRef) => {
    const { effectiveLevel } = useMotionEngine()
    const rawId = React.useId()
    const filterId = `glin-morph-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`
    const [index, setIndex] = React.useState(0)
    const indexRef = React.useRef(0)
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const slotARef = React.useRef<HTMLSpanElement>(null)
    const slotBRef = React.useRef<HTMLSpanElement>(null)
    const count = texts.length
    const level = count < 2 ? "none" : effectiveLevel

    const current = texts[index % Math.max(count, 1)] ?? ""
    const next = texts[(index + 1) % Math.max(count, 1)] ?? ""

    React.useEffect(() => {
      const root = rootRef.current
      const a = slotARef.current
      const b = slotBRef.current
      if (!root || !a || !b) return
      const reset = () => {
        a.style.filter = "none"
        a.style.opacity = "1"
        b.style.filter = "none"
        b.style.opacity = "0"
        root.style.filter = ""
      }
      reset()
      if (level === "none") return

      const useBlur = level === "full"
      if (useBlur) root.style.filter = `url(#${filterId}) blur(0.6px)`

      let visible = true
      let raf = 0
      let last = performance.now()
      let morph = 0
      let cooldown = cooldownTime
      const observer =
        typeof IntersectionObserver !== "undefined"
          ? new IntersectionObserver(([entry]) => {
              visible = entry?.isIntersecting ?? true
              last = performance.now()
            })
          : null
      observer?.observe(root)

      const apply = (fraction: number) => {
        const inv = 1 - fraction
        if (useBlur) {
          b.style.filter = `blur(${Math.min(8 / Math.max(fraction, 0.001) - 8, 100)}px)`
          a.style.filter = `blur(${Math.min(8 / Math.max(inv, 0.001) - 8, 100)}px)`
          b.style.opacity = String(Math.pow(fraction, 0.4))
          a.style.opacity = String(Math.pow(inv, 0.4))
        } else {
          a.style.opacity = String(inv)
          b.style.opacity = String(fraction)
        }
      }

      const tick = (now: number) => {
        raf = requestAnimationFrame(tick)
        const dt = Math.min((now - last) / 1000, MAX_DT)
        last = now
        if (!visible) return
        if (cooldown > 0) {
          cooldown -= dt
          return
        }
        morph += dt
        const fraction = Math.min(morph / Math.max(morphTime, 0.01), 1)
        apply(fraction)
        if (fraction >= 1) {
          morph = 0
          cooldown = cooldownTime
          indexRef.current += 1
          flushSync(() => setIndex(indexRef.current))
          reset()
          if (useBlur) root.style.filter = `url(#${filterId}) blur(0.6px)`
        }
      }
      raf = requestAnimationFrame(tick)
      return () => {
        cancelAnimationFrame(raf)
        observer?.disconnect()
        reset()
      }
    }, [level, morphTime, cooldownTime, filterId, count])

    const setRef = (node: HTMLDivElement | null) => {
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node
    }

    return (
      <div
        ref={setRef}
        className={cn("w-full [container-type:inline-size]", className)}
        {...props}
      >
        <span className="sr-only">{texts.join(". ")}</span>
        <div
          ref={rootRef}
          aria-hidden="true"
          className="relative mx-auto h-[1.2em] w-full max-w-3xl text-center font-sans text-[length:clamp(2rem,12cqi,6rem)] font-bold leading-none text-[var(--color-foreground)]"
        >
          <span ref={slotARef} className="absolute inset-x-0 top-0 m-auto inline-block w-full whitespace-nowrap">
            {current}
          </span>
          <span ref={slotBRef} className="absolute inset-x-0 top-0 m-auto inline-block w-full whitespace-nowrap opacity-0">
            {next}
          </span>
        </div>
        <svg aria-hidden="true" focusable="false" className="pointer-events-none fixed size-0">
          <defs>
            <filter id={filterId}>
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </div>
    )
  }
)
MorphingText.displayName = "MorphingText"
