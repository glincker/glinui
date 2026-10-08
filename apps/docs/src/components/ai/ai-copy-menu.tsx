"use client"

import * as React from "react"
import { Check, CaretDown, FileText, Eye, Copy, Sparkle, ArrowSquareOut } from "@phosphor-icons/react"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@glinui/ui"

import { BrandIcon } from "@/components/brand/brand-icon"
import { AI_TARGETS } from "@/lib/ai-targets"
import { AiPromptDialog } from "./ai-prompt-dialog"
import { useAiActions } from "./use-ai-actions"

export type AiCopyMenuProps = {
  componentId: string
  title: string
  getFullPrompt: () => string
  /** Public markdown page, for example `${SITE_URL}/md/<id>.md`. */
  markdownUrl: string
  /** Optional inline markdown; otherwise it is fetched from `markdownUrl`. */
  getMarkdown?: () => string
}

const ITEM = "gap-2.5"
const HINT = "ml-auto pl-3 text-[11px] text-[var(--color-muted)]"

/** Split button: "Copy for AI" copies the full prompt, the chevron lists every other way to hand it to a tool. */
export function AiCopyMenu({ componentId, title, getFullPrompt, markdownUrl, getMarkdown }: AiCopyMenuProps) {
  const actions = useAiActions({ componentId, title, markdownUrl, getFullPrompt, getMarkdown })
  const [promptOpen, setPromptOpen] = React.useState(false)
  const [promptText, setPromptText] = React.useState("")

  const showPrompt = () => {
    setPromptText(getFullPrompt())
    setPromptOpen(true)
  }

  return (
    <div className="relative inline-flex max-w-full">
      <div className="inline-flex" role="group" aria-label={`Copy ${title} for AI`}>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="gap-2 rounded-r-none"
          onClick={() => void actions.copyPrompt()}
        >
          {actions.copied ? (
            <Check className="size-4" weight="bold" aria-hidden="true" />
          ) : (
            <Sparkle className="size-4" aria-hidden="true" />
          )}
          {actions.copied ? "Copied" : "Copy for AI"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="sm"
              variant="secondary"
              aria-label={`More AI options for ${title}`}
              className="-ml-px h-8 rounded-l-none px-2"
            >
              <CaretDown className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            collisionPadding={12}
            className="max-h-[var(--radix-dropdown-menu-content-available-height)] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto"
          >
            <DropdownMenuItem className={ITEM} onSelect={() => void actions.copyPrompt()}>
              <Copy className="size-4" aria-hidden="true" />
              Copy prompt
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} onSelect={() => void actions.copyMarkdown()}>
              <FileText className="size-4" aria-hidden="true" />
              Copy as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} onSelect={actions.viewMarkdown}>
              <ArrowSquareOut className="size-4" aria-hidden="true" />
              View as Markdown
            </DropdownMenuItem>
            <DropdownMenuItem className={ITEM} onSelect={showPrompt}>
              <Eye className="size-4" aria-hidden="true" />
              View prompt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Open in</DropdownMenuLabel>
            {AI_TARGETS.filter((t) => t.openUrl !== null).map((target) => (
              <DropdownMenuItem key={target.id} className={ITEM} onSelect={() => actions.openTarget(target)}>
                {target.brandSlug ? <BrandIcon name={target.brandSlug} size={16} variant="mono" /> : null}
                {target.label}
                <span className={HINT}>{actions.hint(target)}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <span
        role="status"
        aria-live="polite"
        className={
          actions.message
            ? "absolute right-0 top-full z-10 mt-2 w-max max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-line-soft bg-surface-1 px-3 py-1.5 text-xs text-foreground shadow-sm"
            : "sr-only"
        }
      >
        {actions.message}
      </span>
      <AiPromptDialog open={promptOpen} onOpenChange={setPromptOpen} title={title} prompt={promptText} />
    </div>
  )
}
