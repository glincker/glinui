const ROWS = [
  { level: "full", effect: "Full motion: travel, blur, scale and counters on the selected engine." },
  { level: "subtle", effect: "Opacity fades only. Counters jump to the final value. Applied automatically when prefers-reduced-motion is set." },
  { level: "none", effect: "Static. Final styles are applied immediately, no observers, and no animation library is loaded." },
  { level: "system", effect: "Follows prefers-reduced-motion: full normally, subtle when the visitor asks for less motion." }
] as const

export function LevelsTable() {
  return (
    <div className="overflow-x-auto rounded-card border border-line-soft">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="sr-only">Animation levels</caption>
        <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
          <tr>
            <th scope="col" className="px-3 py-2">Level</th>
            <th scope="col" className="px-3 py-2">Behavior</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.level} className="border-t border-line-soft align-top">
              <th scope="row" className="px-3 py-2 font-mono text-xs">{row.level}</th>
              <td className="px-3 py-2 text-muted">{row.effect}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
