"use client"

import * as React from "react"

import { MotionEngineProvider } from "@glinui/ui"

import { STAGE_CONTROLS_ATTR } from "@/components/docs/stage-container"
import { getPlaybackMeta, hasPlaybackControls, type PlaybackMeta } from "@/lib/playback-meta"
import {
  advanceElapsed,
  loopPeriodMs,
  scrubSpanMs,
  shouldRestart,
  timeToFraction,
  fractionToTime,
  type PlaybackMode,
  type PlaybackSpeed
} from "./playback-math"
import { readStoredPlayback, writeStoredPlayback } from "./playback-storage"
import { useMotionEnvironment } from "./use-motion-environment"

const TICK_MS = 100
const SCAN_DELAYS_MS: readonly number[] = [60, 250, 700, 1600]

/** Stage-scoped CSS that freezes descendants when `data-playback="paused"` is set. */
export const PLAYBACK_STAGE_CLASSES =
  "group/stage [&[data-playback=paused]_*]:![animation-play-state:paused] [&[data-playback=paused]_*::before]:![animation-play-state:paused] [&[data-playback=paused]_*::after]:![animation-play-state:paused]"

export interface PlaybackState {
  mode: PlaybackMode
  playing: boolean
  speed: PlaybackSpeed
  cycle: number
  elapsedMs: number
  canScrub: boolean
}

export interface PlaybackActions {
  play: () => void
  pause: () => void
  replay: () => void
  setMode: (mode: PlaybackMode) => void
  setSpeed: (speed: PlaybackSpeed) => void
  scrubTo: (fraction: number) => void
}

export interface PlaybackContextValue extends PlaybackState, PlaybackActions {
  /** Whether this stage has playback controls at all. */
  enabled: boolean
  meta: PlaybackMeta | null
  /** Controls limited to a replay button (usage examples). */
  replayOnly: boolean
  /** Speed changes reach the animation (CSS and Web Animations only). */
  speedApplies: boolean
  /** Loop timer may run (false under reduced motion or motion level none). */
  autoLoopAllowed: boolean
  reduced: boolean
  motionOff: boolean
  /** Scrub position, 0 to 1. */
  fraction: number
  /** Engine for this stage subtree (local choice, else the site-wide setting). */
  engine: string
  engineAware: boolean
  selectEngine: (engine: string) => void
  /** Stage element the bar belongs to (null until mounted). */
  stageEl: HTMLElement | null
}

const NOOP = () => undefined

const INERT: PlaybackContextValue = {
  mode: "once",
  playing: true,
  speed: 1,
  cycle: 1,
  elapsedMs: 0,
  canScrub: false,
  play: NOOP,
  pause: NOOP,
  replay: NOOP,
  setMode: NOOP,
  setSpeed: NOOP,
  scrubTo: NOOP,
  enabled: false,
  meta: null,
  replayOnly: false,
  speedApplies: false,
  autoLoopAllowed: false,
  reduced: false,
  motionOff: false,
  fraction: 0,
  engine: "css",
  engineAware: false,
  selectEngine: NOOP,
  stageEl: null
}

const PlaybackContext = React.createContext<PlaybackContextValue>(INERT)

/** Playback state for the nearest stage. Outside a provider it returns an inert value. */
export function useStagePlayback(): PlaybackContextValue {
  return React.useContext(PlaybackContext)
}

function insideControls(animation: Animation): boolean {
  const effect = animation.effect
  if (typeof KeyframeEffect !== "undefined" && effect instanceof KeyframeEffect) {
    const target = effect.target
    return target instanceof Element && target.closest(`[${STAGE_CONTROLS_ATTR}]`) !== null
  }
  return false
}

