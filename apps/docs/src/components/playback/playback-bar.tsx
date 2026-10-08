"use client"

import * as React from "react"
import { ArrowCounterClockwise, Pause, Play, Repeat, SlidersHorizontal } from "@phosphor-icons/react"

import { cn, Popover, PopoverContent, PopoverTrigger } from "@glinui/ui"
import { STAGE_CONTROLS_ATTR } from "@/components/docs/stage-container"
import {
  PLAYBACK_SPEEDS,
  loopPeriodMs,
  type PlaybackMode,
  type PlaybackSpeed
} from "./playback-math"
import { useStagePlayback } from "./playback-context"
import { PlaybackProgress } from "./playback-progress"
import { usePillVisibility } from "./use-pill-visibility"

const LOOP_CHOICES: ReadonlyArray<{ mode: PlaybackMode; label: string }> = [
  { mode: "loop-3", label: "3s" },
  { mode: "loop-4", label: "4s" },
  { mode: "loop-6", label: "6s" }
]

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)]"

const iconButton = cn(
  "relative inline-flex size-7 items-center justify-center rounded-full text-[color:var(--color-foreground)] transition-[background-color,transform] duration-150 ease-out hover:bg-black/[0.07] active:scale-95 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none motion-reduce:active:scale-100 dark:hover:bg-white/[0.12]",
  focusRing
)

const pillShell =
  "pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[color-mix(in_oklab,var(--surface-1)_82%,transparent)] p-1 [box-shadow:var(--elev-2)] ring-1 ring-[var(--line-soft)] backdrop-blur-md transition-[opacity,transform] duration-150 ease-out data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-1 data-[visible=false]:opacity-0 motion-reduce:transition-none motion-reduce:data-[visible=false]:translate-y-0"

function Tip({ label, hint }: { label: string; hint?: string }) {
  return (
    <span
      role="presentation"
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-foreground)] px-2 py-1 text-xs text-[color:var(--color-background)] opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100 motion-reduce:transition-none"
    >
      {label}
      {hint ? <span className="ml-1.5 opacity-70">{hint}</span> : null}
    </span>
  )
}

function ControlButton({
  label,
  hint,
  pressed,
  disabled,
  onClick,
  children
}: {
  label: string
  hint?: string
  pressed?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(iconButton, "group/tip")}
    >
      {children}
      <Tip label={label} hint={hint} />
    </button>
  )
}

