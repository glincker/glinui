"use client"
/**
 * Glin UI Hyper Text (hyper-text). Adapted from HyperText in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/hyper-text.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714. Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: no motion dependency, rAF scramble, a11y text, motion levels, trigger modes, SSR safe, scramble clock and in-view trigger driven by the motion engine (css by default).
 * See THIRD_PARTY_NOTICES.md#hyper-text.
 */
import * as React from "react"
import { cn } from "../lib/cn"
import type { MotionEngine } from "@glinui/motion"
import type { EngineControlProps } from "./reveal"
import { driveProgress, useEngineRun } from "./motion-engine"

const DEFAULT_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

type HyperTextTag = "div" | "span" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"

export type HyperTextTrigger = "hover" | "view" | "mount"

export interface HyperTextProps extends Omit<React.HTMLAttributes<HTMLElement>, "children">, EngineControlProps {
  /** The text to reveal. */
  children: string
  /** Element to render. */
  as?: HyperTextTag
  /** When the scramble runs: pointer or keyboard focus, once in view, or once on mount. */
  trigger?: HyperTextTrigger
  /** Scramble length in milliseconds. */
  duration?: number
  /** Delay before an automatic run (view or mount) in milliseconds. */
  delay?: number
  /** Characters used while scrambling. Defaults to A to Z. */
  characterSet?: string | readonly string[]
  /** Render every glyph in a one character wide cell so the line never changes width. */
  tabular?: boolean
  /** Make the element tabbable so keyboard users can trigger the hover effect. */
  focusable?: boolean
}

/** Split into user perceived characters, keeping combining marks and emoji together. */
function splitGraphemes(text: string): string[] {
  const Segmenter = (Intl as unknown as {
    Segmenter?: new (l?: string, o?: { granularity: "grapheme" }) => {
      segment: (s: string) => Iterable<{ segment: string }>
    }
  }).Segmenter
  if (Segmenter) return Array.from(new Segmenter(undefined, { granularity: "grapheme" }).segment(text), (s) => s.segment)
  return Array.from(text)
}

export const HyperText = React.forwardRef<HTMLElement, HyperTextProps>(
  (
    {
      children,
      as = "div",
      trigger = "hover",
      duration = 800,
      delay = 0,
      characterSet = DEFAULT_CHARACTER_SET,
      tabular = true,
      focusable = false,
      engine,
      motion,
      className,
      onMouseEnter,
      onFocus,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = React.useRef<HTMLElement | null>(null)
    const driverRef = React.useRef<HTMLSpanElement | null>(null)
    const stopRef = React.useRef<(() => void) | null>(null)
    const runningRef = React.useRef(false)
    const chars = React.useMemo(() => splitGraphemes(children), [children])
    const pool = React.useMemo(() => Array.from(characterSet), [characterSet])
    // null means "show the real text", so SSR and first paint are always the final string.
    const [frame, setFrame] = React.useState<string[] | null>(null)

    // Scramble progress (0 to 1) to a frame. The engine owns the clock; the scramble stays rAF based on css.
    const paint = React.useCallback(
      (progress: number) => {
        if (progress <= 0 || progress >= 1) {
          setFrame(null)
          return
        }
        const revealed = progress * chars.length
        setFrame(
          chars.map((ch, i) =>
            /^\s+$/.test(ch) || i < revealed ? ch : pool[Math.floor(Math.random() * pool.length)] ?? ch
          )
        )
      },
      [chars, pool]
    )

    const engineRef = React.useRef<MotionEngine | null>(null)

    const run = React.useCallback(
      (auto?: { delay: number; viewport: boolean }) => {
        const instance = engineRef.current
        const driver = driverRef.current
        if (!instance || !driver || pool.length === 0) return () => undefined
        if (!auto && runningRef.current) return () => undefined
        runningRef.current = true
        const stop = driveProgress(instance, driver, paint, {
          duration: Math.max(duration, 1),
          delay: auto?.delay ?? 0,
          easing: "linear",
          immediate: !auto?.viewport,
          threshold: 0.1,
          once: true,
          onComplete: () => {
            runningRef.current = false
            stopRef.current = null
          }
        })
        stopRef.current = stop
        return stop
      },
      [duration, paint, pool]
    )

    const levelRef = React.useRef<"full" | "subtle" | "none">("full")

    const { effectiveLevel } = useEngineRun(
      { engine, motion },
      (instance) => {
        engineRef.current = instance
        if (levelRef.current !== "full" || trigger === "hover") {
          return () => {
            stopRef.current?.()
            stopRef.current = null
            runningRef.current = false
            engineRef.current = null
          }
        }
        const stop = run({ delay, viewport: trigger === "view" })
        return () => {
          stop()
          stopRef.current = null
          runningRef.current = false
          engineRef.current = null
          setFrame(null)
        }
      },
      [trigger, delay, run]
    )
    levelRef.current = effectiveLevel
    const animated = effectiveLevel === "full"

    const setRef = (node: HTMLElement | null) => {
      localRef.current = node
      if (typeof forwardedRef === "function") forwardedRef(node)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
    }

    const Tag = as as React.ElementType
    const shown = frame ?? chars
    return (
      <Tag
        ref={setRef}
        data-trigger={trigger}
        data-animating={frame ? "true" : undefined}
        tabIndex={focusable && trigger === "hover" ? 0 : undefined}
        className={cn(
          "relative inline-block max-w-full overflow-hidden py-1 text-[length:clamp(1.5rem,6vw,2.5rem)] font-bold leading-tight text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]",
          className
        )}
        onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
          onMouseEnter?.(e)
          if (trigger === "hover" && animated) run()
        }}
        onFocus={(e: React.FocusEvent<HTMLElement>) => {
          onFocus?.(e)
          if (trigger === "hover" && animated) run()
        }}
        {...props}
      >
        <span className="sr-only">{children}</span>
        <span aria-hidden="true" className="select-none">
          {shown.map((ch, i) => (
            <span
              key={i}
              className={cn(
                "inline-block whitespace-pre",
                tabular && "min-w-[1ch] text-center font-mono"
              )}
            >
              {ch === " " ? " " : ch}
            </span>
          ))}
        </span>
        <span ref={driverRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      </Tag>
    )
  }
)
HyperText.displayName = "HyperText"