export function StagePlaybackProvider({
  componentId,
  stageEl,
  replayOnly = false,
  initialEngine,
  engineEnabled = true,
  children
}: {
  engineEnabled?: boolean
  initialEngine?: string
  componentId?: string
  stageEl: HTMLElement | null
  replayOnly?: boolean
  children: React.ReactNode
}) {
  const meta = getPlaybackMeta(componentId)
  const enabled = hasPlaybackControls(meta)
  const { reduced, motionOff, engine: siteEngine } = useMotionEnvironment()
  const engineAware = enabled && engineEnabled && meta.engineAware
  const [engineChoice, setEngineChoice] = React.useState<string | null>(null)
  const engine = engineAware ? (engineChoice ?? siteEngine) : "css"
  const autoLoopAllowed = enabled && !replayOnly && !reduced && !motionOff && meta.oneShot && meta.loopable
  const speedApplies = enabled && !replayOnly && meta.scrub === "waapi"

  const [mode, setModeState] = React.useState<PlaybackMode>(enabled && meta.oneShot && !replayOnly ? "loop-4" : "once")
  const [speed, setSpeedState] = React.useState<PlaybackSpeed>(1)
  const [playing, setPlaying] = React.useState(true)
  const [cycle, setCycle] = React.useState(1)
  const [elapsedMs, setElapsedMs] = React.useState(0)
  const [spanMs, setSpanMs] = React.useState(0)
  const [inView, setInView] = React.useState(true)
  const [tabVisible, setTabVisible] = React.useState(true)

  const known = React.useRef<Set<Animation>>(new Set())
  const pausedByUs = React.useRef<Set<Animation>>(new Set())
  const live = React.useRef({ playing: true, speed: 1 as PlaybackSpeed, mode, elapsed: 0, span: 0 })
  live.current.playing = playing
  live.current.speed = speed
  live.current.mode = mode

  const effectiveMode: PlaybackMode = autoLoopAllowed ? mode : "once"
  const canScrub = enabled && meta.scrub === "waapi" && spanMs > 0

  // Restore the persisted preferences after mount (keeps server and first client render equal).
  React.useEffect(() => {
    if (!engineAware) return
    const stored = readStoredPlayback()
    if (initialEngine) setEngineChoice(initialEngine)
    else if (stored.engine) setEngineChoice(stored.engine)
  }, [engineAware, initialEngine])

  React.useEffect(() => {
    if (!enabled || replayOnly) return
    const stored = readStoredPlayback()
    if (stored.speed) setSpeedState(stored.speed)
    if (stored.mode && meta.oneShot) setModeState(stored.mode)
  }, [enabled, replayOnly, meta])

  const applyState = React.useCallback(() => {
    if (!stageEl || typeof stageEl.getAnimations !== "function") return
    const { playing: isPlaying, speed: rate } = live.current
    stageEl.setAttribute("data-playback", isPlaying ? "playing" : "paused")
    for (const animation of stageEl.getAnimations({ subtree: true })) {
      if (insideControls(animation)) continue
      known.current.add(animation)
    }
    for (const animation of known.current) {
      animation.playbackRate = speedApplies ? rate : 1
      if (!isPlaying) {
        if (animation.playState === "running") {
          animation.pause()
          pausedByUs.current.add(animation)
        }
      } else if (pausedByUs.current.has(animation)) {
        animation.play()
        pausedByUs.current.delete(animation)
      }
    }
  }, [stageEl, speedApplies])

  const scan = React.useCallback(() => {
    applyState()
    const timings: Array<{ endTime: number; duration: number }> = []
    for (const animation of known.current) {
      const timing = animation.effect?.getComputedTiming()
      if (!timing) continue
      timings.push({ endTime: Number(timing.endTime), duration: Number(timing.duration) })
    }
    const span = scrubSpanMs(timings)
    live.current.span = span
    setSpanMs((prev) => (prev === span ? prev : span))
  }, [applyState])

  // New cycle: forget animations from the previous mount and rediscover them.
  React.useEffect(() => {
    if (!enabled || !stageEl) return
    known.current.clear()
    pausedByUs.current.clear()
    live.current.span = 0
    setSpanMs(0)
    const timers = SCAN_DELAYS_MS.map((delay) => window.setTimeout(scan, delay))
    let frame = 0
    const onStart = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(scan)
    }
    stageEl.addEventListener("animationstart", onStart)
    stageEl.addEventListener("transitionrun", onStart)
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      window.cancelAnimationFrame(frame)
      stageEl.removeEventListener("animationstart", onStart)
      stageEl.removeEventListener("transitionrun", onStart)
    }
  }, [enabled, stageEl, cycle, scan])

  React.useEffect(() => {
    if (enabled) applyState()
  }, [enabled, playing, speed, applyState])

  // Pause the loop clock while offscreen or in a background tab.
  React.useEffect(() => {
    if (!enabled || !stageEl || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1]
      if (entry) setInView(entry.isIntersecting)
    }, { threshold: 0.05 })
    observer.observe(stageEl)
    return () => observer.disconnect()
  }, [enabled, stageEl])

  React.useEffect(() => {
    if (!enabled) return
    const onVisibility = () => setTabVisible(!document.hidden)
    onVisibility()
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [enabled])

  const clockRunning = enabled && !replayOnly && playing && inView && tabVisible && !motionOff

  React.useEffect(() => {
    if (!clockRunning || !meta) return
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const dt = now - last
      last = now
      const period = loopPeriodMs(effectiveMode, meta.durationMs)
      const cap = period === null && !meta.continuous ? meta.durationMs : null
      let next = advanceElapsed(live.current.elapsed, dt, speedApplies ? live.current.speed : 1, cap)
      if (meta.continuous && live.current.span > 0) {
        for (const animation of known.current) {
          if (typeof animation.currentTime === "number") {
            next = animation.currentTime % live.current.span
            break
          }
        }
      }
      if (shouldRestart(next, period)) {
        next = 0
        setCycle((value) => value + 1)
      }
      live.current.elapsed = next
      setElapsedMs(next)
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [clockRunning, meta, effectiveMode, speedApplies])

  const play = React.useCallback(() => setPlaying(true), [])
  const pause = React.useCallback(() => setPlaying(false), [])
  const replay = React.useCallback(() => {
    live.current.elapsed = 0
    setElapsedMs(0)
    setPlaying(true)
    setCycle((value) => value + 1)
  }, [])
  const setMode = React.useCallback((next: PlaybackMode) => {
    setModeState(next)
    writeStoredPlayback({ mode: next })
  }, [])
  const setSpeed = React.useCallback((next: PlaybackSpeed) => {
    setSpeedState(next)
    writeStoredPlayback({ speed: next })
  }, [])
  const selectEngine = React.useCallback((next: string) => {
    setEngineChoice(next)
    writeStoredPlayback({ engine: next })
    live.current.elapsed = 0
    setElapsedMs(0)
    setPlaying(true)
    setCycle((value) => value + 1)
  }, [])
  const scrubTo = React.useCallback(
    (fraction: number) => {
      const span = live.current.span
      if (span <= 0) return
      const time = fractionToTime(fraction, span)
      live.current.playing = false
      setPlaying(false)
      if (stageEl) stageEl.setAttribute("data-playback", "paused")
      for (const animation of known.current) {
        animation.pause()
        pausedByUs.current.add(animation)
        animation.currentTime = time
      }
      live.current.elapsed = time
      setElapsedMs(time)
    },
    [stageEl]
  )

  const fraction = canScrub
    ? timeToFraction(meta?.continuous ? elapsedMs % spanMs : elapsedMs, spanMs)
    : 0

  const value = React.useMemo<PlaybackContextValue>(
    () => ({
      mode: effectiveMode,
      playing,
      speed,
      cycle,
      elapsedMs,
      canScrub,
      play,
      pause,
      replay,
      setMode,
      setSpeed,
      scrubTo,
      enabled,
      meta,
      replayOnly,
      speedApplies,
      autoLoopAllowed,
      reduced,
      motionOff,
      fraction,
      engine,
      engineAware,
      selectEngine,
      stageEl
    }),
    [effectiveMode, playing, speed, cycle, elapsedMs, canScrub, play, pause, replay, setMode, setSpeed, scrubTo, enabled, meta, replayOnly, speedApplies, autoLoopAllowed, reduced, motionOff, fraction, engine, engineAware, selectEngine, stageEl]
  )

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

/** Remounts its children whenever the stage replays or loops, restarting mount-triggered effects. */
export function PlaybackSubtree({ children }: { children: React.ReactNode }) {
  const { cycle, enabled, engine, engineAware } = useStagePlayback()
  const keyed = <React.Fragment key={enabled ? cycle : 0}>{children}</React.Fragment>
  return engineAware ? <MotionEngineProvider engine={engine}>{keyed}</MotionEngineProvider> : keyed
}
