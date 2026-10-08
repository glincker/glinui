"use client"

import * as React from "react"

import { cn } from "@glinui/ui"
import { STAGE_CONTROLS_ATTR } from "@/components/docs/stage-container"
import { clampFraction } from "./playback-math"
import { useStagePlayback } from "./playback-context"

const STEP = 0.05

/**
 * Thin progress line along the bottom edge of the stage. Progress-only unless scrubbing is
 * available, in which case it grows on hover and scrubs on click, drag and arrow keys.
 */
export function PlaybackProgress({
  fraction,
  scrubbable,
  onScrub
}: {
  fraction: number
  scrubbable: boolean
  spanMs: number
  onScrub: (fraction: number) => void
}) {
  const { elapsedMs } = useStagePlayback()
  const fillRef = React.useRef<HTMLDivElement | null>(null)
  const tipRef = React.useRef<HTMLSpanElement | null>(null)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const dragging = React.useRef(false)
  const [hoverText, setHoverText] = React.useState("")

  React.useEffect(() => {
    fillRef.current?.style.setProperty("--p", String(clampFraction(fraction)))
  }, [fraction])

  const fractionAt = (clientX: number): number => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return 0
    return clampFraction((clientX - rect.left) / rect.width)
  }

  const showTip = (clientX: number) => {
    const f = fractionAt(clientX)
    tipRef.current?.style.setProperty("--x", `${f * 100}%`)
    setHoverText(`${Math.round(f * 100)}%`)
  }

  return (
    <div
      {...{ [STAGE_CONTROLS_ATTR]: "" }}
      ref={rootRef}
      role={scrubbable ? "slider" : "progressbar"}
      aria-label={scrubbable ? "Timeline" : "Loop progress"}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clampFraction(fraction) * 100)}
      aria-valuetext={scrubbable ? `${(elapsedMs / 1000).toFixed(1)} seconds` : undefined}
      tabIndex={scrubbable ? 0 : -1}
      onPointerDown={(event) => {
        if (!scrubbable) return
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
        onScrub(fractionAt(event.clientX))
      }}
      onPointerMove={(event) => {
        if (!scrubbable) return
        showTip(event.clientX)
        if (dragging.current) onScrub(fractionAt(event.clientX))
      }}
      onPointerUp={() => {
        dragging.current = false
      }}
      onKeyDown={(event) => {
        if (!scrubbable) return
        if (event.key === "ArrowRight" || event.key === "ArrowUp") onScrub(fraction + STEP)
        else if (event.key === "ArrowLeft" || event.key === "ArrowDown") onScrub(fraction - STEP)
        else if (event.key === "Home") onScrub(0)
        else if (event.key === "End") onScrub(1)
        else return
        event.preventDefault()
      }}
      className={cn(
        "group/line absolute inset-x-0 bottom-0 z-10 flex h-3 items-end focus-visible:outline-none",
        scrubbable ? "cursor-pointer touch-none" : "pointer-events-none"
      )}
    >
      <div className="relative h-0.5 w-full bg-black/10 transition-[height] duration-150 group-hover/line:h-1.5 group-focus-visible/line:h-1.5 motion-reduce:transition-none dark:bg-white/15">
        <div
          ref={fillRef}
          className="h-full origin-left bg-[var(--color-accent)] [transform:scaleX(var(--p,0))] transition-transform duration-100 ease-linear motion-reduce:transition-none"
        />
      </div>
      {scrubbable ? (
        <span
          ref={tipRef}
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 [left:var(--x,0%)] -translate-x-1/2 rounded-md bg-[var(--color-foreground)] px-1.5 py-0.5 font-mono text-xs text-[color:var(--color-background)] opacity-0 transition-opacity duration-150 group-hover/line:opacity-100 motion-reduce:transition-none"
        >
          {hoverText}
        </span>
      ) : null}
    </div>
  )
}
