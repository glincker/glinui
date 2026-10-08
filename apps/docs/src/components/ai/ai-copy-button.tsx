"use client"

import { Check, Sparkle } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { useAiActions } from "./use-ai-actions"

export type AiCopyButtonProps = {
  componentId: string
  title: string
  getFullPrompt: () => string
  markdownUrl: string
  className?: string
}

/** Compact icon button for gallery and hub cards. Copies the full prompt. */
export function AiCopyButton({ componentId, title, getFullPrompt, markdownUrl, className }: AiCopyButtonProps) {
  const actions = useAiActions({ componentId, title, markdownUrl, getFullPrompt })
  const label = actions.copied ? `Prompt for ${title} copied` : `Copy ${title} for AI`
  return (
    <>
      <button
        type="button"
        aria-label={label}
        title="Copy for AI"
        onClick={() => void actions.copyPrompt()}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg border border-line-soft bg-surface-1 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none",
          className
        )}
      >
        {actions.copied ? <Check className="size-4" weight="bold" aria-hidden="true" /> : <Sparkle className="size-4" aria-hidden="true" />}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {actions.message}
      </span>
    </>
  )
}
