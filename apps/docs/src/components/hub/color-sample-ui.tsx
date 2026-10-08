"use client"

import type { ThemeSheets } from "@/components/hub/use-theme-tokens"

function Sample({ title }: { title: string }) {
  return (
    <div className="space-y-4 rounded-2xl bg-[var(--color-background)] p-5 text-[var(--color-foreground)] ring-1 ring-[var(--line-soft)]">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-muted)]">{title}</p>
      <div className="space-y-3 rounded-xl bg-[var(--surface-1)] p-4 [box-shadow:var(--elev-2)] ring-1 ring-[var(--line-soft)]">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium">Deploy preview</h3>
          <span className="rounded-full bg-signal-ok/15 px-2 py-0.5 text-[11px] font-medium text-[var(--color-foreground)] ring-1 ring-signal-ok/40">
            Healthy
          </span>
        </div>
        <p className="text-[13px] leading-5 text-[var(--color-muted)]">Surfaces stack, text stays readable, accent marks the one action.</p>
        <input
          readOnly
          tabIndex={-1}
          value="glin-ui.dev"
          aria-label={`${title} sample input`}
          className="h-9 w-full rounded-lg bg-[var(--surface-well)] px-3 text-[13px] text-[var(--color-foreground)] [box-shadow:var(--elev-inset)] outline-none"
        />
        <div className="flex gap-2">
          <span className="inline-flex h-9 items-center rounded-lg bg-[var(--color-accent)] px-4 text-[13px] font-medium text-[var(--color-accent-foreground)]">
            Publish
          </span>
          <span className="inline-flex h-9 items-center rounded-lg bg-[var(--surface-2)] px-4 text-[13px] font-medium ring-1 ring-[var(--line-soft)]">
            Cancel
          </span>
        </div>
      </div>
    </div>
  )
}

/** Light and dark panels, each scoped to its own token set so both stay accurate whatever theme the page is in. */
export function ColorSampleUi({ sheets }: { sheets: ThemeSheets | null }) {
  const lightDecls = sheets
    ? Object.entries(sheets.light)
        .map(([k, v]) => `${k}:${v};`)
        .join("")
    : ""
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {lightDecls ? <style>{`.hub-theme-light.hub-theme-light{${lightDecls}}`}</style> : null}
      <div className="hub-theme-light">
        <Sample title="Light" />
      </div>
      <div className="dark">
        <Sample title="Dark" />
      </div>
    </div>
  )
}
