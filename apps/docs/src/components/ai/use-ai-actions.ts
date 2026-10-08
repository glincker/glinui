"use client"

import * as React from "react"

import { buildShortAiPrompt } from "@/lib/ai-prompt"
import { aiTargetHint, resolveAiAction, type AiTarget } from "@/lib/ai-targets"
import { useCopyToClipboard, writeClipboard } from "./use-copy-to-clipboard"

export type AiActionsInput = {
  componentId: string
  title: string
  markdownUrl: string
  getFullPrompt: () => string
  getMarkdown?: () => string
}

const MESSAGE_MS = 4500

function openTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer")
}

/** Shared behavior for AiCopyMenu and AiCopyButton. */
export function useAiActions({ title, componentId, markdownUrl, getFullPrompt, getMarkdown }: AiActionsInput) {
  const { copied, copy } = useCopyToClipboard()
  const [message, setMessage] = React.useState("")
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const announce = React.useCallback((text: string) => {
    setMessage(text)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(""), MESSAGE_MS)
  }, [])

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    []
  )

  const copyPrompt = React.useCallback(async () => {
    const ok = await copy(getFullPrompt())
    announce(ok ? `Prompt for ${title} copied` : "Copy failed. Use View prompt and copy it by hand.")
    return ok
  }, [announce, copy, getFullPrompt, title])

  const copyMarkdown = React.useCallback(async () => {
    let text = getMarkdown ? getMarkdown() : ""
    if (!text) {
      try {
        const res = await fetch(new URL(markdownUrl, window.location.href).pathname)
        if (res.ok) text = await res.text()
      } catch (error) {
        console.error("[ai] Markdown fetch failed:", error)
      }
    }
    const ok = await copy(text || markdownUrl)
    announce(ok ? `Markdown for ${title} copied` : "Copy failed")
  }, [announce, copy, getMarkdown, markdownUrl, title])

  const viewMarkdown = React.useCallback(() => openTab(markdownUrl), [markdownUrl])

  const openTarget = React.useCallback(
    (target: AiTarget) => {
      const short = buildShortAiPrompt({ title, id: componentId, markdownUrl })
      const action = resolveAiAction(target, short)
      // Start the copy and open the tab in the same gesture so popup blockers stay quiet.
      const copying = action.copy ? writeClipboard(getFullPrompt()) : Promise.resolve(true)
      if (action.url) openTab(action.url)
      void copying.then((ok) => {
        if (action.kind === "prefill") {
          announce(`Opened ${target.label} with a short prompt${ok && action.copy ? ". Full prompt also copied" : ""}`)
        } else if (ok) {
          announce(`Prompt copied: paste it into ${target.label}`)
        } else {
          announce("Copy failed. Use View prompt and copy it by hand.")
        }
      })
    },
    [announce, componentId, getFullPrompt, markdownUrl, title]
  )

  return { copied, message, copyPrompt, copyMarkdown, viewMarkdown, openTarget, hint: aiTargetHint }
}