function Segments<T extends string | number>({
  label,
  options,
  value,
  onChange,
  disabled = false
}: {
  label: string
  options: ReadonlyArray<{ value: T; text: string }>
  value: T | null
  onChange: (next: T) => void
  disabled?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-[color:var(--color-muted)]">{label}</span>
      <div role="group" aria-label={label} className="flex items-center gap-0.5 rounded-full bg-[var(--surface-2)] p-0.5 ring-1 ring-[var(--line-soft)]">
        {options.map((option) => (
          <button
            key={String(option.value)}
            type="button"
            aria-pressed={value === option.value}
            aria-label={`${label} ${option.text}`}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-6 min-w-9 rounded-full px-2 font-mono text-xs transition-colors duration-150 disabled:opacity-40 motion-reduce:transition-none",
              focusRing,
              value === option.value
                ? "bg-[var(--color-foreground)] text-[color:var(--color-background)]"
                : "text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
            )}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}

/** Replay-only pill for usage examples. */
function ReplayOnly() {
  const { replay, stageEl } = useStagePlayback()
  const visible = usePillVisibility(stageEl, false)
  return (
    <section
      {...{ [STAGE_CONTROLS_ATTR]: "" }}
      aria-label="Example playback"
      className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex justify-center"
    >
      <div data-visible={visible} className={pillShell}>
        <ControlButton label="Replay animation" onClick={replay}>
          <ArrowCounterClockwise className="size-4" weight="bold" aria-hidden="true" />
        </ControlButton>
      </div>
    </section>
  )
}

export function PlaybackBar() {
  const pb = useStagePlayback()
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [announce, setAnnounce] = React.useState("")
  const first = React.useRef(true)
  const lastLoop = React.useRef<PlaybackMode>("loop-4")
  const visible = usePillVisibility(pb.stageEl, !pb.playing || settingsOpen)

  if (pb.mode !== "once") lastLoop.current = pb.mode

  React.useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setAnnounce(pb.playing ? "Playing" : "Paused")
  }, [pb.playing])

  if (!pb.enabled || !pb.meta) return null
  if (pb.replayOnly) return pb.meta.oneShot ? <ReplayOnly /> : null

  const { meta } = pb
  const looping = pb.mode !== "once"
  const periodMs = loopPeriodMs(pb.mode, meta.durationMs) ?? Math.max(meta.durationMs, 1)
  const progress = pb.canScrub ? pb.fraction : Math.min(1, (pb.elapsedMs % periodMs) / periodMs)
  const loopLabel = looping ? `Loop on, cycle ${pb.cycle}` : "Loop off"

  return (
    <>
      <section
        {...{ [STAGE_CONTROLS_ATTR]: "" }}
        aria-label="Animation playback"
        className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex justify-center px-3"
      >
        <div data-visible={visible} className={pillShell}>
          {meta.oneShot ? (
            <ControlButton label="Replay animation" onClick={pb.replay}>
              <ArrowCounterClockwise className="size-4" weight="bold" aria-hidden="true" />
            </ControlButton>
          ) : null}
          <ControlButton
            label="Pause animation"
            pressed={!pb.playing}
            disabled={pb.motionOff}
            onClick={pb.playing ? pb.pause : pb.play}
          >
            {pb.playing ? (
              <Pause className="size-4" weight="bold" aria-hidden="true" />
            ) : (
              <Play className="size-4" weight="bold" aria-hidden="true" />
            )}
          </ControlButton>
          {meta.oneShot ? (
            <ControlButton
              label={loopLabel}
              pressed={looping}
              disabled={!pb.autoLoopAllowed}
              onClick={() => pb.setMode(looping ? "once" : lastLoop.current)}
            >
              <Repeat className="size-4" weight={looping ? "bold" : "regular"} aria-hidden="true" />
              {looping ? (
                <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-[var(--color-accent)]" aria-hidden="true" />
              ) : null}
            </ControlButton>
          ) : null}
          {meta.oneShot ? (
            <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
              <PopoverTrigger
                asChild
                className={cn(iconButton, "group/tip h-7 w-7 border-0 bg-transparent p-0 text-[color:var(--color-foreground)] shadow-none ring-0")}
              >
                <button type="button" aria-label="Playback settings">
                  <SlidersHorizontal className="size-4" weight={settingsOpen ? "bold" : "regular"} aria-hidden="true" />
                  <Tip label="Playback settings" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="center"
                collisionPadding={12}
                className="flex w-60 flex-col gap-3 p-3 max-sm:w-[calc(100vw-2rem)]"
              >
                <Segments<PlaybackMode>
                  label="Loop every"
                  options={LOOP_CHOICES.map((choice) => ({ value: choice.mode, text: choice.label }))}
                  value={looping ? pb.mode : null}
                  onChange={pb.setMode}
                  disabled={!pb.autoLoopAllowed}
                />
                <Segments<PlaybackSpeed>
                  label="Speed"
                  options={PLAYBACK_SPEEDS.map((speed) => ({ value: speed, text: `${speed}x` }))}
                  value={pb.speed}
                  onChange={pb.setSpeed}
                  disabled={!pb.speedApplies}
                />
                {!pb.speedApplies ? (
                  <p className="text-xs text-[color:var(--color-muted)]">Speed and timeline are unavailable for script-driven animation.</p>
                ) : null}
                {pb.reduced ? <p className="text-xs text-[color:var(--color-muted)]">Reduced motion is on: replay is manual.</p> : null}
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
        <span role="status" aria-live="polite" className="sr-only">
          {announce}
        </span>
      </section>
      <PlaybackProgress fraction={progress} scrubbable={pb.canScrub} spanMs={meta.durationMs} onScrub={pb.scrubTo} />
    </>
  )
}
