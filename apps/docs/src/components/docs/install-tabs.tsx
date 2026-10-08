"use client"

import * as React from "react"
import { FileCode, Terminal } from "@phosphor-icons/react"

import { cn } from "@glinui/ui"
import { CodeBlock } from "@/components/docs/code-block"
import { CodeSurfaceFrame, PackageManagerTabs, usePackageManager } from "@/components/docs/code-surface-frame"
import { buildCommandTabs } from "@/lib/npm-commands"

type SourceFile = {
  fileName: string
  code: string
  language: string
}

type InstallTabsProps = {
  command: string
  sources?: SourceFile[]
  className?: string
}

type InstallMode = "cli" | "manual"

export function InstallTabs({ command, sources, className }: InstallTabsProps) {
  const [mode, setMode] = React.useState<InstallMode>("cli")
  const [activePm, setActivePm] = usePackageManager()
  const [activeFileIndex, setActiveFileIndex] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  const tabs = React.useMemo(() => buildCommandTabs(command), [command])

  const hasSources = sources && sources.length > 0
  const activeSource = sources?.[activeFileIndex]

  const copyText = mode === "manual" && activeSource
    ? activeSource.code
    : tabs?.[activePm] ?? command

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }, [copyText])

  if (!tabs && !hasSources) {
    return (
      <div
        className={cn(
          "rounded-xl border border-[var(--line-soft)] bg-[var(--surface-well)] p-4 font-mono text-[13px] leading-[1.7] [box-shadow:var(--elev-1)]",
          className
        )}
      >
        <code>{command}</code>
      </div>
    )
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* CLI / Manual toggle */}
      {hasSources ? (
        <div
          role="tablist"
          aria-label="Installation method"
          className="inline-flex gap-0.5 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-well)] p-0.5"
        >
          {(["cli", "manual"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                mode === m
                  ? "bg-[var(--surface-1)] text-neutral-900 [box-shadow:var(--elev-1)] dark:text-neutral-50"
                  : "text-muted hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              {m === "cli" ? <Terminal className="size-3.5" aria-hidden /> : <FileCode className="size-3.5" aria-hidden />}
              {m === "cli" ? "CLI" : "Manual"}
            </button>
          ))}
        </div>
      ) : null}

      {/* CLI view */}
      {mode === "cli" && tabs ? (
        <CodeSurfaceFrame
          copied={copied}
          onCopy={() => void handleCopy()}
          copyLabel="Copy install command"
          copyHint="Copy install"
          left={<PackageManagerTabs value={activePm} onChange={setActivePm} />}
        >
          <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-[1.7]">
            <code className="font-mono text-neutral-800 dark:text-neutral-100">{tabs[activePm]}</code>
          </pre>
        </CodeSurfaceFrame>
      ) : null}

      {/* Manual view */}
      {mode === "manual" && hasSources ? (
        <div className="space-y-2">
          <p className="text-[13px] text-muted dark:text-neutral-400">
            Copy and paste the following code into your project.
          </p>

          {/* File tabs (if multiple files) */}
          {sources.length > 1 ? (
            <div
              role="tablist"
              aria-label="Source files"
              className="inline-flex gap-0.5 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-well)] p-0.5"
            >
              {sources.map((source, index) => (
                <button
                  key={source.fileName}
                  type="button"
                  role="tab"
                  aria-selected={activeFileIndex === index}
                  onClick={() => setActiveFileIndex(index)}
                  className={cn(
                    "rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors duration-150 motion-reduce:transition-none",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                    activeFileIndex === index
                      ? "bg-[var(--surface-1)] text-neutral-900 [box-shadow:var(--elev-1)] dark:text-neutral-50"
                      : "text-muted hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  )}
                >
                  {source.fileName}
                </button>
              ))}
            </div>
          ) : null}

          {activeSource ? (
            <CodeBlock
              code={activeSource.code}
              language={activeSource.language}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
