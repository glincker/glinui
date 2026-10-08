"use client"

import * as React from "react"

type HeroRegistration = {
  code: string
}

type ComponentDocContextValue = {
  heroCode: string | null
  registerHero: (registration: HeroRegistration | null) => void
}

export const ComponentDocContext = React.createContext<ComponentDocContextValue | null>(null)

export function useComponentDocContext() {
  return React.useContext(ComponentDocContext)
}

export function useComponentDocState() {
  const [heroCode, setHeroCode] = React.useState<string | null>(null)
  const registerHero = React.useCallback((registration: HeroRegistration | null) => {
    setHeroCode(registration ? registration.code : null)
  }, [])
  return React.useMemo(() => ({ heroCode, registerHero }), [heroCode, registerHero])
}
