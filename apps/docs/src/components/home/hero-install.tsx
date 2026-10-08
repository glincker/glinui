"use client"

import { Check, Copy } from "@phosphor-icons/react"

import { PackageManagerTabs, usePackageManager } from "@/components/docs/code-surface-frame"
import { useCopy } from "@/components/docs/preview-frame"
import { buildCommandTabs } from "@/lib/npm-commands"

import { Surface } from "./surface"

const INSTALL = "pnpm add @glinui/ui @glinui/tokens"

export function HeroInstall() {
  const [pm, setPm] = usePackageManager()
  const shown = buildCommandTabs(INSTALL)?.[pm] ?? INSTALL
  const { copied, copy } = useCopy(shown)
  const Icon = copied ? Check : Copy

  return (
    <Surface elevation={1} className="w-full max-w-[30rem] rounded-[var(--radius-card)] bg-[var(--surface-2)]">
      <div className="border-b border-[var(--line-soft)] px-4">
        <PackageManagerTabs value={pm} onChange={setPm} />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <code className="min-w-0 truncate type-code text-[var(--color-foreground)]">
          <span aria-hidden="true" className="select-none text-[var(--color-subtle)]">$ </span>
          {shown}
        </code>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Install command copied" : "Copy install command"}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[var(--surface-3)] px-2.5 text-xs font-medium text-[var(--color-foreground)] [box-shadow:var(--elev-1)] transition-[transform,background-color] duration-150 ease-[var(--ease-out)] hover:bg-[var(--surface-well)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </Surface>
  )
}
