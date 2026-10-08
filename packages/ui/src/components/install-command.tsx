"use client"

import * as React from "react"

import { cn } from "../lib/cn"
import { CodePanel, type CodePanelProps } from "./code-panel"
import { CopyButton } from "./copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

export type InstallCommandManager = "npm" | "pnpm" | "yarn" | "bun"

const DEFAULT_PREFIX: Record<InstallCommandManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add"
}

export type InstallCommandProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> & {
  /** Package name(s); builds npm / pnpm / yarn / bun commands. Ignored when `commands` is set. */
  packageName?: string
  /** Custom tab label to full command map. Keys become the tabs, in insertion order. */
  commands?: Record<string, string>
  /** Controlled active tab. */
  value?: string
  /** Initial tab when uncontrolled. Defaults to the first tab. */
  defaultValue?: string
  /** Called when the tab changes. */
  onValueChange?: (value: string) => void
  /** Called after a successful copy with the copied command (without the `$`). */
  onCopy?: (command: string, tab: string) => void
  /** Surface variant of the underlying CodePanel. Omit for the ambient design style (glinr canonical, plain flat block, glass opt-in). */
  variant?: CodePanelProps["variant"]
  /** Header title. */
  title?: React.ReactNode
  /** Accessible name of the tab list. */
  tabsLabel?: string
}

function buildCommands(packageName: string): Record<string, string> {
  return Object.fromEntries(
    (Object.keys(DEFAULT_PREFIX) as InstallCommandManager[]).map((manager) => [
      manager,
      `${DEFAULT_PREFIX[manager]} ${packageName}`
    ])
  )
}

/** CodePanel + package manager tabs + CopyButton. Supports controlled and uncontrolled tabs. */
export const InstallCommand = React.forwardRef<HTMLDivElement, InstallCommandProps>(
  (
    {
      packageName = "@glinui/ui",
      commands,
      value,
      defaultValue,
      onValueChange,
      onCopy,
      variant,
      title,
      tabsLabel = "Package manager",
      className,
      ...props
    },
    ref
  ) => {
    const map = React.useMemo(() => commands ?? buildCommands(packageName), [commands, packageName])
    const keys = Object.keys(map)
    const first = keys[0] ?? ""
    const [inner, setInner] = React.useState(defaultValue && map[defaultValue] ? defaultValue : first)
    const isControlled = value !== undefined
    const active = isControlled ? value : inner
    const command = map[active] ?? map[first] ?? ""

    const handleChange = (next: string) => {
      if (!isControlled) setInner(next)
      onValueChange?.(next)
    }

    return (
      <Tabs value={active} onValueChange={handleChange} asChild>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <CodePanel
            variant={variant}
            title={title}
            tabs={
              <TabsList variant="keys" size="sm" aria-label={tabsLabel}>
                {keys.map((key) => (
                  <TabsTrigger key={key} value={key} variant="keys" size="sm">
                    {key}
                  </TabsTrigger>
                ))}
              </TabsList>
            }
            actions={<CopyButton value={command} onCopy={(text) => onCopy?.(text, active)} />}
          >
            {keys.map((key) => (
              <TabsContent key={key} value={key} variant="keys" className="mt-0 p-0" asChild>
                <span>
                  <span className="select-none text-[var(--color-muted)]" aria-hidden="true">
                    {"$ "}
                  </span>
                  <span data-slot="install-command-text">{map[key]}</span>
                </span>
              </TabsContent>
            ))}
          </CodePanel>
        </div>
      </Tabs>
    )
  }
)

InstallCommand.displayName = "InstallCommand"
