"use client"

/**
 * Glin UI Terminal (terminal). Adapted from Terminal, AnimatedSpan and TypingAnimation in Magic UI
 * (https://github.com/magicuidesign/magicui, apps/www/registry/magicui/terminal.tsx),
 * commit cdb348cb4c72a9b54b554d8617801e479fbc8714.
 * Original copyright (c) Magic UI. Licensed under MIT.
 * Modified for Glin UI: css timers by default with line entrances and typing driven by the pluggable motion engine, static first render, full transcript for assistive tech, copy button, tokens, glass, motion levels.
 * See THIRD_PARTY_NOTICES.md#terminal.
 */

import * as React from "react"

import { cn } from "../lib/cn"
import type { SurfaceTone, SurfaceVariant } from "../lib/surface"
import { containerSurface, resolveSurfaceProps } from "../lib/surface-resolve"
import { useGlinStyle } from "./glin-provider"
import { CopyButton } from "./copy-button"
import type { MotionEngine } from "@glinui/motion"
import type { EngineControlProps } from "./reveal"
import { driveProgress, mergeRefs, useMotionEngine } from "./motion-engine"

const LINE_MS = 300

const TERMINAL_BASE = "relative flex w-full max-w-xl flex-col"

/** Class string for the terminal shell. Kept as an export for consumers composing their own window. */
const terminalVariants = (opts: { variant: SurfaceVariant; tone?: SurfaceTone }): string =>
  cn(TERMINAL_BASE, containerSurface(opts.variant, { radius: "xl", elevation: "2", tone: opts.tone }))

type TerminalContextValue = {
  /** Animation is active (client, motion allowed, has animated children). */
  armed: boolean
  /** Playback may begin (in view, or startOnView is off). */
  started: boolean
  sequence: boolean
  /** Typing is allowed (motion level full); lower levels only fade lines in. */
  full: boolean
  activeIndex: number
  complete: (index: number) => void
  /** Resolved motion engine, null while a lazy engine loads. */
  instance: MotionEngine | null
  /** True when the css timer fallback should type (no library engine). */
  timer: boolean
}

const TerminalContext = React.createContext<TerminalContextValue | null>(null)
const ItemIndexContext = React.createContext<number | null>(null)

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

function nodeText(node: React.ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(nodeText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) return nodeText(node.props.children)
  return ""
}

type Phase = "static" | "hidden" | "shown"

function useTerminalItem(delay: number) {
  const ctx = React.useContext(TerminalContext)
  const index = React.useContext(ItemIndexContext)
  const [revealed, setRevealed] = React.useState(false)
  const armed = ctx?.armed ?? false
  const ready =
    ctx !== null && armed && ctx.started && ctx.instance !== null && index !== null && (!ctx.sequence || ctx.activeIndex === index)

  React.useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => setRevealed(true), Math.max(0, delay))
    return () => clearTimeout(timer)
  }, [ready, delay])

  const phase: Phase = !armed || index === null ? "static" : revealed ? "shown" : "hidden"
  return { phase, index, complete: ctx?.complete, full: ctx?.full ?? false, instance: ctx?.instance ?? null, timer: ctx?.timer ?? true }
}

export type AnimatedSpanProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Milliseconds to wait after this line's turn before it appears. */
  delay?: number
}

