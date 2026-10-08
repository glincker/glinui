/**
 * Playback metadata for the docs stage controls (loop, pause, replay, speed, scrub).
 * Durations were read from packages/ui/src/components (duration constants and engine
 * defaults) and hand-tuned. Read-only against the library: nothing here changes a component.
 */

export type PlaybackScrub = "waapi" | "none"

export interface PlaybackMeta {
  /** Plays once on mount or when scrolled into view, so it benefits from looping. */
  oneShot: boolean
  /** Length of one play in milliseconds (one cycle for continuous effects). */
  durationMs: number
  /** Whether the stage may restart this effect on a timer. False for self-looping effects. */
  loopable: boolean
  /** `waapi` when CSS or Web Animations can be scrubbed, `none` for script-driven effects. */
  scrub: PlaybackScrub
  /** Runs forever on its own: the bar offers pause (and scrub) but no loop control. */
  continuous?: boolean
  /** Consumes the motion engine abstraction for its main animation (css, motion, gsap). */
  engineAware: boolean
  /** Why the effect does not use the engine abstraction (shown in docs notes). */
  engineNote?: string
}

const oneShot = (durationMs: number, scrub: PlaybackScrub = "waapi"): PlaybackMeta => ({
  oneShot: true,
  durationMs,
  loopable: true,
  scrub,
  engineAware: false
})

const engineAware = (meta: PlaybackMeta): PlaybackMeta => ({ ...meta, engineAware: true })

const cssOnly = (meta: PlaybackMeta, engineNote: string): PlaybackMeta => ({ ...meta, engineAware: false, engineNote })

const continuous = (durationMs: number, scrub: PlaybackScrub = "waapi"): PlaybackMeta => ({
  oneShot: false,
  durationMs,
  loopable: false,
  scrub,
  continuous: true,
  engineAware: false
})

/** Animated by tag but only on hover, focus or click: no stage bar. */
const interactive: PlaybackMeta = { oneShot: false, durationMs: 0, loopable: false, scrub: "none", engineAware: false }

export const playbackMeta: Readonly<Record<string, PlaybackMeta>> = {
  // One-shot text and motion engines
  typewriter: engineAware(oneShot(2800, "none")),
  "number-ticker": engineAware(oneShot(1500, "none")),
  "count-up": engineAware(oneShot(1500, "none")),
  reveal: engineAware(oneShot(800)),
  "reveal-text": engineAware(oneShot(800)),
  "blur-fade": engineAware(oneShot(700)),
  "hyper-text": engineAware(oneShot(800, "none")),
  "text-reveal": engineAware(oneShot(1200)),
  "split-text": engineAware(oneShot(1200)),
  "stagger-list": engineAware(oneShot(1400)),
  terminal: engineAware(oneShot(6000, "none")),
  "bento-grid": engineAware(oneShot(900)),
  "streaming-text": oneShot(3000, "none"),
  // Self-looping or continuous effects
  "word-rotate": engineAware(continuous(2500, "none")),
  "morphing-text": cssOnly(continuous(3000, "none"), "Continuous glyph cross-fade driven by a css filter loop; an engine adds nothing."),
  "sparkles-text": cssOnly(continuous(900), "Continuous particle twinkle in css keyframes; no entrance to hand to an engine."),
  "shine-border": cssOnly(continuous(14000), "Looping css conic-gradient animation; not a reveal, so engines do not apply."),
  "border-beam": cssOnly(continuous(6000), "Looping offset-path beam in css; path driven, engines do not apply."),
  "animated-beam": cssOnly(continuous(4000), "SVG path gradient measured from layout; path driven, engines do not apply."),
  "meteor-shower": cssOnly(continuous(4000), "Many independent css keyframe loops; engine swap adds no value."),
  marquee: cssOnly(continuous(30000), "Infinite css translate loop that must stay compositor-only."),
  "flickering-grid": continuous(2000, "none"),
  "generate-button": continuous(2000),
  "animated-gradient": continuous(8000),
  "aurora-background": continuous(12000),
  "chromatic-text": continuous(6000),
  "gradient-text": continuous(6000),
  "gradient-mesh": continuous(12000),
  "light-leak": continuous(12000),
  "light-rays": continuous(8000),
  "glow-border": continuous(6000),
  "prism-border": continuous(8000),
  "neon-gradient-card": continuous(6000),
  "orbiting-circles": cssOnly(continuous(20000), "Endless css orbit rotation; continuous, not an entrance, so engines do not apply."),
  "particle-field": continuous(12000),
  "retro-grid": continuous(15000),
  ripple: continuous(3400),
  "shimmer-button": continuous(2000),
  "pulsating-button": continuous(2000),
  skeleton: continuous(1500),
  spinner: continuous(1000),
  thinking: continuous(1500),
  // Animated by tag, but driven by hover, focus, scroll or pointer rather than a timeline
  progress: interactive,
  "message-scroller": interactive,
  "magic-card": interactive,
  "interactive-hover-button": interactive,
  "blur-spotlight": interactive,
  "depth-card": interactive,
  "dot-pattern": interactive,
  "floating-panel": interactive,
  "glass-breadcrumb": interactive,
  "glass-card": interactive,
  "glass-dock": interactive,
  "glass-navbar": interactive,
  "glass-toggle": interactive,
  "liquid-button": interactive,
  "magnetic-cta": interactive,
  "morphing-tabs": interactive,
  "ripple-button": interactive,
  spotlight: interactive,
  "spotlight-card": interactive
}

export function getPlaybackMeta(id: string | undefined): PlaybackMeta | null {
  if (!id) return null
  return playbackMeta[id] ?? null
}

/** True when the stage should render playback controls for this component. */
export function hasPlaybackControls(meta: PlaybackMeta | null): meta is PlaybackMeta {
  return meta !== null && (meta.oneShot || meta.continuous === true)
}
