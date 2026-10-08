"use client"

import * as React from "react"
import { IconContext } from "@phosphor-icons/react"

import {
  DEFAULT_GLIN_CONFIG,
  CONFIG_KEYS,
  applySurfaceAlias,
  GLIN_ATTRIBUTES,
  getPhosphorDefaults,
  sanitizeGlinConfig,
  type GlinConfig,
  type GlinStyle,
  type GlinMotion,
  type GlinTarget
} from "../lib/glin-config"
import { MotionEngineContext, type MotionEngineConfig } from "./motion-engine"

export type GlinContextValue = {
  config: GlinConfig
  /** Motion with "system" resolved against prefers-reduced-motion. */
  resolvedMotion: Exclude<GlinMotion, "system">
  setConfig: (patch: Partial<GlinConfig>) => void
  reset: () => void
}

const noop = () => {}

const GlinContext = React.createContext<GlinContextValue>({
  config: DEFAULT_GLIN_CONFIG,
  resolvedMotion: "full",
  setConfig: noop,
  reset: noop
})

export function useGlinConfig(): GlinContextValue {
  return React.useContext(GlinContext)
}

/** Ambient default surface variant for components: "default" (solid) or "glass". */
export function useGlinSurface(): "default" | "glass" {
  const { config } = React.useContext(GlinContext)
  return config.surface === "glass" || config.style === "glass" ? "glass" : "default"
}

/**
 * Ambient design style. Safe outside a provider and during SSR: the context default
 * is "glinr", so server and first client render agree.
 */
export function useGlinStyle(): GlinStyle {
  return React.useContext(GlinContext).config.style
}

export type GlinProviderProps = {
  children?: React.ReactNode
  /** Initial values. Anything missing falls back to DEFAULT_GLIN_CONFIG. */
  defaults?: Partial<GlinConfig>
  /** localStorage key. When set, the config is persisted and restored after mount. */
  storageKey?: string
  /** Where data attributes are written. "document" lets portals inherit. */
  target?: GlinTarget
  onConfigChange?: (config: GlinConfig) => void
  className?: string
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)"

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false)
  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return
    const mql = window.matchMedia(REDUCED_QUERY)
    setReduced(mql.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [])
  return reduced
}

function readStored(storageKey: string): Partial<GlinConfig> {
  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? sanitizeGlinConfig(JSON.parse(raw)) : {}
  } catch {
    return {}
  }
}

export function GlinProvider({
  children,
  defaults,
  storageKey,
  target = "self",
  onConfigChange,
  className
}: GlinProviderProps) {
  const base = React.useMemo<GlinConfig>(
    () => ({ ...DEFAULT_GLIN_CONFIG, ...applySurfaceAlias(sanitizeGlinConfig(defaults)) }),
    [defaults]
  )
  const [config, setConfigState] = React.useState<GlinConfig>(base)
  const [hydrated, setHydrated] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  // Restore after mount so server and first client render agree.
  React.useEffect(() => {
    if (storageKey) {
      const stored = readStored(storageKey)
      if (Object.keys(stored).length > 0) setConfigState({ ...base, ...applySurfaceAlias(stored) })
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  // Apply attributes. Skipped until hydrated so a pre-paint script's values are never clobbered.
  React.useEffect(() => {
    if (!hydrated) return
    const el = target === "document" ? document.documentElement : wrapperRef.current
    if (!el) return
    for (const key of CONFIG_KEYS) el.setAttribute(GLIN_ATTRIBUTES[key], config[key])
    if (target === "document") {
      return () => {
        for (const key of CONFIG_KEYS) el.removeAttribute(GLIN_ATTRIBUTES[key])
      }
    }
    return undefined
  }, [config, hydrated, target])

  // Persist only after hydration so defaults never overwrite a stored choice.
  React.useEffect(() => {
    if (!hydrated) return
    onConfigChange?.(config)
    if (!storageKey) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(config))
    } catch {
      /* storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, hydrated, storageKey])

  const setConfig = React.useCallback((patch: Partial<GlinConfig>) => {
    setConfigState((prev) => ({ ...prev, ...applySurfaceAlias(sanitizeGlinConfig(patch)) }))
  }, [])
  const reset = React.useCallback(() => setConfigState(base), [base])

  const resolvedMotion: GlinContextValue["resolvedMotion"] =
    config.motion === "system" ? (reduced ? "none" : "full") : config.motion

  const value = React.useMemo<GlinContextValue>(
    () => ({ config, resolvedMotion, setConfig, reset }),
    [config, resolvedMotion, setConfig, reset]
  )
  const engineValue = React.useMemo<Partial<MotionEngineConfig>>(
    () => ({ engine: config.engine, level: config.motion }),
    [config.engine, config.motion]
  )
  const iconValue = React.useMemo(() => getPhosphorDefaults(config), [config])

  const content = (
    <GlinContext.Provider value={value}>
      <MotionEngineContext.Provider value={engineValue}>
        <IconContext.Provider value={iconValue}>{children}</IconContext.Provider>
      </MotionEngineContext.Provider>
    </GlinContext.Provider>
  )

  if (target === "document") return content

  return (
    <div ref={wrapperRef} className={className ? `contents ${className}` : "contents"} {...initialAttributes(config)}>
      {content}
    </div>
  )
}

function initialAttributes(config: GlinConfig): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const key of CONFIG_KEYS) attrs[GLIN_ATTRIBUTES[key]] = config[key]
  return attrs
}
