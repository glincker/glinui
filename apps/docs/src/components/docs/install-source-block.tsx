"use client"

import * as React from "react"
import { getRegistryItem } from "@glinui/registry"

import { cn } from "@glinui/ui"
import { InstallTabs } from "@/components/docs/install-tabs"
import { OriginalSourceCard } from "@/components/docs/original-source-card"
import {
  buildInstallSources,
  buildShadcnCommand,
  resolveInstallSource,
  type InstallSourceId
} from "@/lib/provenance"

type InstallTabsProps = React.ComponentProps<typeof InstallTabs>

type InstallSourceBlockProps = {
  componentId: string
  /** The Glin CLI command, shown through the package manager tabs. */
  command: string
  sources?: InstallTabsProps["sources"]
  className?: string
}

/** Install block with an "Install from" selector: Glin, shadcn and (for adapted items) Original. */
export function InstallSourceBlock({ componentId, command, sources, className }: InstallSourceBlockProps) {
  const provenance = getRegistryItem(componentId)?.provenance ?? null
  const options = React.useMemo(() => buildInstallSources(provenance), [provenance])
  const [selected, setSelected] = React.useState<InstallSourceId>("glin")
  const active = resolveInstallSource(selected, options)
  const groupId = React.useId()

  return (
    <div className={cn("space-y-3", className)} data-install-source={active}>
      <div className="flex flex-wrap items-center gap-2">
        <span id={`${groupId}-label`} className="text-[12px] font-medium text-neutral-500 dark:text-neutral-400">
          Install from
        </span>
        <div
          role="radiogroup"
          aria-labelledby={`${groupId}-label`}
          className="inline-flex gap-0.5 rounded-lg border border-[var(--line-soft)] bg-[var(--surface-well)] p-0.5"
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active === option.id}
              onClick={() => setSelected(option.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 motion-reduce:transition-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
                active === option.id
                  ? "bg-[var(--surface-1)] text-neutral-900 [box-shadow:var(--elev-1)] dark:text-neutral-50"
                  : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {active === "glin" ? <InstallTabs command={command} sources={sources} /> : null}
      {active === "shadcn" ? (
        <div className="space-y-2">
          <InstallTabs command={buildShadcnCommand(componentId)} />
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
            Uses the shadcn registry JSON served at glinui.com/r. Files are copied into your project with your aliases.
          </p>
        </div>
      ) : null}
      {active === "original" && provenance ? <OriginalSourceCard provenance={provenance} /> : null}
    </div>
  )
}
