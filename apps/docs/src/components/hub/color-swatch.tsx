"use client"

import { CopyChip } from "@/components/hub/copy-chip"
import type { ColorTokenSpec } from "@/components/hub/color-tokens"
import type { TokenMap } from "@/components/hub/use-theme-tokens"
import { contrastRatio, gradeContrast, oklchToHex, parseOklch } from "@/lib/oklch"

function Badge({ pass, label }: { pass: boolean; label: string }) {
  return (
    <span
      className={`rounded px-1 font-mono text-[10px] font-medium leading-4 ring-1 ${
        pass
          ? "bg-signal-ok/15 text-foreground ring-signal-ok/40"
          : "bg-[var(--surface-2)] text-muted ring-[var(--line-soft)] line-through"
      }`}
    >
      {label}
    </span>
  )
}

export function ColorSwatch({ token, live }: { token: ColorTokenSpec; live: TokenMap }) {
  const value = live[token.name] ?? ""
  const color = parseOklch(value)
  const against = parseOklch(live[token.against] ?? "")
  const grade = color && against ? gradeContrast(contrastRatio(color, against)) : null

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl bg-[var(--surface-1)] [box-shadow:var(--elev-1)] ring-1 ring-[var(--line-soft)]">
      <div className={`h-20 ${token.bgClass} border-b border-[var(--line-soft)]`} aria-hidden="true" />
      <div className="space-y-1.5 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[13px] font-medium text-foreground">{token.label}</p>
          <p className="font-mono text-[11px] tabular-nums text-muted">{color ? oklchToHex(color) : "..."}</p>
        </div>
        <div className="-mx-1.5 flex flex-col items-start gap-0.5">
          <CopyChip value={token.name} label="variable name" />
          <CopyChip value={value || "pending"} label="OKLCH value" />
          <CopyChip value={token.usage} label="Tailwind usage" />
        </div>
        {grade ? (
          <div className="flex items-center gap-1 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400 tabular-nums">
            <span className="tabular-nums">{grade.ratio.toFixed(2)}:1</span>
            <Badge pass={grade.aa} label="AA" />
            <Badge pass={grade.aaa} label="AAA" />
            <span className="truncate">vs {token.against.replace("--color-", "").replace("--", "")}</span>
          </div>
        ) : null}
      </div>
    </li>
  )
}
