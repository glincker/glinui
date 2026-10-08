import { Callout } from "@/components/docs-pages-b/callout"

/** Measured with esbuild (bundle, minify, gzip -9) against packages/motion on 2026-10-07. */
const ROWS = [
  {
    engine: "css",
    adapter: "3.8 KB",
    library: "none",
    total: "3.8 KB",
    pick: "Default. Reveals, counters and staggers with zero dependencies."
  },
  {
    engine: "motion",
    adapter: "3.8 KB",
    library: "motion animate + inView, about 20 KB",
    total: "24.0 KB",
    pick: "Real spring physics, interruptible animations, gestures later."
  },
  {
    engine: "gsap",
    adapter: "4.0 KB",
    library: "gsap core + ScrollTrigger, about 45 KB",
    total: "48.8 KB",
    pick: "Timelines, scrubbing and teams that already ship GSAP."
  }
] as const

export function EngineSizes() {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-card border border-line-soft">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <caption className="sr-only">Gzipped bundle cost per animation engine</caption>
          <thead className="bg-surface-2 text-xs uppercase tracking-wide text-muted">
            <tr>
              <th scope="col" className="px-3 py-2">Engine</th>
              <th scope="col" className="px-3 py-2">Adapter (gzip)</th>
              <th scope="col" className="px-3 py-2">Library</th>
              <th scope="col" className="px-3 py-2">Total (gzip)</th>
              <th scope="col" className="px-3 py-2">Pick it for</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.engine} className="border-t border-line-soft align-top">
                <th scope="row" className="px-3 py-2 font-mono text-xs">{row.engine}</th>
                <td className="px-3 py-2 tabular-nums">{row.adapter}</td>
                <td className="px-3 py-2 text-muted">{row.library}</td>
                <td className="px-3 py-2 font-medium tabular-nums">{row.total}</td>
                <td className="px-3 py-2 text-muted">{row.pick}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout variant="tip" title="Only the selected engine is loaded">
        The core ships only the css engine and has zero dependencies. motion and gsap are opt-in: register them once
        and they load with a dynamic import on first use. The off state never loads a library, and the shared core
        (registry, levels, css engine) is about 4.7 KB gzipped.
      </Callout>
    </div>
  )
}