/** One output line that fades in during the terminal sequence. Always present in the DOM. */
export function AnimatedSpan({ children, delay = 0, className, ...props }: AnimatedSpanProps) {
  const { phase, index, complete, instance } = useTerminalItem(delay)
  const lineRef = React.useRef<HTMLDivElement | null>(null)

  // The line enters through the active motion engine (fade and a small rise).
  useIsomorphicLayoutEffect(() => {
    const el = lineRef.current
    if (phase !== "shown" || !el || !instance) return
    return instance.reveal(el, { direction: "up", distance: 4, duration: LINE_MS, easing: "out", immediate: true })
  }, [phase, instance])

  React.useEffect(() => {
    if (phase !== "shown" || !complete || index === null) return
    const timer = setTimeout(() => complete(index), LINE_MS)
    return () => clearTimeout(timer)
  }, [phase, complete, index])

  return (
    <div
      ref={lineRef}
      data-state={phase}
      className={cn("grid text-sm font-normal tracking-tight", phase === "hidden" && "invisible", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export type TypingAnimationProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> & {
  /** Text to type. Must be a string. */
  children: string
  /** Milliseconds per character. */
  duration?: number
  /** Milliseconds to wait after this line's turn before typing starts. */
  delay?: number
  as?: "span" | "div" | "p"
}

/** A command typed character by character. Renders the full text when static or reduced. */
export function TypingAnimation({
  children,
  duration = 60,
  delay = 0,
  as: Tag = "span",
  className,
  ...props
}: TypingAnimationProps) {
  const { phase, index, complete, full, instance, timer } = useTerminalItem(delay)
  const chars = React.useMemo(() => Array.from(children), [children])
  const [count, setCount] = React.useState(0)
  const driverRef = React.useRef<HTMLSpanElement | null>(null)

  React.useEffect(() => {
    if (phase !== "shown" || !complete || index === null) return
    if (!full) {
      setCount(chars.length)
      const timer = setTimeout(() => complete(index), 0)
      return () => clearTimeout(timer)
    }
    setCount(0)
    const driver = driverRef.current
    if (!timer && instance && driver) {
      // Library engines own the typing clock; css keeps the dependency-free interval below.
      let finished = false
      const stop = driveProgress(
        instance,
        driver,
        (p) => setCount(Math.min(chars.length, Math.floor(p * (chars.length + 1)))),
        {
          duration: Math.max(1, duration) * (chars.length + 1),
          immediate: true,
          onComplete: () => {
            finished = true
            complete(index)
          }
        }
      )
      return () => {
        stop()
        if (!finished) setCount(chars.length)
      }
    }
    let step = 0
    const interval = setInterval(() => {
      step += 1
      setCount(step)
      if (step >= chars.length) {
        clearInterval(interval)
        complete(index)
      }
    }, Math.max(1, duration))
    return () => clearInterval(interval)
  }, [phase, complete, index, full, chars, duration, instance, timer])

  const typed = phase === "shown" ? chars.slice(0, count).join("") : ""
  const rest = phase === "shown" ? chars.slice(count).join("") : children
  const typing = phase === "shown" && count < chars.length

  return (
    <Tag
      data-state={phase}
      className={cn("text-sm font-normal tracking-tight", phase === "hidden" && "invisible", className)}
      {...props}
    >
      {phase === "static" ? (
        children
      ) : (
        <>
          <span>{typed}</span>
          {typing && full ? (
            <span
              aria-hidden="true"
              className="inline-block h-[1em] w-[0.55ch] translate-y-[0.15em] bg-current motion-safe:animate-[glin-a4-caret_1s_steps(1)_infinite]"
            />
          ) : null}
          <span className={phase === "hidden" || typing ? "invisible" : "hidden"}>{rest}</span>
          <span ref={driverRef} aria-hidden="true" className="hidden" />
        </>
      )}
    </Tag>
  )
}

export type TerminalProps = Omit<React.HTMLAttributes<HTMLDivElement>, "title"> &
  EngineControlProps &
  {
    /** Visual variant. Omit for the ambient design style (glinr: lift shell, raised chrome strip, inset output well; plain: flat bordered terminal). */
    variant?: SurfaceVariant | "default" | "raised" | "frosted"
    tone?: SurfaceTone
    /** Window title in the chrome. */
    title?: string
    /** Reveal animated children one after another. */
    sequence?: boolean
    /** Wait until the terminal is scrolled into view before playing. */
    startOnView?: boolean
    /** Show the copy button. */
    showCopy?: boolean
    /** Text copied by the button. Defaults to the full transcript. */
    copyValue?: string
    /** Class for the scrolling output area. */
    outputClassName?: string
  }

/**
 * Terminal window with a sequenced output. The first render is always the full
 * final text (SSR, no JS, reduced motion, motion level none). Assistive tech gets a
 * full transcript while the animated layer is hidden from it.
 */
export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    {
      className,
      variant,
      tone,
      title,
      sequence = true,
      startOnView = true,
      showCopy = true,
      copyValue,
      outputClassName,
      engine: engineProp,
      motion,
      children,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const ambient = useGlinStyle()
    const { variant: resolved, tone: aliasTone } = resolveSurfaceProps(variant, ambient, "container")
    const { effectiveLevel, instance } = useMotionEngine({ engine: engineProp, motion })
    const rootRef = React.useRef<HTMLDivElement | null>(null)
    const [mounted, setMounted] = React.useState(false)
    const [inView, setInView] = React.useState(false)
    const [done, setDone] = React.useState<ReadonlySet<number>>(() => new Set())

    useIsomorphicLayoutEffect(() => setMounted(true), [])

    const { wrapped, count, transcript } = React.useMemo(() => {
      let counter = 0
      const lines: string[] = []
      const nodes = React.Children.toArray(children).map((child, position) => {
        lines.push(nodeText(child))
        if (React.isValidElement(child) && (child.type === AnimatedSpan || child.type === TypingAnimation)) {
          const itemIndex = counter
          counter += 1
          return (
            <ItemIndexContext.Provider key={child.key ?? position} value={itemIndex}>
              {child}
            </ItemIndexContext.Provider>
          )
        }
        return child
      })
      return { wrapped: nodes, count: counter, transcript: lines.filter(Boolean) }
    }, [children])

    const armed = mounted && effectiveLevel !== "none" && count > 0

    React.useEffect(() => {
      if (!armed || !startOnView) return
      const node = rootRef.current
      if (!node || typeof IntersectionObserver === "undefined") {
        setInView(true)
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setInView(true)
            observer.disconnect()
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(node)
      return () => observer.disconnect()
    }, [armed, startOnView])

    const complete = React.useCallback((index: number) => {
      setDone((previous) => (previous.has(index) ? previous : new Set(previous).add(index)))
    }, [])

    let activeIndex = 0
    while (done.has(activeIndex)) activeIndex += 1

    const finished = !armed || done.size >= count
    const context = React.useMemo<TerminalContextValue>(
      () => ({
        armed,
        started: armed && (!startOnView || inView),
        sequence,
        full: effectiveLevel === "full",
        activeIndex,
        complete,
        instance,
        timer: instance?.name === "css" || instance === null
      }),
      [armed, startOnView, inView, sequence, effectiveLevel, activeIndex, complete, instance]
    )

    const lifted = resolved === "glinr" || resolved === "gradient"

    return (
      <div
        ref={mergeRefs(ref, rootRef)}
        role="group"
        aria-label={ariaLabel ?? title ?? "Terminal"}
        data-animating={finished ? "false" : "true"}
        data-variant={resolved}
        className={cn(terminalVariants({ variant: resolved, tone: tone ?? aliasTone }), "overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "flex items-center gap-3 border-b px-4 py-2.5",
            lifted
              ? "relative z-[1] border-[color:var(--line-soft)] [background:var(--sheen),var(--face-0,var(--surface-2))] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06),0_8px_12px_-8px_rgb(0_0_0_/_0.35)]"
              : "border-[color:var(--color-border)]"
          )}
        >
          <span aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
            <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--color-muted)_45%,transparent)]" />
          </span>
          {title ? <span className="min-w-0 truncate text-xs font-medium text-[var(--color-muted)]">{title}</span> : null}
          {showCopy ? (
            <CopyButton
              iconOnly
              label="Copy terminal output"
              copiedLabel="Copied terminal output"
              getValue={() => copyValue ?? transcript.join("\n")}
              className="ms-auto"
            />
          ) : null}
        </div>
        {finished ? null : (
          <div data-slot="transcript" className="sr-only">
            {transcript.map((line, position) => (
              <span key={position} className="block">
                {line}
              </span>
            ))}
          </div>
        )}
        <TerminalContext.Provider value={context}>
          <pre
            dir="ltr"
            aria-hidden={finished ? undefined : true}
            aria-live="off"
            className={cn(
              "max-h-96 overflow-auto p-4 font-mono text-sm",
              lifted && "m-2 rounded-[var(--lift-r-inner)] bg-[var(--well,var(--surface-well))] [box-shadow:var(--elev-inset)]",
              outputClassName
            )}
          >
            <code className="grid gap-y-1">{wrapped}</code>
          </pre>
        </TerminalContext.Provider>
      </div>
    )
  }
)

Terminal.displayName = "Terminal"

export { terminalVariants }
