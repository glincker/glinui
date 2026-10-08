import * as React from "react"

export type KbdRow = { keys: string[]; action: string; context?: string }

/** Keyboard reference table with mono keycaps. */
export function KbdTable({ caption, rows }: { caption: string; rows: KbdRow[] }) {
  return (
    <div className="relative overflow-x-auto rounded-card border border-line-soft bg-surface-1">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line-soft">
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Keys</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Expected behavior</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Where</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={row.keys.join("+") + row.action}>
              <th scope="row" className="whitespace-nowrap px-4 py-3 align-top font-normal">
                <span className="inline-flex items-center gap-1">
                  {row.keys.map((key, index) => (
                    <React.Fragment key={key}>
                      {index > 0 ? <span className="text-muted" aria-hidden="true">+</span> : null}
                      <kbd className="rounded border border-line-soft bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                        {key}
                      </kbd>
                    </React.Fragment>
                  ))}
                </span>
              </th>
              <td className="px-4 py-3 align-top">{row.action}</td>
              <td className="px-4 py-3 align-top text-muted">{row.context ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
