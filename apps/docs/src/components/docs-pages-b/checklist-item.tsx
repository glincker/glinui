import * as React from "react"

import { cn } from "@glinui/ui"

/** List wrapper for ChecklistItem rows. */
export function Checklist({ className, children, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("divide-y divide-line-soft rounded-card border border-line-soft bg-surface-1", className)}
      {...props}
    >
      {children}
    </ul>
  )
}

type ChecklistItemProps = {
  children: React.ReactNode
  /** Optional secondary line under the item. */
  hint?: React.ReactNode
}

/** A real, tickable checkbox row so reviewers can mark items off during QA. */
export function ChecklistItem({ children, hint }: ChecklistItemProps) {
  return (
    <li>
      <label className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-surface-2">
        <input
          type="checkbox"
          className="mt-1 size-4 shrink-0 cursor-pointer rounded border-line-soft accent-[var(--color-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        />
        <span className="type-body min-w-0 max-w-[68ch]">
          {children}
          {hint ? <span className="mt-0.5 block text-sm text-muted">{hint}</span> : null}
        </span>
      </label>
    </li>
  )
}
