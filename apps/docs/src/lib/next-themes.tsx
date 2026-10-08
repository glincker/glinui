"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
  systemTheme: "light" | "dark"
}

type ThemeProviderProps = {
  children: React.ReactNode
  attribute?: "class"
  defaultTheme?: Theme
  enableSystem?: boolean
  storageKey?: string
  disableTransitionOnChange?: boolean
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const QUERY = "(prefers-color-scheme: dark)"

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  storageKey = "glinui-docs-theme"
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [systemTheme, setSystemTheme] = React.useState<"light" | "dark">("light")
  // Delay class mutations until we've read the real state from localStorage.
  // The blocking <script> in layout.tsx already applied the correct class before
  // first paint, so we must NOT toggle it until React state is hydrated.
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY)
    const updateSystemTheme = () => {
      setSystemTheme(mediaQuery.matches ? "dark" : "light")
    }

    updateSystemTheme()

    const stored = window.localStorage.getItem(storageKey)
    if (stored === "light" || stored === "dark" || stored === "system") {
      setThemeState(stored)
    } else {
      setThemeState(defaultTheme)
    }

    // Mark as ready, React batches these state updates, so the class
    // toggle effect below will only fire once with the correct values.
    setMounted(true)

    mediaQuery.addEventListener("change", updateSystemTheme)
    return () => mediaQuery.removeEventListener("change", updateSystemTheme)
  }, [defaultTheme, storageKey])

  const resolvedTheme: "light" | "dark" =
    theme === "system" ? (enableSystem ? systemTheme : "light") : theme

  // Sync the class attribute with resolved theme, only after mounted to
  // avoid overwriting the blocking script's initial class application.
  React.useEffect(() => {
    if (!mounted) return

    if (attribute === "class") {
      document.documentElement.classList.toggle("dark", resolvedTheme === "dark")
      document.documentElement.style.colorScheme = resolvedTheme
    }
  }, [attribute, mounted, resolvedTheme])

  const setTheme = React.useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, nextTheme)
      }
    },
    [storageKey]
  )

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme
    }),
    [resolvedTheme, setTheme, systemTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
