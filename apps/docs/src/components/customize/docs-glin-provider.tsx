"use client"

import type { ReactNode } from "react"

import { GlinProvider } from "@glinui/ui"

// Register the opt-in motion and gsap engines site-wide. Each library is only fetched when selected.
import "@/components/engines/register-engines"

export const DOCS_OPTIONS_KEY = "glin-docs-options"

/** Mounts GlinProvider on the document element and persists to localStorage. */
export function DocsGlinProvider({ children }: { children: ReactNode }) {
  return (
    <GlinProvider target="document" storageKey={DOCS_OPTIONS_KEY}>
      {children}
    </GlinProvider>
  )
}
