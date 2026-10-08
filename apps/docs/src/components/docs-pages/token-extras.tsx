import { CopyChip } from "@/components/hub/copy-chip"
import { glassLevels, typeScale } from "@/components/docs-pages/token-data"

/** Type scale specimens plus the two font stacks. */
export function TypeSpecimens() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-card border border-line-soft bg-surface-1 p-4">
          <CopyChip value="var(--font-sans)" display="--font-sans" label="variable" />
          <p className="mt-2 font-sans text-2xl">Inter</p>
          <p className="font-mono text-[11px] text-muted">Tailwind: font-sans</p>
        </div>
        <div className="rounded-card border border-line-soft bg-surface-1 p-4">
          <CopyChip value="var(--font-mono)" display="--font-mono" label="variable" />
          <p className="mt-2 font-mono text-2xl">JetBrains Mono</p>
          <p className="font-mono text-[11px] text-muted">Tailwind: font-mono</p>
        </div>
      </div>
      <ul aria-label="Type scale" className="divide-y divide-[var(--line-soft)] rounded-card border border-line-soft bg-surface-1">
        {typeScale.map((step) => (
          <li key={step.name} className="grid items-baseline gap-x-4 gap-y-1 px-4 py-3 md:grid-cols-[14rem_minmax(0,1fr)]">
            <div className="min-w-0 space-y-0.5">
              <CopyChip value={`var(${step.name})`} display={step.name} label="variable" />
              <p className="break-words font-mono text-[11px] leading-4 text-muted">{step.value}</p>
            </div>
            <p className={`${step.cls} truncate leading-tight`} aria-hidden="true">
              Quiet interfaces
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Five glass levels over a vivid backdrop. */
export function GlassLevelSpecimens() {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 rounded-card bg-gradient-to-br from-violet-500 via-fuchsia-400 to-amber-300 p-4 sm:grid-cols-5">
        {glassLevels.map((level) => (
          <div key={level.id} className={`${level.id} rounded-input p-3`}>
            <p className="text-sm font-medium text-foreground">{level.id}</p>
            <p className="text-xs text-foreground/80">blur {level.blur}</p>
          </div>
        ))}
      </div>
      <ul aria-label="Glass level tokens" className="grid gap-x-6 gap-y-1 font-mono text-[11px] text-muted sm:grid-cols-2">
        {glassLevels.map((level) => (
          <li key={level.id}>
            --{level.id}-surface, --{level.id}-blur: {level.blur}, opacity {level.opacity}
          </li>
        ))}
      </ul>
    </div>
  )
}
