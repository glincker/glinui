"use client"

import * as React from "react"
import { cn } from "../lib/cn"
import type { EngineControlProps } from "./reveal"
import { driveProgress, useEngineRun } from "./motion-engine"

export interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement>, EngineControlProps {
  /** The text to type out (single string mode). */
  text?: string
  /** Array of words/phrases to cycle through (multi-word mode). */
  words?: string[]
  /** Milliseconds per character when typing. Default: 50 */
  speed?: number
  /** Milliseconds per character when deleting. Default: 30 */
  deleteSpeed?: number
  /** Initial delay before typing starts, in ms. Default: 0 */
  delay?: number
  /** Show a blinking cursor. Default: true */
  cursor?: boolean
  /** The cursor character. Default: "|" */
  cursorChar?: string
  /** Loop the typing animation. Default: false */
  loop?: boolean
  /** Pause at end before deleting/retyping, in ms. Default: 1500 */
  pauseDuration?: number
  /** Callback fired when a word finishes typing (fires per cycle). */
  onComplete?: () => void
}

type Phase = "idle" | "typing" | "pausing" | "deleting"

export const Typewriter = React.forwardRef<HTMLSpanElement, TypewriterProps>(
  (
    {
      className,
      text,
      words,
      speed = 50,
      deleteSpeed = 30,
      delay = 0,
      cursor = true,
      cursorChar = "|",
      loop = false,
      pauseDuration = 1500,
      onComplete,
      engine,
      motion,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [displayedText, setDisplayedText] = React.useState<string>("")
    const [phase, setPhase] = React.useState<Phase>("idle")
    const driverRef = React.useRef<HTMLSpanElement | null>(null)
    const levelRef = React.useRef<"full" | "subtle" | "none">("full")

    // Resolve the word list: words array takes priority, fallback to single text
    const wordList = React.useMemo(() => {
      if (words && words.length > 0) return words
      if (text) return [text]
      return [""]
    }, [words, text])

    const isMultiWord = wordList.length > 1

    // Stable ref so effect deps stay minimal
    const onCompleteRef = React.useRef(onComplete)
    React.useEffect(() => {
      onCompleteRef.current = onComplete
    }, [onComplete])

    const state = useEngineRun(
      { engine, motion },
      (instance) => {
        // Reduced or lowered motion: show the first word immediately with no typing.
        if (levelRef.current !== "full") {
          setDisplayedText(wordList[0])
          setPhase("pausing")
          onCompleteRef.current?.()
          return
        }

        const driver = driverRef.current
        // The css engine keeps the dependency-free timer; library engines drive each phase.
        const useTimer = instance.name === "css" || !driver

        let wordIndex = 0
        let timeoutId: ReturnType<typeof setTimeout> | undefined
        let stopPhase: (() => void) | undefined
        let cancelled = false

        /** Walk the visible character count from `from` to `to` (inclusive), then call `done`. */
        const walk = (word: string, from: number, to: number, perChar: number, done: () => void) => {
          const span = Math.abs(to - from)
          const sign = to >= from ? 1 : -1
          const show = (count: number) => {
            if (!cancelled) setDisplayedText(word.slice(0, count))
          }
          if (useTimer || !driver) {
            let i = 0
            const tick = () => {
              if (cancelled) return
              if (i <= span) {
                show(from + sign * i)
                i += 1
                timeoutId = setTimeout(tick, perChar)
              } else {
                done()
              }
            }
            tick()
            return
          }
          stopPhase = driveProgress(
            instance,
            driver,
            (p) => show(from + sign * Math.min(span, Math.floor(p * (span + 1)))),
            { duration: Math.max(1, (span + 1) * perChar), immediate: true, onComplete: () => !cancelled && done() }
          )
        }

        const typeWord = () => {
          if (cancelled) return
          const currentWord = wordList[wordIndex]
          setPhase("typing")
          walk(currentWord, 0, currentWord.length, speed, () => {
            setPhase("pausing")
            onCompleteRef.current?.()
            if (isMultiWord || loop) {
              timeoutId = setTimeout(() => deleteWord(currentWord), pauseDuration)
            }
          })
        }

        const deleteWord = (currentWord: string) => {
          if (cancelled) return
          setPhase("deleting")
          walk(currentWord, currentWord.length, 0, deleteSpeed, () => {
            wordIndex = (wordIndex + 1) % wordList.length
            // If not looping and we've cycled through all words, stop
            if (!loop && wordIndex === 0 && !isMultiWord) {
              setPhase("pausing")
              return
            }
            timeoutId = setTimeout(typeWord, speed * 2)
          })
        }

        setDisplayedText("")
        setPhase("idle")
        timeoutId = setTimeout(typeWord, delay)

        return () => {
          cancelled = true
          if (timeoutId) clearTimeout(timeoutId)
          stopPhase?.()
        }
      },
      [wordList, speed, deleteSpeed, delay, loop, pauseDuration, isMultiWord]
    )
    levelRef.current = state.effectiveLevel

    // Cursor blinks when pausing; solid while actively typing/deleting
    const cursorBlinking = phase === "pausing"

    // For aria-label: join all words or use single text
    const fullLabel = ariaLabel ?? wordList.join(", ")

    return (
      <span
        ref={ref}
        aria-label={fullLabel}
        aria-live="off"
        className={cn("relative inline-flex items-baseline", className)}
        {...props}
      >
        <span ref={driverRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
        {/* Screen readers get the full text via aria-label; hide typed chars */}
        <span aria-hidden="true">{displayedText}</span>

        {cursor && (
          <span
            aria-hidden="true"
            className={cn(
              "ml-[0.05em] inline-block select-none",
              cursorBlinking
                ? "animate-blink motion-reduce:[animation:none]"
                : "opacity-100"
            )}
          >
            {cursorChar}
          </span>
        )}
      </span>
    )
  }
)

Typewriter.displayName = "Typewriter"
