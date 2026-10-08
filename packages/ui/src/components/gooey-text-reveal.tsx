"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../lib/cn"
import { usePlaybackActive } from "../lib/use-playback-active"
import { mergeRefs, useMotionEngine } from "./motion-engine"

const gooeyTextRevealVariants = cva("relative inline-block max-w-full text-[var(--color-foreground)]", {
  variants: {
    variant: {
      default: "font-semibold tracking-tight",
      plain: "font-semibold tracking-tight",
      glass: "font-semibold tracking-tight [text-shadow:0_1px_12px_color-mix(in_oklab,var(--color-background)_55%,transparent)]"
    }
  },
  defaultVariants: { variant: "default" }
})

type GooeyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div" | "span"

export interface GooeyTextRevealProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children">,
    VariantProps<typeof gooeyTextRevealVariants> {
  /** Element to render. */
  as?: GooeyTag
  /**
   * A string reveals word by word with a liquid edge. An array of two or more strings morphs
   * from one to the next in a loop, like a droplet changing shape.
   */
  text: string | string[]
  /** Delay between words in milliseconds (reveal mode). */
  stagger?: number
  /** Duration of one word reveal or one morph in milliseconds. */
  duration?: number
  /** Time each phrase rests before the next morph, in milliseconds (morph mode). */
  hold?: number
  /** Blur radius in pixels at the start of a reveal. Larger values give fatter blobs. */
  blur?: number
  /** Reveal once (true) or replay every time the text re-enters the viewport (reveal mode, trigger view). */
  once?: boolean
  /** Start on mount or when scrolled into view (reveal mode). */
  trigger?: "mount" | "view"
}

const useIsoLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

const EASING = "cubic-bezier(0.22, 1, 0.36, 1)"

function frames(full: boolean, blur: number, from: "in" | "out"): Keyframe[] {
  const hidden: Keyframe = full
    ? { opacity: 0, filter: `blur(${blur}px)`, transform: "translateY(0.3em) scale(0.96)" }
    : { opacity: 0 }
  const shown: Keyframe = full ? { opacity: 1, filter: "blur(0px)", transform: "none" } : { opacity: 1 }
  return from === "in" ? [hidden, shown] : [shown, hidden]
}

/**
 * Heading whose words melt in through a shared SVG goo filter (blur plus an alpha contrast matrix).
 * The filter is only attached while an animation runs, so settled type is always crisp. Pass an array
 * to morph between phrases. The full string is the accessible name, the animated words are decorative.
 */
