import * as React from "react"
import { Info, Lightbulb, Warning } from "@phosphor-icons/react/dist/ssr"

import { cn } from "@glinui/ui"

type CalloutVariant = "note" | "warning" | "tip"

const VARIANTS = {
  note: { label: "Note", Icon: Info, tone: "text-accent" },
  warning: { label: "Warning", Icon: Warning, tone: "text-amber-700 dark:text-amber-400" },
  tip: { label: "Tip", Icon: Lightbulb, tone: "text-emerald-700 dark:text-emerald-400" }
} as const

type CalloutProps = {
  variant?: CalloutVariant
  title?: string
  className?: string
  children: React.ReactNode
}

/** Flat inline callout for notes, warnings, and tips. */
export function Callout({ variant = "note", title, className, children }: CalloutProps) {
  const { label, Icon, tone } = VARIANTS[variant]
  return (
    <aside
      role="note"
      aria-label={title ?? label}
      className={cn("flex gap-3 rounded-card border border-line-soft bg-surface-1 p-4", className)}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", tone)} weight="bold" aria-hidden="true" />
      <div className="type-body min-w-0 space-y-1 text-muted">
        <p className="font-medium text-foreground">{title ?? label}</p>
        <div className="max-w-[68ch] [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">
          {children}
        </div>
      </div>
    </aside>
  )
}
