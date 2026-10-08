"use client"

import { Check, LinkSimple } from "@phosphor-icons/react"
import * as React from "react"

/** Copies the canonical post URL. No third-party share scripts. */
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = React.useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="inline-flex min-h-11 items-center gap-2 rounded-input border border-line-soft bg-surface-1 px-4 text-sm font-medium text-foreground hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
    >
      {copied ? <Check className="size-4" aria-hidden="true" /> : <LinkSimple className="size-4" aria-hidden="true" />}
      <span>{copied ? "Link copied" : "Copy link"}</span>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </button>
  )
}