export const GooeyTextReveal = React.forwardRef<HTMLElement, GooeyTextRevealProps>(
  (
    { as = "h2", text, stagger = 90, duration = 900, hold = 2200, blur = 12, once = true, trigger = "view", variant, className, ...props },
    ref
  ) => {
    const rootRef = React.useRef<HTMLElement | null>(null)
    const stageRef = React.useRef<HTMLSpanElement | null>(null)
    const wordRefs = React.useRef<Array<HTMLElement | null>>([])
    const running = React.useRef<Animation[]>([])
    const reactId = React.useId()
    const filterId = `glin-goo-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`

    const phrases = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text])
    const morph = phrases.length > 1
    const label = phrases.join(morph ? ", " : " ")
    const words = React.useMemo(() => (morph ? [] : (phrases[0] ?? "").split(/\s+/).filter(Boolean)), [morph, phrases])

    const { effectiveLevel } = useMotionEngine()
    const full = effectiveLevel === "full"
    const animatable = effectiveLevel !== "none"
    const active = usePlaybackActive(rootRef)
    const activeRef = React.useRef(active)
    activeRef.current = active

    const [revealed, setRevealed] = React.useState(true)
    const [index, setIndex] = React.useState(0)

    const setFilter = React.useCallback(
      (on: boolean) => {
        const stage = stageRef.current
        if (!stage) return
        if (on) stage.style.setProperty("--gtr-filter", `url(#${filterId})`)
        else stage.style.removeProperty("--gtr-filter")
      },
      [filterId]
    )

    const stop = React.useCallback(() => {
      running.current.forEach((animation) => animation.cancel())
      running.current = []
      setFilter(false)
    }, [setFilter])

    useIsoLayout(() => {
      // Hide words before first paint when a reveal is going to play; otherwise show the final text.
      setRevealed(morph || !animatable)
    }, [morph, animatable])

    // Reveal mode: stagger the words in once triggered.
    React.useEffect(() => {
      const root = rootRef.current
      if (morph || !animatable || !root) return
      const play = () => {
        stop()
        if (typeof root.animate !== "function") {
          setRevealed(true)
          return
        }
        if (full) setFilter(true)
        const list: Animation[] = []
        wordRefs.current.forEach((word, i) => {
          if (!word) return
          list.push(
            word.animate(frames(full, blur, "in"), { duration, delay: i * stagger, easing: EASING, fill: "backwards" })
          )
        })
        running.current = list
        const last = list[list.length - 1]
        if (last) last.onfinish = () => setFilter(false)
        if (!activeRef.current) list.forEach((animation) => animation.pause())
        setRevealed(true)
      }
      if (trigger === "mount" || typeof IntersectionObserver === "undefined") {
        play()
        return stop
      }
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[entries.length - 1]
          if (!entry) return
          if (entry.isIntersecting) {
            play()
            if (once) observer.disconnect()
          } else if (!once) {
            stop()
            setRevealed(false)
          }
        },
        { threshold: 0.2 }
      )
      observer.observe(root)
      return () => {
        observer.disconnect()
        stop()
      }
    }, [morph, animatable, full, trigger, once, stagger, duration, blur, words, stop, setFilter])

    // Morph mode: swap phrases in a loop while visible.
    React.useEffect(() => {
      if (!morph || !animatable || !active) return
      let timer: ReturnType<typeof setTimeout> | undefined
      timer = setTimeout(() => {
        const next = (index + 1) % phrases.length
        const from = wordRefs.current[index]
        const to = wordRefs.current[next]
        if (!from || !to || typeof to.animate !== "function") {
          setIndex(next)
          return
        }
        if (full) setFilter(true)
        const options: KeyframeAnimationOptions = { duration, easing: EASING, fill: "forwards" }
        const incoming = to.animate(frames(full, blur, "in"), options)
        const outgoing = from.animate(frames(full, blur, "out"), options)
        running.current = [incoming, outgoing]
        incoming.onfinish = () => {
          setFilter(false)
          setIndex(next)
        }
      }, hold)
      return () => {
        if (timer) clearTimeout(timer)
        timer = undefined
        stop()
      }
    }, [morph, animatable, active, full, index, phrases.length, hold, duration, blur, stop, setFilter])

    // Pause reveal animations while offscreen or while the tab is hidden.
    React.useEffect(() => {
      running.current.forEach((animation) => (active ? animation.play() : animation.pause()))
    }, [active])

    const Comp = as as React.ElementType
    const setWord = (i: number) => (node: HTMLElement | null) => {
      wordRefs.current[i] = node
    }

    return (
      <Comp
        ref={mergeRefs<HTMLElement>(ref, rootRef)}
        aria-label={label}
        data-slot="gooey-text-reveal"
        data-mode={morph ? "morph" : "reveal"}
        data-animated={animatable ? "true" : "false"}
        className={cn(gooeyTextRevealVariants({ variant }), className)}
        {...props}
      >
        <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute size-0">
          <defs>
            <filter id={filterId} x="-10%" y="-40%" width="120%" height="180%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="soft" />
              <feColorMatrix in="soft" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -10" />
            </filter>
          </defs>
        </svg>
        <span
          ref={stageRef}
          aria-hidden="true"
          data-slot="gooey-text-stage"
          className={cn("block [filter:var(--gtr-filter,none)]", morph && "grid")}
        >
          {morph
            ? phrases.map((phrase, i) => (
                <span
                  key={`${i}-${phrase}`}
                  ref={setWord(i)}
                  data-current={i === index ? "true" : "false"}
                  className="block text-center [grid-area:1/1] data-[current=false]:opacity-0"
                >
                  {phrase}
                </span>
              ))
            : words.map((word, i) => (
                <React.Fragment key={`${i}-${word}`}>
                  {i > 0 ? " " : null}
                  <span
                    ref={setWord(i)}
                    data-revealed={revealed ? "true" : "false"}
                    className="inline-block data-[revealed=false]:opacity-0"
                  >
                    {word}
                  </span>
                </React.Fragment>
              ))}
        </span>
      </Comp>
    )
  }
)

GooeyTextReveal.displayName = "GooeyTextReveal"
