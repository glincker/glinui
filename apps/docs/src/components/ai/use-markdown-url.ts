"use client"

import * as React from "react"

import { buildMarkdownUrl } from "@/lib/ai-prompt"
import { SITE_URL } from "@/lib/seo"

/**
 * Public markdown URL for a component. In dev the origin is swapped for
 * window.location.origin after mount so deep links resolve against the local server.
 */
export function useMarkdownUrl(id: string): { markdownUrl: string; localize: (text: string) => string } {
  const [origin, setOrigin] = React.useState(SITE_URL)
  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") setOrigin(window.location.origin)
  }, [])
  const localize = React.useCallback(
    (text: string) => (origin === SITE_URL ? text : text.split(SITE_URL).join(origin)),
    [origin]
  )
  return { markdownUrl: buildMarkdownUrl(id, origin), localize }
}
