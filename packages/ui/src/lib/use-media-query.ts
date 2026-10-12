import * as React from "react"

/** Subscribes to a media query. Returns `fallback` on the server and when matchMedia is unavailable. */
export function useMediaQuery(query: string, fallback = true): boolean {
  const subscribe = React.useCallback(
    (notify: () => void) => {
      if (typeof window === "undefined" || typeof window.matchMedia !== "function") return () => {}
      const list = window.matchMedia(query)
      list.addEventListener("change", notify)
      return () => list.removeEventListener("change", notify)
    },
    [query]
  )
  const getSnapshot = () =>
    typeof window !== "undefined" && typeof window.matchMedia === "function" ? window.matchMedia(query).matches : fallback
  return React.useSyncExternalStore(subscribe, getSnapshot, () => fallback)
}
