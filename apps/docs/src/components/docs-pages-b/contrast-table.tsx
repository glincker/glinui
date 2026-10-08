import { Check, X } from "@phosphor-icons/react/dist/ssr"

import { contrastRatio, gradeContrast, parseOklch } from "@/lib/oklch"

type Pair = { label: string; theme: "Light" | "Dark"; fg: string; bg: string }

/** Values mirror packages/tokens/theme.css. Update both together. */
const PAIRS: Pair[] = [
  { label: "Foreground on background", theme: "Light", fg: "oklch(0.23 0.01 248)", bg: "oklch(0.985 0.002 240)" },
  { label: "Muted on background", theme: "Light", fg: "oklch(0.52 0.014 270)", bg: "oklch(0.985 0.002 240)" },
  { label: "Accent on background", theme: "Light", fg: "oklch(0.55 0.2 289)", bg: "oklch(0.985 0.002 240)" },
  { label: "Accent foreground on accent", theme: "Light", fg: "oklch(0.99 0.003 290)", bg: "oklch(0.55 0.2 289)" },
  { label: "Foreground on background", theme: "Dark", fg: "oklch(0.95 0.01 247)", bg: "oklch(0.168 0.004 264.4)" },
  { label: "Muted on background", theme: "Dark", fg: "oklch(0.646 0.013 286)", bg: "oklch(0.168 0.004 264.4)" },
  { label: "Accent on background", theme: "Dark", fg: "oklch(0.782 0.118 289.4)", bg: "oklch(0.168 0.004 264.4)" },
  { label: "Accent foreground on accent", theme: "Dark", fg: "oklch(0.168 0.004 264.4)", bg: "oklch(0.782 0.118 289.4)" }
]

function Pass({ ok, label }: { ok: boolean; label: string }) {
  const Icon = ok ? Check : X
  return (
    <span className="inline-flex items-center gap-1">
      <Icon
        className={ok ? "size-4 text-emerald-700 dark:text-emerald-400" : "size-4 text-rose-700 dark:text-rose-400"}
        weight="bold"
        aria-hidden="true"
      />
      <span className="sr-only">{ok ? "Passes" : "Fails"} </span>
      {label}
    </span>
  )
}

/** Computes WCAG ratios for core token pairs at render time. */
export function ContrastTable() {
  const rows = PAIRS.flatMap((pair) => {
    const fg = parseOklch(pair.fg)
    const bg = parseOklch(pair.bg)
    if (!fg || !bg) return []
    return [{ ...pair, grade: gradeContrast(contrastRatio(fg, bg)) }]
  })

  return (
    <div className="overflow-x-auto rounded-card border border-line-soft bg-surface-1">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <caption className="sr-only">Contrast ratios for core Glin UI token pairs</caption>
        <thead>
          <tr className="border-b border-line-soft">
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Pair</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Theme</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">Ratio</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">AA 4.5</th>
            <th scope="col" className="type-eyebrow px-4 py-3 font-medium">AAA 7</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-soft">
          {rows.map((row) => (
            <tr key={`${row.theme}-${row.label}`}>
              <th scope="row" className="px-4 py-3 font-normal">{row.label}</th>
              <td className="px-4 py-3 text-muted">{row.theme}</td>
              <td className="px-4 py-3 font-mono">{row.grade.ratio.toFixed(2)}:1</td>
              <td className="px-4 py-3"><Pass ok={row.grade.aa} label={row.grade.aa ? "AA" : "Below AA"} /></td>
              <td className="px-4 py-3"><Pass ok={row.grade.aaa} label={row.grade.aaa ? "AAA" : "Below AAA"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
