/** Minimal storage contract. `window.localStorage` satisfies it. */
export interface BannerStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export const BANNER_STORAGE_KEY = "glinui.banners.dismissed.v1"

export function parseDismissed(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []
  } catch {
    return []
  }
}

export function withDismissed(current: readonly string[], id: string): string[] {
  return current.includes(id) ? [...current] : [...current, id]
}

/** Default adapter: localStorage, or null when the browser blocks it or there is no window. */
export function defaultBannerStorage(): BannerStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage
  } catch {
    return null
  }
}

export function isBannerDismissed(
  id: string,
  storage: BannerStorage | null = defaultBannerStorage(),
  key: string = BANNER_STORAGE_KEY
): boolean {
  try {
    return parseDismissed(storage?.getItem(key) ?? null).includes(id)
  } catch {
    return false
  }
}

export function dismissBanner(
  id: string,
  storage: BannerStorage | null = defaultBannerStorage(),
  key: string = BANNER_STORAGE_KEY
): void {
  try {
    if (!storage) return
    storage.setItem(key, JSON.stringify(withDismissed(parseDismissed(storage.getItem(key)), id)))
  } catch {
    // Storage blocked: the banner stays hidden for this view only.
  }
}
