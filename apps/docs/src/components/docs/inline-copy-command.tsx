"use client"

import { Check, Copy } from "@phosphor-icons/react"

import { useCopy } from "@/components/docs/preview-frame"

export function InlineCopyCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy(command)
  const Icon = copied ? Check : Copy
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy command: ${command}`}
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 align-middle font-mono text-[12px] text-neutral-600 transition-colors hover:bg-black/[0.05] hover:text-foreground motion-reduce:transition-none dark:text-neutral-300 dark:hover:bg-white/[0.08]"
    >
      <span>{command}</span>
      <Icon className="size-3.5" aria-hidden="true" />
    </button>
  )
}
