"use client"

import { Check, Copy, Terminal } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { usePackageManager } from "@/components/docs/code-surface-frame"
import { useCopy } from "@/components/docs/preview-frame"
import { buildCommandTabs } from "@/lib/npm-commands"

/** Compact copy-install chip that follows the shared package manager preference. */
export function InstallChip({ command, className }: { command: string; className?: string }) {
  const [pm] = usePackageManager()
  const shown = buildCommandTabs(command)?.[pm] ?? command
  const { copied, copy } = useCopy(shown)
  const Icon = copied ? Check : Copy
  return (
    <div
      className={cn(
        "hidden min-w-0 max-w-[22rem] items-center gap-2 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-2)] py-1 pl-2.5 pr-1 md:flex",
        className
      )}
    >
      <Terminal className="size-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
      <code className="min-w-0 truncate font-mono text-[12px] text-neutral-700 dark:text-neutral-300">{shown}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Install command copied" : "Copy install command"}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-neutral-500 transition-[transform,opacity] duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 dark:text-neutral-400"
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
