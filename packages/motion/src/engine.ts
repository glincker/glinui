import { cssEngine } from "./engines/css"
import { staticEngine } from "./engines/static"
import { createEngine } from "./engines/factory"
import type {
  EngineCountOptions,
  EngineFactory,
  EngineName,
  EngineRevealOptions,
  EngineSplitOptions,
  EngineStaggerOptions,
  MotionEngine,
  MotionLevel,
  ResolvedMotionLevel
} from "./engine-types"

export * from "./engine-types"
export { createEngine, staticEngine, cssEngine }
export { cubicBezier, springEase, resolveTiming, resolveFromFrame } from "./engines/shared"

type Entry = { engine?: MotionEngine; factory?: EngineFactory; pending?: Promise<MotionEngine> }

const registry = new Map<string, Entry>()

/**
 * Register an engine by name. Pass a ready engine or a factory (sync or async).
 * Use a factory with a dynamic `import()` so the library is only fetched when selected.
 * Registering an existing name replaces it.
 */
export function registerEngine(name: EngineName, engineOrFactory: MotionEngine | EngineFactory): void {
  registry.set(name, typeof engineOrFactory === "function" ? { factory: engineOrFactory } : { engine: engineOrFactory })
}

export function unregisterEngine(name: EngineName): boolean {
  return registry.delete(name)
}

export function hasEngine(name: EngineName): boolean {
  return registry.has(name)
}

export function listEngines(): string[] {
  return Array.from(registry.keys())
}

/** Synchronous lookup. Returns undefined when the engine is unknown or its factory has not resolved yet. */
export function getEngine(name: EngineName): MotionEngine | undefined {
  return registry.get(name)?.engine
}

/** Resolve (and cache) an engine, running its async factory on first use. */
export function loadEngine(name: EngineName): Promise<MotionEngine> {
  const entry = registry.get(name)
  if (!entry) return Promise.reject(new Error(`[glinui/motion] Unknown engine "${name}". Register it with registerEngine().`))
  if (entry.engine) return Promise.resolve(entry.engine)
  if (!entry.pending) {
    const factory = entry.factory as EngineFactory
    entry.pending = Promise.resolve()
      .then(factory)
      .then((engine) => {
        entry.engine = engine
        return engine
      })
      .catch((error: unknown) => {
        entry.pending = undefined
        throw error
      })
  }
  return entry.pending
}

registerEngine("css", cssEngine)
// Only the css engine is built in (plus the static engine used for level "none").
// Optional library engines are opt-in via "@glinui/motion/register/<name>".

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Collapse a user level and the OS preference into the level that is actually applied. */
export function resolveMotionLevel(level: MotionLevel = "full", reducedMotion?: boolean): ResolvedMotionLevel {
  if (level === "none") return "none"
  const reduced = reducedMotion ?? prefersReducedMotion()
  if (reduced) return "subtle"
  return level === "subtle" ? "subtle" : "full"
}

const OPACITY_ONLY: Pick<EngineRevealOptions, "distance" | "blur" | "scale" | "direction"> = {
  distance: 0,
  blur: 0,
  scale: 1,
  direction: "none"
}

const levelCache = new WeakMap<MotionEngine, MotionEngine>()

/** Wrap an engine so that every reveal is opacity-only and counters jump to their end value. */
export function withSubtleLevel(engine: MotionEngine): MotionEngine {
  const cached = levelCache.get(engine)
  if (cached) return cached
  const wrapped: MotionEngine = {
    ...engine,
    reveal: (el, opts) => engine.reveal(el, { ...opts, ...OPACITY_ONLY }),
    stagger: (els, opts: EngineStaggerOptions = {}) => engine.stagger(els, { ...opts, ...OPACITY_ONLY }),
    countTo: (el, from, to, opts?: EngineCountOptions) => staticEngine.countTo(el, from, to, opts),
    splitText: engine.splitText
      ? (el, opts: EngineSplitOptions = {}) => (engine.splitText as NonNullable<MotionEngine["splitText"]>)(el, { ...opts, ...OPACITY_ONLY })
      : undefined
  }
  levelCache.set(engine, wrapped)
  return wrapped
}

const warnedMissing = new Set<string>()

function warnUnregistered(name: string): void {
  try {
    if (process.env.NODE_ENV === "production") return
  } catch {
    // No process global and no bundler replacement: treat as development.
  }
  if (warnedMissing.has(name)) return
  warnedMissing.add(name)
  console.warn(
    `[glinui/motion] Engine "${name}" is not registered, using css. Add import '@glinui/motion/register/${name}' once at your app entry (or call registerEngine("${name}", ...) for a custom engine).`
  )
}

export type ResolveEngineOptions = { level?: MotionLevel; reducedMotion?: boolean }

function applyLevel(engine: MotionEngine, level: ResolvedMotionLevel): MotionEngine {
  if (level === "none") return staticEngine
  if (level === "subtle") return withSubtleLevel(engine)
  return engine
}

/**
 * Resolve the engine to use for a preference and motion level.
 * Level `none` never loads a library. A failing or unknown engine falls back to `css`.
 */
export async function resolveEngine(
  preference: EngineName = "css",
  options: ResolveEngineOptions = {}
): Promise<MotionEngine> {
  const level = resolveMotionLevel(options.level, options.reducedMotion)
  if (level === "none") return staticEngine
  if (preference !== "css" && !registry.has(preference)) {
    warnUnregistered(preference)
    return applyLevel(cssEngine, level)
  }
  try {
    return applyLevel(await loadEngine(preference), level)
  } catch (error) {
    if (preference !== "css") {
      if (typeof console !== "undefined") console.warn(`[glinui/motion] Engine "${preference}" unavailable, using css.`, error)
      return applyLevel(cssEngine, level)
    }
    throw error
  }
}

/** Synchronous variant. Returns undefined when the engine has not been loaded yet. */
export function resolveEngineSync(
  preference: EngineName = "css",
  options: ResolveEngineOptions = {}
): MotionEngine | undefined {
  const level = resolveMotionLevel(options.level, options.reducedMotion)
  if (level === "none") return staticEngine
  const engine = getEngine(preference)
  return engine ? applyLevel(engine, level) : undefined
}
