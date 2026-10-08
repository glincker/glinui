import { isPlaybackMode, isPlaybackSpeed, type PlaybackMode, type PlaybackSpeed } from "./playback-math"

export const PLAYBACK_STORAGE_KEY = "glin-docs-playback"

export interface StoredPlayback {
  mode?: PlaybackMode
  speed?: PlaybackSpeed
  engine?: string
}

export function readStoredPlayback(): StoredPlayback {
  try {
    const raw = window.localStorage.getItem(PLAYBACK_STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== "object" || parsed === null) return {}
    const record = parsed as Record<string, unknown>
    return {
      mode: isPlaybackMode(record.mode) ? record.mode : undefined,
      speed: isPlaybackSpeed(record.speed) ? record.speed : undefined,
      engine: typeof record.engine === "string" && /^[a-z0-9-]{1,24}$/.test(record.engine) ? record.engine : undefined
    }
  } catch {
    return {}
  }
}

export function writeStoredPlayback(patch: StoredPlayback): void {
  try {
    const next = { ...readStoredPlayback(), ...patch }
    window.localStorage.setItem(PLAYBACK_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* storage blocked: playback preferences stay per page view */
  }
}
