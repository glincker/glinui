"use client"

import * as React from "react"
import {
  resolveEngine,
  resolveEngineSync,
  resolveMotionLevel,
  type EngineCleanup,
  type EngineCountOptions,
  type EngineName,
  type MotionEngine,
  type MotionLevel,
  type ResolvedMotionLevel
} from "@glinui/motion"

export type MotionEngineConfig = {
  /** Engine name: `css` (default), `motion`, `gsap` or any registered custom engine. */
  engine: EngineName
  /** `full`, `subtle` (opacity only), `none` (static) or `system` (follow prefers-reduced-motion). */
  level: MotionLevel
}

export const DEFAULT_MOTION_ENGINE_CONFIG: MotionEngineConfig = { engine: "css", level: "full" }

/**
 * Ambient engine config. `GlinProvider` will feed this context with its `motion` setting
 * and an engine name. Until then, `MotionEngineProvider` can be used directly, and the
 * hook falls back to `data-glin-motion` / `data-glin-engine` on `<html>`.
 */
export const MotionEngineContext = React.createContext<Partial<MotionEngineConfig> | null>(null)

export type MotionEngineProviderProps = {
  engine?: EngineName
  /** Motion level. Named `motion` to match GlinProvider and the `motion` prop on components. */
  motion?: MotionLevel
  children?: React.ReactNode
}

export function MotionEngineProvider({ engine, motion, children }: MotionEngineProviderProps) {
  const parent = React.useContext(MotionEngineContext)
  const value = React.useMemo<Partial<MotionEngineConfig>>(
    () => ({ engine: engine ?? parent?.engine, level: motion ?? parent?.level }),
    [engine, motion, parent?.engine, parent?.level]
  )
  return <MotionEngineContext.Provider value={value}>{children}</MotionEngineContext.Provider>
}

const LEVEL_ALIASES: Record<string, MotionLevel> = {
  full: "full",
  on: "full",
  true: "full",
  subtle: "subtle",
  reduced: "subtle",
  none: "none",
  off: "none",
  false: "none",
  system: "system",
  auto: "system"
}

/** Read `data-glin-motion` / `data-glin-engine` from the document element. */
export function readDocumentMotionConfig(): Partial<MotionEngineConfig> {
  if (typeof document === "undefined") return {}
  const root = document.documentElement
  const rawLevel = root.getAttribute("data-glin-motion")
  const rawEngine = root.getAttribute("data-glin-engine")
  const level = rawLevel ? LEVEL_ALIASES[rawLevel.toLowerCase()] : undefined
  return { level, engine: rawEngine ? rawEngine : undefined }
}

function subscribeDocument(onChange: () => void): () => void {
  if (typeof MutationObserver === "undefined" || typeof document === "undefined") return () => undefined
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-glin-motion", "data-glin-engine"]
  })
  return () => observer.disconnect()
}

function documentSnapshot(): string {
  const { engine, level } = readDocumentMotionConfig()
  return `${engine ?? ""}|${level ?? ""}`
}

function subscribeReducedMotion(onChange: () => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => undefined
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener?.("change", onChange)
  return () => mq.removeEventListener?.("change", onChange)
}

function reducedMotionSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export type UseMotionEngineOptions = {
  /** Element kept invisible while a lazy engine is still loading, to avoid a flash of final content. */
  hideRef?: React.RefObject<HTMLElement | null>
  /** Per-component override of the engine name. */
  engine?: EngineName
  /** Per-component override of the motion level (`none` renders static). */
  motion?: MotionLevel
}

export type UseMotionEngineResult = {
  engine: EngineName
  level: MotionLevel
  /** Level after applying prefers-reduced-motion. */
  effectiveLevel: ResolvedMotionLevel
  reducedMotion: boolean
  /** The resolved engine instance, or null while a lazy engine is loading. */
  instance: MotionEngine | null
}

/**
 * Resolve the engine for a component. Precedence: props, MotionEngineContext
 * (GlinProvider), document attributes, then `css` + `full`.
 */
export function useMotionEngine(overrides: UseMotionEngineOptions = {}): UseMotionEngineResult {
  const ctx = React.useContext(MotionEngineContext)
  const docKey = React.useSyncExternalStore(subscribeDocument, documentSnapshot, () => "|")
  const reducedMotion = React.useSyncExternalStore(subscribeReducedMotion, reducedMotionSnapshot, () => false)

  const [docEngine, docLevel] = docKey.split("|")
  const engine: EngineName =
    overrides.engine ?? ctx?.engine ?? (docEngine || DEFAULT_MOTION_ENGINE_CONFIG.engine)
  const level: MotionLevel =
    overrides.motion ?? ctx?.level ?? ((docLevel as MotionLevel) || DEFAULT_MOTION_ENGINE_CONFIG.level)
  const effectiveLevel = resolveMotionLevel(level, reducedMotion)

  const sync = resolveEngineSync(engine, { level, reducedMotion })
  const [loaded, setLoaded] = React.useState<{ key: string; engine: MotionEngine } | null>(null)
  const key = `${engine}|${effectiveLevel}`

  React.useEffect(() => {
    if (sync) return
    let cancelled = false
    void resolveEngine(engine, { level, reducedMotion }).then((resolved) => {
      if (!cancelled) setLoaded({ key, engine: resolved })
    })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- key captures engine, level and reducedMotion
  }, [key, sync])

  const instance = sync ?? (loaded && loaded.key === key ? loaded.engine : null)
  return { engine, level, effectiveLevel, reducedMotion, instance }
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

/**
 * Run an engine call for the lifetime of a mounted element. Re-runs when the
 * engine, level or `deps` change. The cleanup is always called (Strict Mode safe).
 */
export function useEngineRun(
  options: UseMotionEngineOptions,
  run: (engine: MotionEngine) => EngineCleanup | void,
  deps: React.DependencyList
): UseMotionEngineResult {
  const state = useMotionEngine(options)
  const { instance } = state
  const runRef = React.useRef(run)
  runRef.current = run
  const hideRef = options.hideRef

  useIsomorphicLayoutEffect(() => {
    const el = hideRef?.current
    if (!el || instance) return
    el.style.opacity = "0"
    return () => {
      el.style.removeProperty("opacity")
    }
  }, [instance, hideRef])

  useIsomorphicLayoutEffect(() => {
    if (!instance) return
    const cleanup = runRef.current(instance)
    return () => {
      if (cleanup) cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are supplied by the caller
  }, [instance, ...deps])

  return state
}

/** Merge several refs into one callback ref. */
export function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node)
      else if (ref) (ref as React.MutableRefObject<T | null>).current = node
    }
  }
}

export type DriveProgressOptions = Omit<EngineCountOptions, "format" | "from" | "decimals" | "locale">

/**
 * Drive any 0 to 1 progress through the engine's `countTo`, so the engine owns timing,
 * easing, in-view triggering and cleanup for effects that are not a plain reveal (clip paths,
 * scrambles, typing). `target` must be an empty element: the engine writes its (empty)
 * formatted value into it every frame, and it is also the in-view trigger. Level `none`
 * and `subtle` settle on progress 1 immediately.
 */
export function driveProgress(
  engine: MotionEngine,
  target: HTMLElement,
  onProgress: (progress: number) => void,
  options: DriveProgressOptions = {}
): EngineCleanup {
  return engine.countTo(target, 0, 1, {
    easing: "linear",
    ...options,
    format: (value) => {
      onProgress(value)
      return ""
    }
  })
}
