/** Pure playback helpers (loop period, scrub math, readout). No DOM, no React. */

export type PlaybackMode = "once" | "loop-3" | "loop-4" | "loop-6"
export type PlaybackSpeed = 0.5 | 1 | 2

export const PLAYBACK_MODES: readonly PlaybackMode[] = ["once", "loop-3", "loop-4", "loop-6"]
export const PLAYBACK_SPEEDS: readonly PlaybackSpeed[] = [0.5, 1, 2]

/** Pause between the end of an animation and the next restart. */
export const LOOP_HOLD_MS = 1200

export function isPlaybackMode(value: unknown): value is PlaybackMode {
  return typeof value === "string" && (PLAYBACK_MODES as readonly string[]).includes(value)
}

export function isPlaybackSpeed(value: unknown): value is PlaybackSpeed {
  return typeof value === "number" && (PLAYBACK_SPEEDS as readonly number[]).includes(value)
}

/** Seconds a loop mode asks for, or 0 for `once`. */
export function modeSeconds(mode: PlaybackMode): number {
  if (mode === "loop-3") return 3
  if (mode === "loop-4") return 4
  if (mode === "loop-6") return 6
  return 0
}

/**
 * Loop period in animation time (milliseconds), or null for `once`.
 * Never shorter than the animation plus a hold, so a restart cannot cut an effect off.
 */
export function loopPeriodMs(mode: PlaybackMode, durationMs: number, holdMs: number = LOOP_HOLD_MS): number | null {
  const base = modeSeconds(mode) * 1000
  if (base === 0) return null
  return Math.max(base, Math.max(0, durationMs) + holdMs)
}

/** Wall-clock period when the animations run at `speed`. */
export function wallPeriodMs(periodMs: number, speed: number): number {
  return periodMs / (speed > 0 ? speed : 1)
}

export function clampFraction(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(1, Math.max(0, value))
}

/** Scrub fraction (0 to 1) to an animation currentTime in milliseconds. */
export function fractionToTime(fraction: number, spanMs: number): number {
  return clampFraction(fraction) * Math.max(0, spanMs)
}

export function timeToFraction(timeMs: number, spanMs: number): number {
  if (spanMs <= 0) return 0
  return clampFraction(timeMs / spanMs)
}

/** Largest scrubbable span among animation timings; infinite animations contribute one iteration. */
export function scrubSpanMs(timings: ReadonlyArray<{ endTime: number; duration: number }>): number {
  let span = 0
  for (const timing of timings) {
    const value = Number.isFinite(timing.endTime) ? timing.endTime : timing.duration
    if (Number.isFinite(value) && value > span) span = value
  }
  return span
}

/** Advance the playback clock. Once-mode clocks stop at the animation end. */
export function advanceElapsed(
  elapsedMs: number,
  dtMs: number,
  speed: number,
  capMs: number | null
): number {
  const next = elapsedMs + Math.max(0, dtMs) * speed
  return capMs === null ? next : Math.min(next, capMs)
}

/** True when a loop restart is due. */
export function shouldRestart(elapsedMs: number, periodMs: number | null): boolean {
  return periodMs !== null && elapsedMs >= periodMs
}

export function formatReadout(cycle: number, elapsedMs: number): string {
  return `cycle ${cycle} · ${(Math.max(0, elapsedMs) / 1000).toFixed(1)}s`
}
