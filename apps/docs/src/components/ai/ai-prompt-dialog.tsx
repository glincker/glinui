"use client"

import { Check, Copy } from "@phosphor-icons/react"
import { Button, Modal, ModalContent, ModalDescription, ModalHeader, ModalTitle } from "@glinui/ui"

import { useCopyToClipboard } from "./use-copy-to-clipboard"

type AiPromptDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  prompt: string
}

/** Transparency: shows exactly what "Copy for AI" puts on the clipboard. */
export function AiPromptDialog({ open, onOpenChange, title, prompt }: AiPromptDialogProps) {
  const { copied, copy } = useCopyToClipboard()
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-[min(42rem,calc(100vw-2rem))]">
        <ModalHeader>
          <ModalTitle>Prompt for {title}</ModalTitle>
          <ModalDescription>This is the text Copy for AI puts on your clipboard.</ModalDescription>
        </ModalHeader>
        <pre
          tabIndex={0}
          aria-label={`Prompt text for ${title}`}
          className="max-h-[50vh] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-line-soft bg-surface-2 p-3 font-mono text-xs leading-relaxed text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <code>{prompt}</code>
        </pre>
        <div className="flex justify-end pt-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => void copy(prompt)}>
            {copied ? <Check className="size-4" weight="bold" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy prompt"}
          </Button>
        </div>
      </ModalContent>
    </Modal>
  )
}
