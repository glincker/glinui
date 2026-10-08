import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr"
import type { Provenance } from "@glinui/registry"

import { adaptedBadgeLabel } from "@/lib/provenance"

/** "Adapted from <Name>" credit link shown in the component page header. */
export function AdaptedBadge({ provenance }: { provenance: Provenance }) {
  return (
    <a
      href={provenance.upstreamComponentUrl ?? provenance.upstreamUrl}
      target="_blank"
      rel="noreferrer"
      data-testid="adapted-badge"
      className="inline-flex items-center gap-1 rounded-full border border-[var(--line-soft)] bg-[var(--surface-1)] px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-neutral-600 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] motion-reduce:transition-none dark:text-neutral-300"
    >
      {adaptedBadgeLabel(provenance)}
      <ArrowSquareOut className="size-3" aria-hidden="true" />
    </a>
  )
}
