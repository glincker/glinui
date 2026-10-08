"use client"

import * as React from "react"

import type { PanelVariantProp } from "../lib/panel"
import { resolvePanelVariant } from "../lib/panel"
import type { SurfaceVariant } from "../lib/surface"
import { useGlinStyle } from "./glin-provider"

const PanelVariantContext = React.createContext<SurfaceVariant | null>(null)

export const PanelVariantProvider = PanelVariantContext.Provider

/** Variant of the nearest panel, or null outside one. Lets headers, footers and items match their panel. */
export function usePanelVariant(): SurfaceVariant | null {
  return React.useContext(PanelVariantContext)
}

/** Resolves a panel's variant prop against the ambient design style. */
export function useResolvedPanelVariant(variantProp: PanelVariantProp | null | undefined): SurfaceVariant {
  return resolvePanelVariant(variantProp, useGlinStyle())
}
