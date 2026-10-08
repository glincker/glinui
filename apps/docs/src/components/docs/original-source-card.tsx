"use client"

import { ArrowSquareOut, Info, Warning } from "@phosphor-icons/react"
import type { Provenance } from "@glinui/registry"

import { cn } from "@glinui/ui"
import { CodeSurfaceFrame } from "@/components/docs/code-surface-frame"
import { useCopy } from "@/components/docs/preview-frame"
import { getOriginalModel, type StatusTone } from "@/lib/provenance"

const TONE_CLASS: Record<StatusTone, string> = {
  ok: "border-emerald-300/50 bg-emerald-100/60 text-emerald-700 dark:border-emerald-400/35 dark:bg-emerald-400/15 dark:text-emerald-300",
  warn: "border-amber-300/50 bg-amber-100/60 text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300",
  bad: "border-red-300/50 bg-red-100/60 text-red-700 dark:border-red-400/35 dark:bg-red-400/15 dark:text-red-300"
}

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  return (
    <span
      data-status-tone={tone}
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]",
        TONE_CLASS[tone]
      )}
    >
      {label}
    </span>
  )
}

function UpstreamCommand({ command }: { command: string }) {
  const { copied, copy } = useCopy(command)
  return (
    <CodeSurfaceFrame copied={copied} onCopy={() => void copy()} copyLabel="Copy the original install command" copyHint="Copy install">
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.7]">
        <code className="font-mono text-neutral-800 dark:text-neutral-100">{command}</code>
      </pre>
    </CodeSurfaceFrame>
  )
}

/** "Original" source of the install selector: credit, their command when known, status. */
export function OriginalSourceCard({ provenance }: { provenance: Provenance }) {
  const model = getOriginalModel(provenance)
  return (
    <div className="space-y-3 rounded-card border border-line-soft bg-surface-1 p-4" data-testid="original-source-card">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-foreground">{model.heading}</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-neutral-500 dark:text-neutral-400">{model.license}</span>
          <StatusBadge label={model.statusLabel} tone={model.statusTone} />
        </div>
      </div>

      {model.statusMessage ? (
        <p className="flex gap-2 text-[13px] text-amber-700 dark:text-amber-300" role="status">
          <Warning className="mt-0.5 size-4 shrink-0" weight="bold" aria-hidden="true" />
          {model.statusMessage}
        </p>
      ) : null}

      {model.installCommand && model.installLabel && provenance.status === "active" ? (
        <div className="space-y-1.5">
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400">{model.installLabel}</p>
          <UpstreamCommand command={model.installCommand} />
        </div>
      ) : null}

      <a
        href={model.creditUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-accent)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      >
        {model.creditLabel}
        <ArrowSquareOut className="size-3.5" aria-hidden="true" />
      </a>

      <p className="flex gap-2 text-[12px] text-neutral-500 dark:text-neutral-400">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {model.disclaimer}
      </p>
    </div>
  )
}
