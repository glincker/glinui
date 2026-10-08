import { CopyChip } from "@/components/hub/copy-chip"
import type { TokenRowData } from "@/components/docs-pages/token-data"

/** A list of tokens: live specimen, copyable variable name, resolved values, note. */
export function TokenList({ rows, label }: { rows: TokenRowData[]; label: string }) {
  return (
    <ul aria-label={label} className="divide-y divide-[var(--line-soft)] rounded-card border border-line-soft bg-surface-1">
      {rows.map((row) => (
        <li key={row.name} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[3.25rem_minmax(0,16rem)_minmax(0,1fr)]">
          <div aria-hidden="true" className="flex h-9 items-center justify-center">
            <div className={`flex ${row.box}`}>{row.name === "--ring" ? <span /> : null}</div>
          </div>
          <div className="min-w-0 space-y-0.5">
            <CopyChip value={`var(${row.name})`} display={row.name} label="variable" />
            <p className="break-words font-mono text-[11px] leading-4 text-muted">
              {row.light}
              {row.dark ? ` / dark ${row.dark}` : ""}
            </p>
          </div>
          {row.note ? <p className="col-span-2 text-[13px] leading-relaxed text-muted sm:col-span-1">{row.note}</p> : null}
        </li>
      ))}
    </ul>
  )
}
