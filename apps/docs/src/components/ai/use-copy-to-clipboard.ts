"use client"

import * as React from "react"

const RESET_MS = 1800

/** Copy text with the async Clipboard API, falling back to a hidden textarea. */
export async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch (error) {
    console.error("[ai] Clipboard API failed, trying fallback:", error)
  }
  try {
    const area = document.createElement("textarea")
    area.value = text
    area.setAttribute("readonly", "")
    area.className = "fixed -left-[9999px] top-0 opacity-0"
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand("copy")
    document.body.removeChild(area)
    return ok
  } catch (error) {
    console.error("[ai] Clipboard fallback failed:", error)
    return false
  }
}

export type UseCopyToClipboard = {
  copied: boolean
  copy: (text: string) => Promise<boolean>
}

/** `copied` flips true for a moment after a successful copy. */
export function useCopyToClipboard(): UseCopyToClipboard {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const copy = React.useCallback(async (text: string) => {
    const ok = await writeClipboard(text)
    if (ok) {
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), RESET_MS)
    }
    return ok
  }, [])

  return { copied, copy }
}
